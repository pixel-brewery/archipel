---
title: 'Class: ProblemDetailExceptionFilter'
generated: true
editUrl: false
---

# Class: ProblemDetailExceptionFilter

Defined in: [libs/platform-core/src/filters/ProblemDetailExceptionFilter.ts:22](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-core/src/filters/ProblemDetailExceptionFilter.ts#L22)

A NestJS exception filter that transforms exceptions into Problem Details
compliant responses as per RFC 7807.

## Implements

- `ExceptionFilter`\<`HttpException`\>

## Constructors

### Constructor

```ts
new ProblemDetailExceptionFilter(urlResolver?): ProblemDetailExceptionFilter;
```

Defined in: [libs/platform-core/src/filters/ProblemDetailExceptionFilter.ts:31](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-core/src/filters/ProblemDetailExceptionFilter.ts#L31)

#### Parameters

| Parameter      | Type                                                                     |
| -------------- | ------------------------------------------------------------------------ |
| `urlResolver?` | [`ProblemDetailTypeUrlResolver`](TypeAlias.ProblemDetailTypeUrlResolver) |

#### Returns

`ProblemDetailExceptionFilter`

## Properties

### urlResolver?

```ts
protected urlResolver?: ProblemDetailTypeUrlResolver;
```

Defined in: [libs/platform-core/src/filters/ProblemDetailExceptionFilter.ts:31](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-core/src/filters/ProblemDetailExceptionFilter.ts#L31)

## Methods

### catch()

```ts
catch(exception, host): any;
```

Defined in: [libs/platform-core/src/filters/ProblemDetailExceptionFilter.ts:37](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-core/src/filters/ProblemDetailExceptionFilter.ts#L37)

Method to implement a custom exception filter.

#### Parameters

| Parameter   | Type            | Description                                                    |
| ----------- | --------------- | -------------------------------------------------------------- |
| `exception` | `Error`         | the class of the exception being handled                       |
| `host`      | `ArgumentsHost` | used to access an array of arguments for the in-flight request |

#### Returns

`any`

#### Implementation of

`ExceptionFilter.catch`

---

### setLogger()

```ts
setLogger(logger): void;
```

Defined in: [libs/platform-core/src/filters/ProblemDetailExceptionFilter.ts:47](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-core/src/filters/ProblemDetailExceptionFilter.ts#L47)

#### Parameters

| Parameter | Type            |
| --------- | --------------- |
| `logger`  | `LoggerService` |

#### Returns

`void`
