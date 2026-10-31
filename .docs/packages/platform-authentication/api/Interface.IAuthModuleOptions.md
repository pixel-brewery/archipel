---
title: 'Interface: IAuthModuleOptions'
generated: true
editUrl: false
---

# Interface: IAuthModuleOptions

Defined in: [libs/platform-authentication/src/AuthModule.ts:49](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-authentication/src/AuthModule.ts#L49)

Options for configuring the `AuthModule`.

## Properties

### additionalConfigEntries?

```ts
additionalConfigEntries?: readonly Omit<IConfigRegistryEntry<unknown>, "module">[];
```

Defined in: [libs/platform-authentication/src/AuthModule.ts:89](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-authentication/src/AuthModule.ts#L89)

Optional additional configuration entries to register (e.g. provider-specific OAuth keys).
Import them from the provider-specific sub-paths
(e.g. `APPLE_AUTH_CONFIG_ENTRIES` from `@pixel-brewery/archipel-platform-authentication/connectors/apple`).

---

### additionalProviders?

```ts
additionalProviders?: Provider[];
```

Defined in: [libs/platform-authentication/src/AuthModule.ts:111](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-authentication/src/AuthModule.ts#L111)

Optional additional providers required by optional features (e.g. TOTP MFA).
Import them from the provider-specific sub-paths
(e.g. `TOTP_MFA_PROVIDERS` from `@pixel-brewery/archipel-platform-authentication/mfa/totp`).

---

### authSubject

```ts
authSubject: Type<AuthSubjectBase>;
```

Defined in: [libs/platform-authentication/src/AuthModule.ts:53](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-authentication/src/AuthModule.ts#L53)

Implementation of the auth subject abstract base (user lookup for JWT/Local/Anonymous connectors).

---

### challengeStore?

```ts
challengeStore?: Type<ChallengeStoreBase>;
```

Defined in: [libs/platform-authentication/src/AuthModule.ts:118](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-authentication/src/AuthModule.ts#L118)

Optional implementation of the challenge store abstract base.
Defaults to an in-memory store suitable for single-instance deployments.
For multi-instance deployments, provide a Redis-backed implementation.

---

### mfaChannels?

```ts
mfaChannels?: Type<any>[];
```

Defined in: [libs/platform-authentication/src/AuthModule.ts:104](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-authentication/src/AuthModule.ts#L104)

Optional array of additional MFA channel types to register (e.g. `TotpMfaChannel`).
Import them from the provider-specific sub-paths
(e.g. `@pixel-brewery/archipel-platform-authentication/mfa/totp`).

Built-in channels (SMS, Email, Push) are always registered.

---

### mfaSubject

```ts
mfaSubject: Type<MfaSubjectBase>;
```

Defined in: [libs/platform-authentication/src/AuthModule.ts:58](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-authentication/src/AuthModule.ts#L58)

Implementation of the MFA subject abstract base (MFA state persistence).

---

### middleware?

```ts
middleware?: IAuthMiddlewareOptions;
```

Defined in: [libs/platform-authentication/src/AuthModule.ts:125](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-authentication/src/AuthModule.ts#L125)

Optional middleware configuration.
Controls registration of `LastActiveMiddleware` and `LimitRequestSizeMiddleware`.
Both are enabled by default when omitted.

---

### sessionPersistence

```ts
sessionPersistence: Type<SessionPersistenceBase>;
```

Defined in: [libs/platform-authentication/src/AuthModule.ts:63](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-authentication/src/AuthModule.ts#L63)

Implementation of the session persistence abstract base.

---

### socialAuth?

```ts
socialAuth?: Type<SocialAuthBase>;
```

Defined in: [libs/platform-authentication/src/AuthModule.ts:74](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-authentication/src/AuthModule.ts#L74)

Optional implementation of the social auth abstract base (OAuth connectors).
When provided together with `socialConnectors`, the social auth flow is enabled.

---

### socialConnectors?

```ts
socialConnectors?: Type<any>[];
```

Defined in: [libs/platform-authentication/src/AuthModule.ts:82](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-authentication/src/AuthModule.ts#L82)

Optional array of social connector types to register (e.g. `AppleConnector`, `GithubConnector`).
Import them from the provider-specific sub-paths
(e.g. `@pixel-brewery/archipel-platform-authentication/connectors/apple`).
Requires `socialAuth` to be set.

---

### tokenEnricher?

```ts
tokenEnricher?: Type<TokenEnricherBase>;
```

Defined in: [libs/platform-authentication/src/AuthModule.ts:95](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-authentication/src/AuthModule.ts#L95)

Optional implementation of the token enricher abstract base.
When provided, additional claims are added to JWT tokens.

---

### verificationSubject

```ts
verificationSubject: Type<VerificationSubjectBase>;
```

Defined in: [libs/platform-authentication/src/AuthModule.ts:68](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-authentication/src/AuthModule.ts#L68)

Implementation of the verification subject abstract base (email/pin verification).
