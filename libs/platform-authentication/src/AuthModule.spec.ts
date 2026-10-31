import { ConfigModule, ConfigService, EnvironmentConfigStrategy } from '@pixel-brewery/archipel-platform-configuration';
import { EventModule, HostModule, IdentifierModule, LimitRequestSizeMiddleware } from '@pixel-brewery/archipel-platform-core';
import { ResourceModule } from '@pixel-brewery/archipel-platform-resources';
import { Controller, Injectable, RequestMethod, UseGuards, type MiddlewareConsumer } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { AuthModule, type IAuthModuleOptions } from './AuthModule.js';
import { AuthSubjectBase } from './abstracts/AuthSubjectBase.js';
import type { IAuthSubject } from './contracts/IAuthSubject.js';
import type { ICreateSessionArgs } from './contracts/ICreateSessionArgs.js';
import type { IMfaSubject } from './contracts/IMfaSubject.js';
import type { IMfaSubjectUpdate } from './contracts/IMfaSubjectUpdate.js';
import type { IRotateRefreshTokenArgs } from './contracts/IRotateRefreshTokenArgs.js';
import type { ISessionRecord } from './contracts/ISessionRecord.js';
import type { IVerifiableSubject } from './contracts/IVerifiableSubject.js';
import { MfaSubjectBase } from './abstracts/MfaSubjectBase.js';
import { SessionPersistenceBase } from './abstracts/SessionPersistenceBase.js';
import { VerificationSubjectBase } from './abstracts/VerificationSubjectBase.js';
import { AnonymousAuthGuard } from './guards/AnonymousAuthGuard.js';
import { JwtAuthGuard } from './guards/JwtAuthGuard.js';
import { LocalAuthGuard } from './guards/LocalAuthGuard.js';
import { RolesGuard } from './guards/RolesGuard.js';
import { LastActiveMiddleware } from './middlewares/index.js';
import { AuthTokenService } from './services/AuthTokenService.js';
import { SessionService } from './services/SessionService.js';

class StubAuthSubject extends AuthSubjectBase {
    // #region Methods

    public async findById(_id: string): Promise<IAuthSubject | null> {
        return null;
    }

    public async findByLogin(_login: string): Promise<IAuthSubject | null> {
        return null;
    }

    public async findAnonymous(_userName: string): Promise<IAuthSubject | null> {
        return null;
    }

    // #endregion
}
Injectable()(StubAuthSubject);

class StubMfaSubject extends MfaSubjectBase {
    // #region Methods

    public async findById(_id: string): Promise<IMfaSubject | null> {
        return null;
    }

    public async updateMfaState(_id: string, _data: IMfaSubjectUpdate): Promise<void> {
        return;
    }

    // #endregion
}
Injectable()(StubMfaSubject);

class StubSessionPersistence extends SessionPersistenceBase {
    // #region Methods

    public async create(_args: ICreateSessionArgs): Promise<ISessionRecord> {
        throw new Error('Not implemented in the module composition test.');
    }

    public async findById(_id: string): Promise<ISessionRecord | null> {
        return null;
    }

    public async findByRefreshTokenHash(_refreshTokenHash: string): Promise<ISessionRecord | null> {
        return null;
    }

    public async findAllByUserId(_userId: string): Promise<ReadonlyArray<ISessionRecord>> {
        return [];
    }

    public async updateLastActive(_token: string, _date: Date): Promise<void> {
        return;
    }

    public async rotateRefreshToken(_args: IRotateRefreshTokenArgs): Promise<boolean> {
        return false;
    }

    public async invalidate(_token: string): Promise<boolean> {
        return false;
    }

    public async invalidateById(_id: string, _userId: string): Promise<boolean> {
        return false;
    }

    public async deleteInactive(_userId: string, _activeBefore: Date): Promise<number> {
        return 0;
    }

    // #endregion
}
Injectable()(StubSessionPersistence);

class StubVerificationSubject extends VerificationSubjectBase {
    // #region Methods

    public async findByLogin(_login: string): Promise<IVerifiableSubject | null> {
        return null;
    }

    public async findByVerificationToken(_token: string): Promise<IVerifiableSubject | null> {
        return null;
    }

    public async setVerificationToken(_id: string, _token: string | null): Promise<void> {
        return;
    }

    public async markVerified(_id: string): Promise<void> {
        return;
    }

    // #endregion
}
Injectable()(StubVerificationSubject);

class StubAuthGuardConsumerController {}
Controller('auth-guard-consumer')(StubAuthGuardConsumerController);
UseGuards(AnonymousAuthGuard, JwtAuthGuard, LocalAuthGuard, RolesGuard)(StubAuthGuardConsumerController);

const stubConfigService = {
    get: (key: string) => {
        const map: Record<string, string> = {
            AUTH_JWT_SECRET: 'test-secret-key-for-integration-test',
            AUTH_JWT_EXPIRES_IN: '1h',
            AUTH_JWT_REFRESH_EXPIRES_IN: '7d',
            AUTH_MFA_ENCRYPTION_KEY: 'a'.repeat(64),
            AUTH_SESSION_MAX_AGE: '30d',
        };
        return map[key];
    },
    tryGet: (key: string, fallback: unknown) => {
        const map: Record<string, string> = {
            AUTH_JWT_SECRET: 'test-secret-key-for-integration-test',
            AUTH_JWT_EXPIRES_IN: '1h',
            AUTH_JWT_REFRESH_EXPIRES_IN: '7d',
            AUTH_MFA_ENCRYPTION_KEY: 'a'.repeat(64),
            AUTH_SESSION_MAX_AGE: '30d',
        };
        return map[key] ?? fallback;
    },
    has: (key: string) =>
        ['AUTH_JWT_SECRET', 'AUTH_JWT_EXPIRES_IN', 'AUTH_JWT_REFRESH_EXPIRES_IN', 'AUTH_MFA_ENCRYPTION_KEY', 'AUTH_SESSION_MAX_AGE'].includes(key),
};

describe('AuthModule (DI Integration)', () => {
    // #region Methods

    it('should resolve AuthTokenService when module is registered with all required ports', async () => {
        // arrange
        process.env['AUTH_JWT_SECRET'] = 'test-secret-key-for-integration-test';
        process.env['AUTH_JWT_EXPIRES_IN'] = '1 hour';

        const moduleRef = await Test.createTestingModule({
            imports: [
                ConfigModule.forRoot({
                    strategyFactory: () => new EnvironmentConfigStrategy(),
                    statics: {
                        AUTH_JWT_SECRET: 'test-secret-key-for-integration-test',
                        AUTH_JWT_EXPIRES_IN: '1 hour',
                        AUTH_JWT_REFRESH_EXPIRES_IN: '7 days',
                        AUTH_MFA_ENCRYPTION_KEY: 'a'.repeat(64),
                        AUTH_SESSION_MAX_AGE: '30 days',
                    },
                }),
                ResourceModule.forRoot({ strategies: [] }),
                HostModule,
                EventModule,
                IdentifierModule.register('UUID'),
                AuthModule.register({
                    authSubject: StubAuthSubject,
                    mfaSubject: StubMfaSubject,
                    sessionPersistence: StubSessionPersistence,
                    verificationSubject: StubVerificationSubject,
                }),
            ],
        })
            .overrideProvider(ConfigService)
            .useValue(stubConfigService)
            .compile();

        // act
        const tokenService = moduleRef.get(AuthTokenService);

        // assert
        expect(tokenService).toBeInstanceOf(AuthTokenService);

        // cleanup
        delete process.env['AUTH_JWT_SECRET'];
        delete process.env['AUTH_JWT_EXPIRES_IN'];
    });

    it('should resolve SessionService when module is registered', async () => {
        // arrange
        process.env['AUTH_JWT_SECRET'] = 'test-secret-key-for-integration-test';
        process.env['AUTH_JWT_EXPIRES_IN'] = '1 hour';

        const moduleRef = await Test.createTestingModule({
            imports: [
                ConfigModule.forRoot({
                    strategyFactory: () => new EnvironmentConfigStrategy(),
                    statics: {
                        AUTH_JWT_SECRET: 'test-secret-key-for-integration-test',
                        AUTH_JWT_EXPIRES_IN: '1 hour',
                        AUTH_JWT_REFRESH_EXPIRES_IN: '7 days',
                        AUTH_MFA_ENCRYPTION_KEY: 'a'.repeat(64),
                        AUTH_SESSION_MAX_AGE: '30 days',
                    },
                }),
                ResourceModule.forRoot({ strategies: [] }),
                HostModule,
                EventModule,
                IdentifierModule.register('UUID'),
                AuthModule.register({
                    authSubject: StubAuthSubject,
                    mfaSubject: StubMfaSubject,
                    sessionPersistence: StubSessionPersistence,
                    verificationSubject: StubVerificationSubject,
                }),
            ],
        })
            .overrideProvider(ConfigService)
            .useValue(stubConfigService)
            .compile();

        // act
        const sessionService = moduleRef.get(SessionService);

        // assert
        expect(sessionService).toBeInstanceOf(SessionService);

        // cleanup
        delete process.env['AUTH_JWT_SECRET'];
        delete process.env['AUTH_JWT_EXPIRES_IN'];
    });

    it('should allow importing modules to use every exported guard', async () => {
        // arrange
        process.env['AUTH_JWT_SECRET'] = 'test-secret-key-for-integration-test';
        process.env['AUTH_JWT_EXPIRES_IN'] = '1 hour';

        // act
        const moduleRef = await Test.createTestingModule({
            imports: [
                ConfigModule.forRoot({
                    strategyFactory: () => new EnvironmentConfigStrategy(),
                    statics: {
                        AUTH_JWT_SECRET: 'test-secret-key-for-integration-test',
                        AUTH_JWT_EXPIRES_IN: '1 hour',
                        AUTH_JWT_REFRESH_EXPIRES_IN: '7 days',
                        AUTH_MFA_ENCRYPTION_KEY: 'a'.repeat(64),
                        AUTH_SESSION_MAX_AGE: '30 days',
                    },
                }),
                ResourceModule.forRoot({ strategies: [] }),
                HostModule,
                EventModule,
                IdentifierModule.register('UUID'),
                AuthModule.register({
                    authSubject: StubAuthSubject,
                    mfaSubject: StubMfaSubject,
                    sessionPersistence: StubSessionPersistence,
                    verificationSubject: StubVerificationSubject,
                }),
            ],
            controllers: [StubAuthGuardConsumerController],
        })
            .overrideProvider(ConfigService)
            .useValue(stubConfigService)
            .compile();

        // assert
        expect(moduleRef.get(StubAuthGuardConsumerController)).toBeInstanceOf(StubAuthGuardConsumerController);
        expect(moduleRef.get(AnonymousAuthGuard)).toBeInstanceOf(AnonymousAuthGuard);
        expect(moduleRef.get(JwtAuthGuard)).toBeInstanceOf(JwtAuthGuard);
        expect(moduleRef.get(LocalAuthGuard)).toBeInstanceOf(LocalAuthGuard);
        expect(moduleRef.get(RolesGuard)).toBeInstanceOf(RolesGuard);

        // cleanup
        delete process.env['AUTH_JWT_SECRET'];
        delete process.env['AUTH_JWT_EXPIRES_IN'];
    });

    // #endregion
});

// ---------------------------------------------------------------------------
// Middleware configuration (configure method)
// ---------------------------------------------------------------------------

function createMockMiddlewareConsumer(): MiddlewareConsumer & { applyCalls: Array<{ middleware: unknown; routes: unknown }> } {
    const applyCalls: Array<{ middleware: unknown; routes: unknown }> = [];
    const forRoutesFn = vi.fn().mockImplementation((route: unknown) => {
        applyCalls[applyCalls.length - 1].routes = route;
        return { forRoutes: forRoutesFn, exclude: vi.fn().mockReturnThis() };
    });
    const consumer = {
        applyCalls,
        apply: vi.fn().mockImplementation((middleware: unknown) => {
            applyCalls.push({ middleware, routes: undefined });
            return { forRoutes: forRoutesFn, exclude: vi.fn().mockReturnThis() };
        }),
    };
    return consumer as unknown as MiddlewareConsumer & { applyCalls: Array<{ middleware: unknown; routes: unknown }> };
}

function registerWithMiddleware(middleware?: IAuthModuleOptions['middleware']): AuthModule {
    AuthModule.register({
        authSubject: StubAuthSubject,
        mfaSubject: StubMfaSubject,
        sessionPersistence: StubSessionPersistence,
        verificationSubject: StubVerificationSubject,
        middleware,
    });
    return new AuthModule();
}

describe('AuthModule.configure (Middleware Registration)', () => {
    // #region Methods

    afterEach(() => {
        vi.restoreAllMocks();
    });

    it('should register both middlewares by default when middleware option is omitted', () => {
        // arrange
        const consumer = createMockMiddlewareConsumer();
        const authModule = registerWithMiddleware(undefined);

        // act
        authModule.configure(consumer);

        // assert
        expect(consumer.apply).toHaveBeenCalledTimes(2);
        expect(consumer.apply).toHaveBeenCalledWith(LimitRequestSizeMiddleware);
        expect(consumer.apply).toHaveBeenCalledWith(LastActiveMiddleware);
    });

    it('should use default path "auth/register" for request size limit when no custom path is provided', () => {
        // arrange
        const consumer = createMockMiddlewareConsumer();
        const authModule = registerWithMiddleware(undefined);

        // act
        authModule.configure(consumer);

        // assert
        const sizeCall = consumer.applyCalls.find((c) => c.middleware === LimitRequestSizeMiddleware);
        expect(sizeCall).toBeDefined();
        expect(sizeCall!.routes).toEqual({ path: 'auth/register', method: RequestMethod.POST });
    });

    it('should use custom path for request size limit when a string is provided', () => {
        // arrange
        const consumer = createMockMiddlewareConsumer();
        const authModule = registerWithMiddleware({ requestSizeLimit: 'users/signup' });

        // act
        authModule.configure(consumer);

        // assert
        const sizeCall = consumer.applyCalls.find((c) => c.middleware === LimitRequestSizeMiddleware);
        expect(sizeCall).toBeDefined();
        expect(sizeCall!.routes).toEqual({ path: 'users/signup', method: RequestMethod.POST });
    });

    it('should not register LimitRequestSizeMiddleware when requestSizeLimit is false', () => {
        // arrange
        const consumer = createMockMiddlewareConsumer();
        const authModule = registerWithMiddleware({ requestSizeLimit: false });

        // act
        authModule.configure(consumer);

        // assert
        const sizeCall = consumer.applyCalls.find((c) => c.middleware === LimitRequestSizeMiddleware);
        expect(sizeCall).toBeUndefined();
    });

    it('should not register LastActiveMiddleware when lastActive is false', () => {
        // arrange
        const consumer = createMockMiddlewareConsumer();
        const authModule = registerWithMiddleware({ lastActive: false });

        // act
        authModule.configure(consumer);

        // assert
        const lastActiveCall = consumer.applyCalls.find((c) => c.middleware === LastActiveMiddleware);
        expect(lastActiveCall).toBeUndefined();
    });

    it('should register LastActiveMiddleware on wildcard route when enabled', () => {
        // arrange
        const consumer = createMockMiddlewareConsumer();
        const authModule = registerWithMiddleware({ lastActive: true });

        // act
        authModule.configure(consumer);

        // assert
        const lastActiveCall = consumer.applyCalls.find((c) => c.middleware === LastActiveMiddleware);
        expect(lastActiveCall).toBeDefined();
        expect(lastActiveCall!.routes).toEqual({ path: '/{*path}', method: RequestMethod.ALL });
    });

    it('should register no middlewares when both are disabled', () => {
        // arrange
        const consumer = createMockMiddlewareConsumer();
        const authModule = registerWithMiddleware({ lastActive: false, requestSizeLimit: false });

        // act
        authModule.configure(consumer);

        // assert
        expect(consumer.apply).not.toHaveBeenCalled();
        expect(consumer.applyCalls).toHaveLength(0);
    });

    it('should register both middlewares when middleware options are explicitly enabled', () => {
        // arrange
        const consumer = createMockMiddlewareConsumer();
        const authModule = registerWithMiddleware({ lastActive: true, requestSizeLimit: 'auth/register' });

        // act
        authModule.configure(consumer);

        // assert
        expect(consumer.apply).toHaveBeenCalledTimes(2);
        expect(consumer.apply).toHaveBeenCalledWith(LimitRequestSizeMiddleware);
        expect(consumer.apply).toHaveBeenCalledWith(LastActiveMiddleware);
    });

    it('should disable only LastActiveMiddleware while keeping request size limit active', () => {
        // arrange
        const consumer = createMockMiddlewareConsumer();
        const authModule = registerWithMiddleware({ lastActive: false, requestSizeLimit: 'auth/register' });

        // act
        authModule.configure(consumer);

        // assert
        expect(consumer.apply).toHaveBeenCalledTimes(1);
        expect(consumer.apply).toHaveBeenCalledWith(LimitRequestSizeMiddleware);
    });

    it('should disable only request size limit while keeping last-active tracking active', () => {
        // arrange
        const consumer = createMockMiddlewareConsumer();
        const authModule = registerWithMiddleware({ requestSizeLimit: false });

        // act
        authModule.configure(consumer);

        // assert
        expect(consumer.apply).toHaveBeenCalledTimes(1);
        expect(consumer.apply).toHaveBeenCalledWith(LastActiveMiddleware);
    });

    // #endregion
});
