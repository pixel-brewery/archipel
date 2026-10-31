// #region Imports

import 'reflect-metadata';
import { ApiProperty, ApiSchema, DECORATORS, PartialType, PickType } from '@nestjs/swagger';
import { ArrayMaxSize, IsEmail, MaxLength, MinLength } from 'class-validator';
import { describe, expect, it } from 'vitest';
import { createJsonSchemaFingerprint } from './createJsonSchemaFingerprint.js';
import { createJsonSchemaFromOpenApiModel } from './createJsonSchemaFromOpenApiModel.js';

// #endregion

// #region Tests

describe('createJsonSchemaFromOpenApiModel', () => {
    it('should bundle a mapped Swagger DTO graph as self-contained JSON Schema', () => {
        // arrange
        class AddressModel {}
        ApiSchema({ name: 'PostalAddress' })(AddressModel);
        ApiProperty({ type: String })(AddressModel.prototype, 'street');
        ApiProperty({ type: String, nullable: true })(AddressModel.prototype, 'apartment');

        class CustomerModel {}
        ApiProperty({ type: String })(CustomerModel.prototype, 'name');
        ApiProperty({ type: () => AddressModel })(CustomerModel.prototype, 'address');
        ApiProperty({ type: () => [AddressModel] })(CustomerModel.prototype, 'previousAddresses');
        ApiProperty({ enum: ['lead', 'active'], enumName: 'CustomerStatus' })(CustomerModel.prototype, 'status');

        const PickedCustomerModel = PickType(CustomerModel, ['name', 'address', 'previousAddresses', 'status'] as const);
        const CustomerDraftModel = PartialType(PickedCustomerModel);
        ApiSchema({ name: 'CustomerDraft' })(CustomerDraftModel);

        // act
        const schema = createJsonSchemaFromOpenApiModel(CustomerDraftModel, { additionalProperties: false });

        // assert
        expect(schema).toMatchObject({
            type: 'object',
            additionalProperties: false,
            properties: {
                name: { type: 'string' },
                address: { $ref: '#/%24defs/__openapi_components__/%24defs/PostalAddress' },
                previousAddresses: {
                    type: 'array',
                    items: { $ref: '#/%24defs/__openapi_components__/%24defs/PostalAddress' },
                },
                status: {
                    allOf: [{ $ref: '#/%24defs/__openapi_components__/%24defs/CustomerStatus' }],
                },
            },
            $defs: {
                __openapi_components__: {
                    $defs: {
                        PostalAddress: {
                            type: 'object',
                            additionalProperties: false,
                            required: ['street', 'apartment'],
                            properties: {
                                street: { type: 'string' },
                                apartment: {
                                    type: ['null', 'string'],
                                },
                            },
                        },
                        CustomerStatus: {
                            type: 'string',
                            enum: ['lead', 'active'],
                        },
                    },
                },
            },
        });
        expect(schema).not.toHaveProperty('required');
        expect(JSON.stringify(schema)).not.toContain('#/components/schemas/');
    });

    it('should match the cross-generator nullable type-union fingerprint', () => {
        // arrange
        class NullableStringModel {}
        ApiProperty({ type: String, nullable: true })(NullableStringModel.prototype, 'value');

        // act
        const schema = createJsonSchemaFromOpenApiModel(NullableStringModel);
        const properties = schema['properties'] as Readonly<Record<string, Readonly<Record<string, unknown>>>>;
        const nullableValueSchema = properties['value'];
        const fingerprint = createJsonSchemaFingerprint(nullableValueSchema);

        // assert
        expect(nullableValueSchema).toEqual({ type: ['null', 'string'] });
        // Golden emitted by Mosaik for OpenAPI 3.0 { type: 'string', nullable: true }.
        expect(fingerprint).toBe('880a3fc8b18dce8dcdd910b6295fa1ded7442f6938371468614bbfeaf8d70f3c');
    });

    it('should canonicalize a typed nullable enum without changing its values', () => {
        // arrange
        enum Salutation {
            MR = 'MR',
            MS = 'MS',
        }
        class NullableEnumModel {}
        ApiProperty({ enum: Salutation, enumName: 'Salutation', nullable: true, type: String })(NullableEnumModel.prototype, 'value');

        // act
        const schema = createJsonSchemaFromOpenApiModel(NullableEnumModel);

        // assert
        expect(schema).toMatchObject({
            properties: {
                value: {
                    enum: ['MR', 'MS'],
                    type: ['null', 'string'],
                },
            },
        });
        expect(schema).not.toHaveProperty('$defs');
    });

    it('should reject nullable allOf reference compositions without an explicit sibling type', () => {
        // arrange
        enum Salutation {
            MR = 'MR',
            MS = 'MS',
        }
        class MissingNullableTypeModel {}
        ApiProperty({ enum: Salutation, enumName: 'Salutation', nullable: true, type: Salutation })(MissingNullableTypeModel.prototype, 'value');

        // act / assert
        expect(() => createJsonSchemaFromOpenApiModel(MissingNullableTypeModel)).toThrow('OpenAPI nullable schemas must declare an explicit sibling type.');
    });

    it('should reject nullable OpenAPI schemas with an unsupported sibling type', () => {
        // arrange
        class InvalidNullableTypeModel {}
        Reflect.defineMetadata(DECORATORS.API_MODEL_PROPERTIES_ARRAY, [':value'], InvalidNullableTypeModel.prototype);
        Reflect.defineMetadata(DECORATORS.API_MODEL_PROPERTIES, { nullable: true, required: true, type: 'date' }, InvalidNullableTypeModel.prototype, 'value');

        // act / assert
        expect(() => createJsonSchemaFromOpenApiModel(InvalidNullableTypeModel)).toThrow('OpenAPI nullable schema declares unsupported type "date".');
    });

    it('should preserve generated object openness unless strict additional properties are requested', () => {
        // arrange
        class OpenModel {}
        ApiProperty({ type: String })(OpenModel.prototype, 'value');

        // act
        const schema = createJsonSchemaFromOpenApiModel(OpenModel);

        // assert
        expect(schema).not.toHaveProperty('additionalProperties');
    });

    it('should retain a recursive root only when its component reference is reachable', () => {
        // arrange
        class RecursiveNodeModel {}
        ApiProperty({ type: String })(RecursiveNodeModel.prototype, 'value');
        ApiProperty({ type: () => RecursiveNodeModel, required: false })(RecursiveNodeModel.prototype, 'child');

        // act
        const schema = createJsonSchemaFromOpenApiModel(RecursiveNodeModel, { additionalProperties: false });

        // assert
        expect(schema).toMatchObject({
            properties: {
                child: { $ref: '#/%24defs/__openapi_components__/%24defs/RecursiveNodeModel' },
            },
            $defs: {
                __openapi_components__: {
                    $defs: {
                        RecursiveNodeModel: {
                            properties: {
                                child: { $ref: '#/%24defs/__openapi_components__/%24defs/RecursiveNodeModel' },
                            },
                        },
                    },
                },
            },
        });
    });

    it('should synchronize portable validator constraints into the model-facing JSON Schema', () => {
        // arrange
        class ValidatedModel {}
        ApiProperty({ type: String })(ValidatedModel.prototype, 'email');
        IsEmail()(ValidatedModel.prototype, 'email');
        MaxLength(120)(ValidatedModel.prototype, 'email');
        ApiProperty({ type: [String] })(ValidatedModel.prototype, 'tags');
        ArrayMaxSize(3)(ValidatedModel.prototype, 'tags');
        MinLength(2, { each: true })(ValidatedModel.prototype, 'tags');

        // act
        const schema = createJsonSchemaFromOpenApiModel(ValidatedModel, { additionalProperties: false });

        // assert
        expect(schema).toMatchObject({
            additionalProperties: false,
            properties: {
                email: { type: 'string', format: 'email', maxLength: 120 },
                tags: { type: 'array', maxItems: 3, items: { type: 'string', minLength: 2 } },
            },
        });
    });

    it('should not normalize schema-like fields inside annotation values', () => {
        // arrange
        const annotationValue = {
            type: 'object',
            nullable: true,
            $ref: '#/components/schemas/AnnotationOnly',
        };
        class AnnotatedModel {}
        ApiProperty({ type: Object, example: annotationValue, default: annotationValue })(AnnotatedModel.prototype, 'payload');

        // act
        const schema = createJsonSchemaFromOpenApiModel(AnnotatedModel, { additionalProperties: false });

        // assert
        expect(schema).toMatchObject({
            properties: {
                payload: {
                    type: 'object',
                    additionalProperties: false,
                    example: annotationValue,
                    default: annotationValue,
                },
            },
        });
        expect(schema).not.toHaveProperty('$defs');
    });

    it('should fail when a referenced component schema is missing', () => {
        // arrange
        class MissingReferenceModel {}
        ApiProperty({ type: Object, oneOf: [{ $ref: '#/components/schemas/MissingContract' }] })(MissingReferenceModel.prototype, 'value');

        // act / assert
        expect(() => createJsonSchemaFromOpenApiModel(MissingReferenceModel)).toThrow('OpenAPI referenced schema "MissingContract" is missing.');
    });

    it('should accept semantically identical named enums reused by different DTO properties', () => {
        // arrange
        const ContactConsentStatus = {
            Pending: 'pending',
            Granted: 'granted',
        } as const;
        class ContactModel {}
        ApiProperty({
            enum: ContactConsentStatus,
            enumName: 'ContactConsentStatus',
            description: 'Current consent state.',
        })(ContactModel.prototype, 'consentStatus');

        class ContactHistoryModel {}
        ApiProperty({
            enum: ContactConsentStatus,
            enumName: 'ContactConsentStatus',
            description: 'Previous consent states.',
            isArray: true,
        })(ContactHistoryModel.prototype, 'consentStatuses');

        class ContactContractModel {}
        ApiProperty({ type: () => ContactModel })(ContactContractModel.prototype, 'contact');
        ApiProperty({ type: () => ContactHistoryModel })(ContactContractModel.prototype, 'history');

        // act
        const schema = createJsonSchemaFromOpenApiModel(ContactContractModel);

        // assert
        expect(schema).toMatchObject({
            $defs: {
                __openapi_components__: {
                    $defs: {
                        ContactConsentStatus: {
                            type: 'string',
                            enum: ['pending', 'granted'],
                        },
                    },
                },
            },
        });
    });

    it('should reject genuinely different enums that claim the same schema name', () => {
        // arrange
        class ConflictingEnumModel {}
        ApiProperty({ enum: ['pending', 'granted'], enumName: 'ConsentStatus' })(ConflictingEnumModel.prototype, 'currentStatus');
        ApiProperty({ enum: ['pending', 'revoked'], enumName: 'ConsentStatus' })(ConflictingEnumModel.prototype, 'previousStatus');

        // act / assert
        expect(() => createJsonSchemaFromOpenApiModel(ConflictingEnumModel)).toThrow('OpenAPI schema name collision for "ConsentStatus"');
    });

    it('should fail when different DTOs claim the same schema name', () => {
        // arrange
        class FirstModel {}
        ApiSchema({ name: 'SharedContract' })(FirstModel);
        ApiProperty({ type: String })(FirstModel.prototype, 'first');

        class SecondModel {}
        ApiSchema({ name: 'SharedContract' })(SecondModel);
        ApiProperty({ type: Number })(SecondModel.prototype, 'second');

        class CollisionRootModel {}
        ApiProperty({ type: () => FirstModel })(CollisionRootModel.prototype, 'first');
        ApiProperty({ type: () => SecondModel })(CollisionRootModel.prototype, 'second');

        // act / assert
        expect(() => createJsonSchemaFromOpenApiModel(CollisionRootModel)).toThrow('OpenAPI schema name collision for "SharedContract"');
    });
});

// #endregion
