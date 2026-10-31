import { describe, expect, it } from 'vitest';
import { FEATURE_FLAG_KEY_METADATA, FeatureFlag } from './FeatureFlag.js';

const getMethodDescriptor = (target: object, propertyKey: string): PropertyDescriptor => {
    const descriptor = Object.getOwnPropertyDescriptor(target, propertyKey);
    if (!descriptor) {
        throw new Error(`Missing method descriptor for ${propertyKey}`);
    }

    return descriptor;
};

describe('FeatureFlag', () => {
    // #region Methods

    describe('FEATURE_FLAG_KEY_METADATA', () => {
        it('should be the expected metadata key constant', () => {
            // arrange — nothing to arrange

            // act & assert
            expect(FEATURE_FLAG_KEY_METADATA).toBe('feature_flag_key');
        });
    });

    describe('FeatureFlag decorator', () => {
        it('should set the feature flag key as metadata on a method', () => {
            // arrange
            const flagKey = 'new-checkout-flow';

            class TestController {
                public handler(): void {
                    // no-op
                }
            }
            FeatureFlag(flagKey)(TestController.prototype, 'handler', getMethodDescriptor(TestController.prototype, 'handler'));

            // act
            const metadata = Reflect.getMetadata(FEATURE_FLAG_KEY_METADATA, TestController.prototype.handler);

            // assert
            expect(metadata).toBe(flagKey);
        });

        it('should set different keys on different methods', () => {
            // arrange
            const flagA = 'flag-a';
            const flagB = 'flag-b';

            class TestController {
                public handlerA(): void {
                    // no-op
                }

                public handlerB(): void {
                    // no-op
                }
            }
            FeatureFlag(flagA)(TestController.prototype, 'handlerA', getMethodDescriptor(TestController.prototype, 'handlerA'));
            FeatureFlag(flagB)(TestController.prototype, 'handlerB', getMethodDescriptor(TestController.prototype, 'handlerB'));

            // act
            const metadataA = Reflect.getMetadata(FEATURE_FLAG_KEY_METADATA, TestController.prototype.handlerA);
            const metadataB = Reflect.getMetadata(FEATURE_FLAG_KEY_METADATA, TestController.prototype.handlerB);

            // assert
            expect(metadataA).toBe(flagA);
            expect(metadataB).toBe(flagB);
        });
    });

    // #endregion
});
