// #region Imports

import { Controller, Get, Injectable, Module, UnauthorizedException, UseGuards, type CanActivate } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { EventEmitter } from 'node:events';
import type { IncomingMessage, ServerResponse } from 'node:http';
import { MeasurementsModule } from './MeasurementsModule.js';
import { MeasurementSinkBase } from './abstracts/MeasurementSinkBase.js';
import { MeasurementsMiddleware } from './MeasurementsMiddleware.js';
import { MeasurementsService } from './MeasurementsService.js';
import type { Request, Response, NextFunction } from 'express';

// #endregion

class CaptureSink extends MeasurementSinkBase {
    public records: Array<{ name: string; value: number; attributes: Readonly<Record<string, string>> }> = [];
    public record(name: string, value: number, attributes: Readonly<Record<string, string>>): void {
        this.records.push({ name, value, attributes });
    }
}

class RejectGuard implements CanActivate {
    public canActivate(): boolean {
        throw new UnauthorizedException();
    }
}

class FixtureController {
    public get(): { ok: boolean } {
        return { ok: true };
    }
    public guarded(): void {
        throw new Error('Guard must reject first');
    }
}

Injectable()(CaptureSink);
Injectable()(RejectGuard);
Controller('items')(FixtureController);
Get(':id')(FixtureController.prototype, 'get', Object.getOwnPropertyDescriptor(FixtureController.prototype, 'get')!);
Get('private/:id')(FixtureController.prototype, 'guarded', Object.getOwnPropertyDescriptor(FixtureController.prototype, 'guarded')!);
UseGuards(RejectGuard)(FixtureController.prototype, 'guarded', Object.getOwnPropertyDescriptor(FixtureController.prototype, 'guarded')!);

class FixtureModule {}
Module({
    imports: [MeasurementsModule.register({ sink: CaptureSink, httpLifecycle: true, httpInterceptor: true })],
    controllers: [FixtureController],
    providers: [RejectGuard],
})(FixtureModule);

describe('HTTP response lifecycle measurements', () => {
    afterEach(() => vi.restoreAllMocks());

    it('records a premature close once as a client abort even if finish arrives later', () => {
        // arrange
        const sink = new CaptureSink();
        const middleware = new MeasurementsMiddleware(new MeasurementsService(sink));
        const request = { method: 'GET', route: { path: '/events' } } as unknown as IncomingMessage & { route: { path: string } };
        const response = Object.assign(new EventEmitter(), { statusCode: 200, writableFinished: false });
        const next = vi.fn();
        middleware.use(request, response as unknown as ServerResponse, next);

        // act
        response.emit('close');
        response.emit('finish');

        // assert
        expect(next).toHaveBeenCalledOnce();
        expect(sink.records).toHaveLength(2);
        expect(sink.records).toContainEqual({ name: 'http_requests_total', value: 1, attributes: { method: 'GET', path: '/events', status: '499' } });
        expect(response.listenerCount('finish')).toBe(0);
        expect(response.listenerCount('close')).toBe(0);
    });

    it('records successful, guard-rejected and unmatched requests once, without concrete URLs or query values', async () => {
        // arrange
        const module = await Test.createTestingModule({ imports: [FixtureModule] }).compile();
        const app = module.createNestApplication({ logger: ['error'], abortOnError: false });
        await app.listen(0, '127.0.0.1');
        try {
            const base = await app.getUrl();
            // act
            for (const path of ['/items/123?secret=private', '/items/private/456', '/unknown/private']) {
                const response = await fetch(base + path);
                await response.text();
            }
            // assert
            const records = module.get(CaptureSink).records;
            const counts = records.filter((record) => record.name === 'http_requests_total');
            expect(counts.map((record) => record.attributes)).toEqual([
                { method: 'GET', path: '/items/:id', status: '200' },
                { method: 'GET', path: '/items/private/:id', status: '401' },
                { method: 'GET', path: 'unmatched', status: '404' },
            ]);
            expect(records.filter((record) => record.name === 'http_request_duration_ms')).toHaveLength(3);
            const serializedMetadata = JSON.stringify(records.map(({ name, attributes }) => ({ name, attributes })));
            expect(serializedMetadata).not.toContain('123');
            expect(serializedMetadata).not.toContain('secret');
        } finally {
            await app.close();
        }
    });

    it('captures responses completed by host middleware before Nest routes without double recording', async () => {
        // arrange
        const module = await Test.createTestingModule({
            imports: [MeasurementsModule.register({ sink: CaptureSink, httpLifecycle: 'manual' })],
            controllers: [FixtureController],
            providers: [RejectGuard],
        }).compile();
        const app = module.createNestApplication({ logger: ['error'], abortOnError: false });
        const middleware = app.get(MeasurementsMiddleware);
        app.use(middleware.use.bind(middleware));
        app.use((request: Request, response: Response, next: NextFunction) => {
            if (request.headers['x-fixture-reject']) response.status(429).end();
            else next();
        });
        await app.listen(0, '127.0.0.1');
        try {
            const base = await app.getUrl();
            // act
            const rejected = await fetch(`${base}/private-value`, { headers: { 'x-fixture-reject': 'true' } });
            await rejected.text();
            const accepted = await fetch(`${base}/items/123`);
            await accepted.text();
            // assert
            expect(module.get(CaptureSink).records.filter((record) => record.name === 'http_requests_total')).toEqual([
                { name: 'http_requests_total', value: 1, attributes: { method: 'GET', path: 'unmatched', status: '429' } },
                { name: 'http_requests_total', value: 1, attributes: { method: 'GET', path: '/items/:id', status: '200' } },
            ]);
            expect(JSON.stringify(module.get(CaptureSink).records)).not.toContain('private-value');
        } finally {
            await app.close();
        }
    });
});
