import { ConfigService } from '@pixel-brewery/archipel-platform-configuration';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { MfaEncryptionService } from './MfaEncryptionService.js';

describe('MfaEncryptionService', () => {
    // #region Fields

    let service: MfaEncryptionService;

    // #endregion

    // #region Methods

    beforeEach(() => {
        vi.restoreAllMocks();

        const mockConfigService = {
            get: vi.fn().mockReturnValue('test-encryption-key-32chars!!'),
            tryGet: vi.fn().mockReturnValue('test-encryption-key-32chars!!'),
        } as unknown as ConfigService;

        service = new MfaEncryptionService(mockConfigService);
    });

    // #endregion

    // #region Methods

    describe('encrypt and decrypt', () => {
        it('should encrypt and decrypt a secret round-trip', () => {
            // arrange
            const secret = 'JBSWY3DPEHPK3PXP';

            // act
            const encrypted = service.encrypt(secret);
            const decrypted = service.decrypt(encrypted);

            // assert
            expect(encrypted).not.toBe(secret);
            expect(decrypted).toBe(secret);
        });

        it('should produce different ciphertext for same input (random IV)', () => {
            // arrange
            const secret = 'MY_TOTP_SECRET';

            // act
            const encrypted1 = service.encrypt(secret);
            const encrypted2 = service.encrypt(secret);

            // assert
            expect(encrypted1).not.toBe(encrypted2);
        });

        it('should handle empty string', () => {
            // act
            const encrypted = service.encrypt('');
            const decrypted = service.decrypt(encrypted);

            // assert
            expect(decrypted).toBe('');
        });

        it('should throw on tampered ciphertext', () => {
            // arrange
            const encrypted = service.encrypt('secret');
            const tampered = encrypted.slice(0, -4) + 'XXXX';

            // act & assert
            expect(() => service.decrypt(tampered)).toThrow();
        });
    });

    describe('default key fallback', () => {
        it('should work with empty config key', () => {
            // arrange
            const mockConfigService = {
                get: vi.fn().mockReturnValue(''),
                tryGet: vi.fn().mockReturnValue(''),
            } as unknown as ConfigService;
            const defaultService = new MfaEncryptionService(mockConfigService);

            // act
            const encrypted = defaultService.encrypt('test');
            const decrypted = defaultService.decrypt(encrypted);

            // assert
            expect(decrypted).toBe('test');
        });
    });

    // #endregion
});
