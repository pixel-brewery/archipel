// #region Imports

import { Controller, Get, type INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { ProblemDetailExceptionFilter } from '@pixel-brewery/archipel-platform-core';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { InvalidMfaCodeError } from './InvalidMfaCodeError.js';

// #endregion

class MfaErrorController {
    public fail(): never {
        throw new InvalidMfaCodeError();
    }
}

Controller('mfa-error')(MfaErrorController);
const failMethod = Object.getOwnPropertyDescriptor(MfaErrorController.prototype, 'fail');
if (failMethod === undefined) {
    throw new Error('MfaErrorController.fail is missing');
}
Get()(MfaErrorController.prototype, 'fail', failMethod);

describe('InvalidMfaCodeError', () => {
    let app: INestApplication;

    beforeEach(async () => {
        const moduleRef = await Test.createTestingModule({ controllers: [MfaErrorController] }).compile();
        app = moduleRef.createNestApplication();
        app.useGlobalFilters(new ProblemDetailExceptionFilter());
        await app.listen(0, '127.0.0.1');
    });

    afterEach(async () => {
        await app.close();
        vi.restoreAllMocks();
    });

    it('should return a stable problem response for an invalid setup code', async () => {
        // arrange
        const url = `${await app.getUrl()}/mfa-error`;

        // act
        const response = await fetch(url);

        // assert
        expect(response.status).toBe(400);
        expect(response.headers.get('content-type')).toContain('application/problem+json');
        await expect(response.json()).resolves.toMatchObject({
            status: 400,
            title: 'Invalid MFA Code',
            detail: 'The multi-factor authentication code is invalid.',
            instance: '/mfa-error',
            code: 'INVALID_MFA_CODE',
        });
    });
});
