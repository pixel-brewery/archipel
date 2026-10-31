---
title: 'Class: TelemetryLoggerService'
generated: true
editUrl: false
---

# Class: TelemetryLoggerService

Defined in: [libs/platform-telemetry/src/logger/TelemetryLoggerService.ts:9](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-telemetry/src/logger/TelemetryLoggerService.ts#L9)

ConsoleLogger rendering with active trace correlation and optional metric-rule forwarding.

## Extends

- `ConsoleLogger`

## Implements

- `LoggerService`

## Constructors

### Constructor

```ts
new TelemetryLoggerService(ruleEngine?, options?): TelemetryLoggerService;
```

Defined in: [libs/platform-telemetry/src/logger/TelemetryLoggerService.ts:15](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-telemetry/src/logger/TelemetryLoggerService.ts#L15)

#### Parameters

| Parameter     | Type                                               |
| ------------- | -------------------------------------------------- |
| `ruleEngine?` | [`TelemetryRuleEngine`](Class.TelemetryRuleEngine) |
| `options?`    | `ConsoleLoggerOptions`                             |

#### Returns

`TelemetryLoggerService`

#### Overrides

`ConsoleLogger.constructor`

## Methods

### debug()

```ts
debug(message, ...optionalParams): void;
```

Defined in: [libs/platform-telemetry/src/logger/TelemetryLoggerService.ts:34](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-telemetry/src/logger/TelemetryLoggerService.ts#L34)

Write a 'debug' level log, if the configured level allows for it.
Prints to `stdout` with newline.

#### Parameters

| Parameter           | Type        |
| ------------------- | ----------- |
| `message`           | `unknown`   |
| ...`optionalParams` | `unknown`[] |

#### Returns

`void`

#### Implementation of

`LoggerService.debug`

#### Overrides

`ConsoleLogger.debug`

---

### error()

```ts
error(message, ...optionalParams): void;
```

Defined in: [libs/platform-telemetry/src/logger/TelemetryLoggerService.ts:26](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-telemetry/src/logger/TelemetryLoggerService.ts#L26)

Write an 'error' level log, if the configured level allows for it.
Prints to `stderr` with newline.

#### Parameters

| Parameter           | Type        |
| ------------------- | ----------- |
| `message`           | `unknown`   |
| ...`optionalParams` | `unknown`[] |

#### Returns

`void`

#### Implementation of

`LoggerService.error`

#### Overrides

`ConsoleLogger.error`

---

### fatal()

```ts
fatal(message, ...optionalParams): void;
```

Defined in: [libs/platform-telemetry/src/logger/TelemetryLoggerService.ts:42](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-telemetry/src/logger/TelemetryLoggerService.ts#L42)

Write a 'fatal' level log, if the configured level allows for it.
Prints to `stderr` with newline.

#### Parameters

| Parameter           | Type        |
| ------------------- | ----------- |
| `message`           | `unknown`   |
| ...`optionalParams` | `unknown`[] |

#### Returns

`void`

#### Implementation of

`LoggerService.fatal`

#### Overrides

`ConsoleLogger.fatal`

---

### formatMessage()

```ts
protected formatMessage(
   logLevel,
   message,
   pidMessage,
   formattedLogLevel,
   contextMessage,
   timestampDiff,
   params?
): string;
```

Defined in: [libs/platform-telemetry/src/logger/TelemetryLoggerService.ts:47](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-telemetry/src/logger/TelemetryLoggerService.ts#L47)

#### Parameters

| Parameter           | Type                                                                      |
| ------------------- | ------------------------------------------------------------------------- |
| `logLevel`          | `"verbose"` \| `"debug"` \| `"log"` \| `"warn"` \| `"error"` \| `"fatal"` |
| `message`           | `unknown`                                                                 |
| `pidMessage`        | `string`                                                                  |
| `formattedLogLevel` | `string`                                                                  |
| `contextMessage`    | `string`                                                                  |
| `timestampDiff`     | `string`                                                                  |
| `params?`           | `Record`\<`string`, `unknown`\>                                           |

#### Returns

`string`

#### Overrides

`ConsoleLogger.formatMessage`

---

### getJsonLogObject()

```ts
protected getJsonLogObject(message, options): {
[key: string]: unknown;
};
```

Defined in: [libs/platform-telemetry/src/logger/TelemetryLoggerService.ts:61](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-telemetry/src/logger/TelemetryLoggerService.ts#L61)

#### Parameters

| Parameter                  | Type                                                                                                                                                                                                                                                     |
| -------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `message`                  | `unknown`                                                                                                                                                                                                                                                |
| `options`                  | \{ `context`: `string`; `error?`: `Error`; `errorStack?`: `unknown`; `logLevel`: `"verbose"` \| `"debug"` \| `"log"` \| `"warn"` \| `"error"` \| `"fatal"`; `params?`: `Record`\<`string`, `unknown`\>; `writeStreamType?`: `"stdout"` \| `"stderr"`; \} |
| `options.context`          | `string`                                                                                                                                                                                                                                                 |
| `options.error?`           | `Error`                                                                                                                                                                                                                                                  |
| `options.errorStack?`      | `unknown`                                                                                                                                                                                                                                                |
| `options.logLevel`         | `"verbose"` \| `"debug"` \| `"log"` \| `"warn"` \| `"error"` \| `"fatal"`                                                                                                                                                                                |
| `options.params?`          | `Record`\<`string`, `unknown`\>                                                                                                                                                                                                                          |
| `options.writeStreamType?` | `"stdout"` \| `"stderr"`                                                                                                                                                                                                                                 |

#### Returns

```ts
{
[key: string]: unknown;
}
```

#### Overrides

`ConsoleLogger.getJsonLogObject`

---

### log()

```ts
log(message, ...optionalParams): void;
```

Defined in: [libs/platform-telemetry/src/logger/TelemetryLoggerService.ts:22](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-telemetry/src/logger/TelemetryLoggerService.ts#L22)

Write a 'log' level log, if the configured level allows for it.
Prints to `stdout` with newline.

#### Parameters

| Parameter           | Type        |
| ------------------- | ----------- |
| `message`           | `unknown`   |
| ...`optionalParams` | `unknown`[] |

#### Returns

`void`

#### Implementation of

`LoggerService.log`

#### Overrides

`ConsoleLogger.log`

---

### verbose()

```ts
verbose(message, ...optionalParams): void;
```

Defined in: [libs/platform-telemetry/src/logger/TelemetryLoggerService.ts:38](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-telemetry/src/logger/TelemetryLoggerService.ts#L38)

Write a 'verbose' level log, if the configured level allows for it.
Prints to `stdout` with newline.

#### Parameters

| Parameter           | Type        |
| ------------------- | ----------- |
| `message`           | `unknown`   |
| ...`optionalParams` | `unknown`[] |

#### Returns

`void`

#### Implementation of

`LoggerService.verbose`

#### Overrides

`ConsoleLogger.verbose`

---

### warn()

```ts
warn(message, ...optionalParams): void;
```

Defined in: [libs/platform-telemetry/src/logger/TelemetryLoggerService.ts:30](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-telemetry/src/logger/TelemetryLoggerService.ts#L30)

Write a 'warn' level log, if the configured level allows for it.
Prints to `stdout` with newline.

#### Parameters

| Parameter           | Type        |
| ------------------- | ----------- |
| `message`           | `unknown`   |
| ...`optionalParams` | `unknown`[] |

#### Returns

`void`

#### Implementation of

`LoggerService.warn`

#### Overrides

`ConsoleLogger.warn`
