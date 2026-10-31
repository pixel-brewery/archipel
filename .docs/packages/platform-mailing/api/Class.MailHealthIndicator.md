---
title: 'Class: MailHealthIndicator'
generated: true
editUrl: false
---

# Class: MailHealthIndicator

Defined in: [libs/platform-mailing/src/health/MailHealthIndicator.ts:17](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-mailing/src/health/MailHealthIndicator.ts#L17)

Health indicator for mail service.

## Implements

- `IHealthIndicator`

## Constructors

### Constructor

```ts
new MailHealthIndicator(configService): MailHealthIndicator;
```

Defined in: [libs/platform-mailing/src/health/MailHealthIndicator.ts:31](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-mailing/src/health/MailHealthIndicator.ts#L31)

Constructs a new instance of the `MailHealthIndicator` class.

#### Parameters

| Parameter       | Type            |
| --------------- | --------------- |
| `configService` | `ConfigService` |

#### Returns

`MailHealthIndicator`

## Properties

### key

```ts
readonly key: string = 'mail';
```

Defined in: [libs/platform-mailing/src/health/MailHealthIndicator.ts:39](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-mailing/src/health/MailHealthIndicator.ts#L39)

Unique key identifying the indicator

#### Implementation of

`IHealthIndicator.key`

## Methods

### check()

```ts
check(): HealthIndicatorResult<"mail">;
```

Defined in: [libs/platform-mailing/src/health/MailHealthIndicator.ts:51](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-mailing/src/health/MailHealthIndicator.ts#L51)

Checks if the mail configuration is valid.

#### Returns

`HealthIndicatorResult`\<`"mail"`\>

The health indicator result.

#### Implementation of

`IHealthIndicator.check`
