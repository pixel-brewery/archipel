import { describe, it, expect, vi, beforeEach } from 'vitest';

const logSpy = vi.fn();

vi.mock('@nestjs/common', () => ({
    Injectable: () => () => undefined,
    Logger: class {
        public log = logSpy;
    },
}));

import { HttpLoggerMiddleware } from './HttpLoggerMiddleware.js';

describe('HttpLoggerMiddleware', () => {
    beforeEach(() => {
        logSpy.mockClear();
    });

    it('logs combined message with optional params', () => {
        const middleware = new HttpLoggerMiddleware();
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (middleware as any).log('message', 'param1', 'param2');
        expect(logSpy).toHaveBeenCalledWith('message param1 param2');
    });
});
