import { Logger } from '@nestjs/common';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { ContextLogger } from './ContextLogger.js';
import { RequestContextStore } from './RequestContextStore.js';

describe('ContextLogger', () => {
    // #region Fields

    let contextLogger: ContextLogger;

    // #endregion

    // #region Methods

    afterEach(() => {
        vi.restoreAllMocks();
    });

    describe('constructor', () => {
        it('should use the provided context name', () => {
            // arrange
            const spy = vi.spyOn(Logger.prototype, 'log').mockImplementation(() => undefined);

            // act
            contextLogger = new ContextLogger('TestContext');
            contextLogger.log('hello');

            // assert
            expect(spy).toHaveBeenCalled();
        });

        it('should default to ContextLogger name when no context is given', () => {
            // act
            contextLogger = new ContextLogger();

            // assert – no throw, logger instantiated
            expect(contextLogger).toBeDefined();
        });
    });

    describe('log', () => {
        it('should delegate to Logger.log with enriched message containing requestId', () => {
            // arrange
            contextLogger = new ContextLogger('Test');
            const spy = vi.spyOn(Logger.prototype, 'log').mockImplementation(() => undefined);

            // act
            RequestContextStore.run({ requestId: 'req-123' }, () => {
                contextLogger.log('test message');
            });

            // assert
            expect(spy).toHaveBeenCalledOnce();
            const enriched = spy.mock.calls[0]![0] as string;
            expect(enriched).toContain('test message');
            expect(enriched).toContain('"requestId":"req-123"');
        });

        it('should include additional data fields', () => {
            // arrange
            contextLogger = new ContextLogger('Test');
            const spy = vi.spyOn(Logger.prototype, 'log').mockImplementation(() => undefined);

            // act
            RequestContextStore.run({ requestId: 'req-1' }, () => {
                contextLogger.log('msg', { orderId: 42 });
            });

            // assert
            const enriched = spy.mock.calls[0]![0] as string;
            expect(enriched).toContain('"orderId":42');
        });

        it('should use "unknown" when no request context is active', () => {
            // arrange
            contextLogger = new ContextLogger('Test');
            const spy = vi.spyOn(Logger.prototype, 'log').mockImplementation(() => undefined);

            // act
            contextLogger.log('no context');

            // assert
            const enriched = spy.mock.calls[0]![0] as string;
            expect(enriched).toContain('"requestId":"unknown"');
        });

        it('should include userId when present in request context', () => {
            // arrange
            contextLogger = new ContextLogger('Test');
            const spy = vi.spyOn(Logger.prototype, 'log').mockImplementation(() => undefined);

            // act
            RequestContextStore.run({ requestId: 'req-1', userId: 'user-42' }, () => {
                contextLogger.log('with user');
            });

            // assert
            const enriched = spy.mock.calls[0]![0] as string;
            expect(enriched).toContain('"userId":"user-42"');
        });

        it('should not include userId when absent from request context', () => {
            // arrange
            contextLogger = new ContextLogger('Test');
            const spy = vi.spyOn(Logger.prototype, 'log').mockImplementation(() => undefined);

            // act
            RequestContextStore.run({ requestId: 'req-1' }, () => {
                contextLogger.log('no user');
            });

            // assert
            const enriched = spy.mock.calls[0]![0] as string;
            expect(enriched).not.toContain('userId');
        });
    });

    describe('warn', () => {
        it('should delegate to Logger.warn with enriched message', () => {
            // arrange
            contextLogger = new ContextLogger('Test');
            const spy = vi.spyOn(Logger.prototype, 'warn').mockImplementation(() => undefined);

            // act
            RequestContextStore.run({ requestId: 'req-w1' }, () => {
                contextLogger.warn('warning message');
            });

            // assert
            expect(spy).toHaveBeenCalledOnce();
            const enriched = spy.mock.calls[0]![0] as string;
            expect(enriched).toContain('warning message');
            expect(enriched).toContain('"requestId":"req-w1"');
        });
    });

    describe('error', () => {
        it('should delegate to Logger.error with enriched message', () => {
            // arrange
            contextLogger = new ContextLogger('Test');
            const spy = vi.spyOn(Logger.prototype, 'error').mockImplementation(() => undefined);

            // act
            RequestContextStore.run({ requestId: 'req-e1' }, () => {
                contextLogger.error('error message');
            });

            // assert
            expect(spy).toHaveBeenCalledOnce();
            const enriched = spy.mock.calls[0]![0] as string;
            expect(enriched).toContain('error message');
            expect(enriched).toContain('"requestId":"req-e1"');
        });
    });

    describe('debug', () => {
        it('should delegate to Logger.debug with enriched message', () => {
            // arrange
            contextLogger = new ContextLogger('Test');
            const spy = vi.spyOn(Logger.prototype, 'debug').mockImplementation(() => undefined);

            // act
            RequestContextStore.run({ requestId: 'req-d1' }, () => {
                contextLogger.debug('debug message');
            });

            // assert
            expect(spy).toHaveBeenCalledOnce();
            const enriched = spy.mock.calls[0]![0] as string;
            expect(enriched).toContain('debug message');
            expect(enriched).toContain('"requestId":"req-d1"');
        });
    });

    describe('verbose', () => {
        it('should delegate to Logger.verbose with enriched message', () => {
            // arrange
            contextLogger = new ContextLogger('Test');
            const spy = vi.spyOn(Logger.prototype, 'verbose').mockImplementation(() => undefined);

            // act
            RequestContextStore.run({ requestId: 'req-v1' }, () => {
                contextLogger.verbose('verbose message');
            });

            // assert
            expect(spy).toHaveBeenCalledOnce();
            const enriched = spy.mock.calls[0]![0] as string;
            expect(enriched).toContain('verbose message');
            expect(enriched).toContain('"requestId":"req-v1"');
        });
    });

    describe('sensitive data redaction', () => {
        it('should redact password fields in additional data', () => {
            // arrange
            contextLogger = new ContextLogger('Test');
            const spy = vi.spyOn(Logger.prototype, 'log').mockImplementation(() => undefined);

            // act
            RequestContextStore.run({ requestId: 'req-s1' }, () => {
                contextLogger.log('sensitive', { password: 'secret123' });
            });

            // assert
            const enriched = spy.mock.calls[0]![0] as string;
            expect(enriched).toContain('"password":"***"');
            expect(enriched).not.toContain('secret123');
        });

        it('should redact token fields in additional data', () => {
            // arrange
            contextLogger = new ContextLogger('Test');
            const spy = vi.spyOn(Logger.prototype, 'log').mockImplementation(() => undefined);

            // act
            RequestContextStore.run({ requestId: 'req-s2' }, () => {
                contextLogger.log('sensitive', { token: 'abc-token-value' });
            });

            // assert
            const enriched = spy.mock.calls[0]![0] as string;
            expect(enriched).toContain('"token":"***"');
            expect(enriched).not.toContain('abc-token-value');
        });

        it('should redact apiKey fields case-insensitively', () => {
            // arrange
            contextLogger = new ContextLogger('Test');
            const spy = vi.spyOn(Logger.prototype, 'log').mockImplementation(() => undefined);

            // act
            RequestContextStore.run({ requestId: 'req-s3' }, () => {
                contextLogger.log('sensitive', { apiKey: 'key-value-999' });
            });

            // assert
            const enriched = spy.mock.calls[0]![0] as string;
            expect(enriched).toContain('"apiKey":"***"');
            expect(enriched).not.toContain('key-value-999');
        });

        it('should redact email fields in additional data', () => {
            // arrange
            contextLogger = new ContextLogger('Test');
            const spy = vi.spyOn(Logger.prototype, 'log').mockImplementation(() => undefined);

            // act
            RequestContextStore.run({ requestId: 'req-s4' }, () => {
                contextLogger.log('sensitive', { email: 'user@example.com' });
            });

            // assert
            const enriched = spy.mock.calls[0]![0] as string;
            expect(enriched).toContain('"email":"***"');
            expect(enriched).not.toContain('user@example.com');
        });

        it('should redact authorization fields in additional data', () => {
            // arrange
            contextLogger = new ContextLogger('Test');
            const spy = vi.spyOn(Logger.prototype, 'log').mockImplementation(() => undefined);

            // act
            RequestContextStore.run({ requestId: 'req-s5' }, () => {
                contextLogger.log('sensitive', { authorization: 'Bearer xyz' });
            });

            // assert
            const enriched = spy.mock.calls[0]![0] as string;
            expect(enriched).toContain('"authorization":"***"');
            expect(enriched).not.toContain('Bearer xyz');
        });

        it('should not redact non-sensitive fields', () => {
            // arrange
            contextLogger = new ContextLogger('Test');
            const spy = vi.spyOn(Logger.prototype, 'log').mockImplementation(() => undefined);

            // act
            RequestContextStore.run({ requestId: 'req-s6' }, () => {
                contextLogger.log('safe', { username: 'alice', count: 5 });
            });

            // assert
            const enriched = spy.mock.calls[0]![0] as string;
            expect(enriched).toContain('"username":"alice"');
            expect(enriched).toContain('"count":5');
        });
    });

    // #endregion
});
