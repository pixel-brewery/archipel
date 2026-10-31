// #region Imports

import { Controller, Delete, Get, HttpCode, HttpStatus, SerializeOptions } from '@nestjs/common';
import type { INestApplication } from '@nestjs/common';
import { ResponseReturn2 } from '@pixel-brewery/archipel-platform-core';
import { Test } from '@nestjs/testing';
import { OpenAPIObject, SwaggerModule } from '@nestjs/swagger';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { z } from 'zod';
import { Api } from './Api.js';

// #endregion

const UserResponseSchema = z
    .strictObject({
        id: z.string().uuid(),
    })
    .meta({ id: 'UserResponse' });
const UserResponseEnvelopeSchema = ResponseReturn2.schema(UserResponseSchema);

class StandardSchema2Controller {
    public async getUser(): Promise<ResponseReturn2<z.output<typeof UserResponseSchema>>> {
        return ResponseReturn2.ok(UserResponseSchema, {
            id: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
        });
    }

    public async deleteUser(): Promise<void> {
        return Promise.resolve(ResponseReturn2.noContent());
    }
}

const getUserDescriptor = Object.getOwnPropertyDescriptor(StandardSchema2Controller.prototype, 'getUser');

if (!getUserDescriptor) {
    throw new Error('Expected the test controller method descriptor.');
}

Api({
    responses: {
        status: HttpStatus.OK,
        description: 'Schema-native user response.',
        standardSchema: UserResponseEnvelopeSchema,
    },
})(StandardSchema2Controller.prototype, 'getUser', getUserDescriptor);
SerializeOptions({ schema: UserResponseEnvelopeSchema })(StandardSchema2Controller.prototype, 'getUser', getUserDescriptor);
Get()(StandardSchema2Controller.prototype, 'getUser', getUserDescriptor);
Controller('standard-schema-2')(StandardSchema2Controller);

const deleteUserDescriptor = Object.getOwnPropertyDescriptor(StandardSchema2Controller.prototype, 'deleteUser');

if (!deleteUserDescriptor) {
    throw new Error('Expected the no-content test controller method descriptor.');
}

Api({
    responses: {
        status: HttpStatus.NO_CONTENT,
        description: 'User deleted.',
    },
})(StandardSchema2Controller.prototype, 'deleteUser', deleteUserDescriptor);
HttpCode(HttpStatus.NO_CONTENT)(StandardSchema2Controller.prototype, 'deleteUser', deleteUserDescriptor);
Delete(':id')(StandardSchema2Controller.prototype, 'deleteUser', deleteUserDescriptor);

// #region Tests

describe('Api Standard Schema 2 responses', () => {
    let application: INestApplication | undefined;

    afterEach(async () => {
        if (application) {
            await application.close();
        }
        vi.restoreAllMocks();
    });

    it('documents the complete schema-native wire envelope', async () => {
        // arrange
        const testingModule = await Test.createTestingModule({
            controllers: [StandardSchema2Controller],
        }).compile();
        application = testingModule.createNestApplication();
        await application.init();

        // act
        const document = SwaggerModule.createDocument(application, {
            openapi: '3.0.0',
            info: { title: 'Standard Schema 2 test', version: '1.0.0' },
            paths: {},
        });

        // assert
        expect(getResponseSchema(document)).toEqual({ $ref: '#/components/schemas/ResponseReturn2UserResponse' });
        expect(document.components?.schemas?.['UserResponse']).toMatchObject({
            type: 'object',
            required: ['id'],
            additionalProperties: false,
        });
        expect(document.components?.schemas?.['ResponseReturn2UserResponse']).toMatchObject({
            type: 'object',
            required: ['success', 'status', 'data', 'timestamp'],
            additionalProperties: false,
            'x-archipel-envelope': {
                version: 2,
                dataProperty: 'data',
            },
            properties: {
                data: { $ref: '#/components/schemas/UserResponse' },
            },
        });
    });

    it('documents a 204 response without content or an envelope schema', async () => {
        // arrange
        const testingModule = await Test.createTestingModule({
            controllers: [StandardSchema2Controller],
        }).compile();
        application = testingModule.createNestApplication();
        await application.init();

        // act
        const document = SwaggerModule.createDocument(application, {
            openapi: '3.0.0',
            info: { title: 'Standard Schema 2 test', version: '1.0.0' },
            paths: {},
        });
        const response = document.paths['/standard-schema-2/{id}']?.delete?.responses?.[HttpStatus.NO_CONTENT];

        // assert
        expect(response).toEqual({ description: 'User deleted.' });
    });
});

// #endregion

function getResponseSchema(document: OpenAPIObject): unknown {
    const response = document.paths['/standard-schema-2']?.get?.responses?.[HttpStatus.OK];

    if (!response || '$ref' in response) {
        return undefined;
    }

    return response.content?.['application/json']?.schema;
}
