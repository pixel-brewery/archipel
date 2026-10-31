import { describe, expect, it, vi } from 'vitest';
import { ConnectorBase } from './ConnectorBase.js';

vi.mock('@nestjs/passport', () => ({
    PassportStrategy: (strategy: new (...args: unknown[]) => unknown, _name?: string) => {
        return strategy;
    },
}));

describe('ConnectorBase', () => {
    // #region Methods

    it('should return an abstract class extending the given strategy', () => {
        // arrange
        class MockStrategy {}

        // act
        const Base = ConnectorBase(MockStrategy);

        // assert
        expect(Base).toBeDefined();
        expect(Base.prototype).toBeInstanceOf(MockStrategy);
    });

    it('should accept an optional name parameter', () => {
        // arrange
        class MockStrategy {}

        // act
        const Base = ConnectorBase(MockStrategy, 'test-strategy');

        // assert
        expect(Base).toBeDefined();
    });

    it('should produce a class whose instances expose a validate method slot', () => {
        // arrange
        class MockStrategy {}
        const Base = ConnectorBase(MockStrategy);

        class ConcreteConnector extends Base {
            public async validate(): Promise<unknown> {
                return { id: '1' };
            }
        }

        // act
        const instance = new ConcreteConnector();

        // assert
        expect(instance.validate).toBeDefined();
        expect(typeof instance.validate).toBe('function');
    });

    it('should resolve the value returned by the concrete validate implementation', async () => {
        // arrange
        class MockStrategy {}
        const Base = ConnectorBase(MockStrategy);

        class ConcreteConnector extends Base {
            public async validate(): Promise<unknown> {
                return { id: 'user-42' };
            }
        }

        const instance = new ConcreteConnector();

        // act
        const result = await instance.validate();

        // assert
        expect(result).toEqual({ id: 'user-42' });
    });

    // #endregion
});
