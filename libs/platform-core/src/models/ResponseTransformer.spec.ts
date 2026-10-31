// #region Imports

import 'reflect-metadata';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { ResponseTransformer } from './ResponseTransformer.js';

// #endregion

// #region Test Classes

class UserDto {
    public name!: string;
    public age!: number;
}

class AddressDto {
    public city!: string;
    public zip!: string;
}

// #endregion

// #region Tests

describe('ResponseTransformer', () => {
    afterEach(() => {
        vi.restoreAllMocks();
    });

    describe('transform', () => {
        it('should transform a plain object to a class instance', () => {
            // arrange
            const plain = { name: 'John', age: 30 };

            // act
            const result = ResponseTransformer.transform(UserDto, plain);

            // assert
            expect(result).toBeInstanceOf(UserDto);
            expect((result as UserDto).name).toBe('John');
            expect((result as UserDto).age).toBe(30);
        });

        it('should transform an array of plain objects', () => {
            // arrange
            const plains = [
                { name: 'Alice', age: 25 },
                { name: 'Bob', age: 35 },
            ];

            // act
            const result = ResponseTransformer.transform(UserDto, plains);

            // assert
            expect(Array.isArray(result)).toBe(true);
            expect((result as UserDto[])[0]).toBeInstanceOf(UserDto);
            expect((result as UserDto[])[1]).toBeInstanceOf(UserDto);
        });

        it('should return null for null input', () => {
            // act
            const result = ResponseTransformer.transform(UserDto, null);

            // assert
            expect(result).toBeNull();
        });

        it('should return undefined for undefined input', () => {
            // act
            const result = ResponseTransformer.transform(UserDto, undefined);

            // assert
            expect(result).toBeUndefined();
        });

        it('should transform a class instance to same type via instanceToInstance', () => {
            // arrange
            const user = new UserDto();
            user.name = 'Test';
            user.age = 20;

            // act
            const result = ResponseTransformer.transform(UserDto, user);

            // assert
            expect(result).toBeInstanceOf(UserDto);
            expect((result as UserDto).name).toBe('Test');
        });

        it('should handle empty arrays', () => {
            // act
            const result = ResponseTransformer.transform(UserDto, []);

            // assert
            expect(result).toEqual([]);
        });

        it('should apply hints for array element types', () => {
            // arrange
            class ParentDto {
                public addresses!: AddressDto[];
            }
            const plain = {
                addresses: [
                    { city: 'Berlin', zip: '10115' },
                    { city: 'Munich', zip: '80331' },
                ],
            };

            // act
            const result = ResponseTransformer.transform(ParentDto, plain, {
                hints: {
                    arrayElementTypes: { addresses: AddressDto },
                },
            });

            // assert
            const parent = result as ParentDto;
            expect(parent).toBeInstanceOf(ParentDto);
            expect(parent.addresses[0]).toBeInstanceOf(AddressDto);
            expect(parent.addresses[0].city).toBe('Berlin');
        });

        it('should apply hints for nested property types', () => {
            // arrange
            class ProfileDto {
                public address!: AddressDto;
            }
            const plain = {
                address: { city: 'Hamburg', zip: '20095' },
            };

            // act
            const result = ResponseTransformer.transform(ProfileDto, plain, {
                hints: {
                    propertyTypes: { address: AddressDto },
                },
            });

            // assert
            const profile = result as ProfileDto;
            expect(profile.address).toBeInstanceOf(AddressDto);
            expect(profile.address.city).toBe('Hamburg');
        });
    });
});

// #endregion
