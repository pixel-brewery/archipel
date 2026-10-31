---
title: 'Class: AuthenticationHealthIndicator'
generated: true
editUrl: false
---

# Class: AuthenticationHealthIndicator

Defined in: [libs/platform-authentication/src/health/AuthenticationHealthIndicator.ts:15](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-authentication/src/health/AuthenticationHealthIndicator.ts#L15)

Health indicator for the authentication infrastructure.

## Implements

- `IHealthIndicator`

## Constructors

### Constructor

```ts
new AuthenticationHealthIndicator(): AuthenticationHealthIndicator;
```

#### Returns

`AuthenticationHealthIndicator`

## Properties

### key

```ts
readonly key: string = 'authentication';
```

Defined in: [libs/platform-authentication/src/health/AuthenticationHealthIndicator.ts:18](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-authentication/src/health/AuthenticationHealthIndicator.ts#L18)

Unique key identifying the indicator

#### Implementation of

`IHealthIndicator.key`

## Methods

### check()

```ts
check(): HealthIndicatorResult<string>;
```

Defined in: [libs/platform-authentication/src/health/AuthenticationHealthIndicator.ts:30](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-authentication/src/health/AuthenticationHealthIndicator.ts#L30)

Returns the health status of the authentication infrastructure.

#### Returns

`HealthIndicatorResult`\<`string`\>

The health indicator result.

#### Implementation of

`IHealthIndicator.check`
