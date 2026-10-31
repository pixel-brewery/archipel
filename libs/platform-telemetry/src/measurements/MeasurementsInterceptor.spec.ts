import type { CallHandler, ExecutionContext } from '@nestjs/common';
import { lastValueFrom, of, throwError } from 'rxjs';
import { describe, expect, it, vi } from 'vitest';
import type { MeasurementsService } from './MeasurementsService.js';
import { MeasurementsInterceptor } from './MeasurementsInterceptor.js';
import type { DiagnosticsService } from './DiagnosticsService.js';

describe('MeasurementsInterceptor', () => {
    it('reports a server failure once with a route template and rethrows the original value', async () => {
        const recordHttpRequest = vi.fn();
        const failure = vi.fn();
        const interceptor = new MeasurementsInterceptor({ recordHttpRequest } as unknown as MeasurementsService, { failure } as unknown as DiagnosticsService);
        const context = {
            getType: () => 'http',
            switchToHttp: () => ({
                getRequest: () => ({ method: 'POST', url: '/users/private-record?token=private', route: { path: '/users/:id' } }),
                getResponse: () => ({ statusCode: 200 }),
            }),
        } as unknown as ExecutionContext;
        const original = new Error('private database parameters');
        await expect(lastValueFrom(interceptor.intercept(context, { handle: () => throwError(() => original) }))).rejects.toBe(original);
        expect(failure).toHaveBeenCalledExactlyOnceWith('http', 'request', original, { method: 'POST', path: '/users/:id', status: '500' });
        expect(recordHttpRequest).toHaveBeenCalledExactlyOnceWith('POST', '/users/:id', '500', expect.any(Number));
    });

    it('keeps client errors out of operational alarms and survives a throwing diagnostic observer', async () => {
        const recordHttpRequest = vi.fn();
        const failure = vi.fn(() => {
            throw new Error('observer failed');
        });
        const interceptor = new MeasurementsInterceptor({ recordHttpRequest } as unknown as MeasurementsService, { failure } as unknown as DiagnosticsService);
        const context = {
            getType: () => 'http',
            switchToHttp: () => ({ getRequest: () => ({ method: 'GET' }), getResponse: () => ({ statusCode: 200 }) }),
        } as unknown as ExecutionContext;
        const clientError = { status: 400 };
        await expect(lastValueFrom(interceptor.intercept(context, { handle: () => throwError(() => clientError) }))).rejects.toBe(clientError);
        expect(failure).not.toHaveBeenCalled();
        const serverError = { status: 503 };
        await expect(lastValueFrom(interceptor.intercept(context, { handle: () => throwError(() => serverError) }))).rejects.toBe(serverError);
        expect(recordHttpRequest).toHaveBeenLastCalledWith('GET', 'unmatched', '503', expect.any(Number));
        const exoticError = Object.defineProperty({}, 'status', {
            get: () => {
                throw new Error('accessor failed');
            },
        });
        await expect(lastValueFrom(interceptor.intercept(context, { handle: () => throwError(() => exoticError) }))).rejects.toBe(exoticError);
        expect(failure).toHaveBeenLastCalledWith('http', 'request', exoticError, { method: 'GET', path: 'unmatched', status: '500' });
        expect(recordHttpRequest).toHaveBeenLastCalledWith('GET', 'unmatched', '500', expect.any(Number));
    });

    it('records a stable route template once after a completed HTTP request', async () => {
        const recordHttpRequest = vi.fn();
        const interceptor = new MeasurementsInterceptor({ recordHttpRequest } as unknown as MeasurementsService);
        const context = {
            getType: () => 'http',
            switchToHttp: () => ({
                getRequest: () => ({ method: 'GET', baseUrl: '/api/private-record-id', route: { path: '/users/:id' } }),
                getResponse: () => ({ statusCode: 200 }),
            }),
        } as unknown as ExecutionContext;
        const next = { handle: () => of('ok') } as CallHandler;

        await lastValueFrom(interceptor.intercept(context, next));

        expect(recordHttpRequest).toHaveBeenCalledTimes(1);
        expect(recordHttpRequest).toHaveBeenCalledWith('GET', '/users/:id', '200', expect.any(Number));
    });

    it('records the exception status and avoids raw path labels', async () => {
        const recordHttpRequest = vi.fn();
        const interceptor = new MeasurementsInterceptor({ recordHttpRequest } as unknown as MeasurementsService);
        const context = {
            getType: () => 'http',
            switchToHttp: () => ({
                getRequest: () => ({ method: 'GET', path: '/users/secret-record-id' }),
                getResponse: () => ({ statusCode: 200 }),
            }),
        } as unknown as ExecutionContext;
        const next = { handle: () => throwError(() => ({ status: 404 })) } as CallHandler;

        await expect(lastValueFrom(interceptor.intercept(context, next))).rejects.toEqual({ status: 404 });

        expect(recordHttpRequest).toHaveBeenCalledWith('GET', 'unmatched', '404', expect.any(Number));
    });
});
