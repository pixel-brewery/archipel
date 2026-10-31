---
title: 'Class: PlatformProcessGuard'
generated: true
editUrl: false
---

# Class: PlatformProcessGuard

Defined in: [libs/platform-bootstrap/src/process/PlatformProcessGuard.ts:38](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-bootstrap/src/process/PlatformProcessGuard.ts#L38)

Process-level handling of fatal errors and broken standard streams.

Registering an `uncaughtException` listener switches off the Node.js default crash, so a listener that
only logs lets the process continue in an undefined state. The guard restores fail-fast semantics
instead: it reports the first fatal error once on a best-effort basis, gives stdout and stderr a bounded
time to flush, and exits with code 1 so that a supervisor or serverless platform replaces the process.

A closed standard stream (`EPIPE`, `ERR_STREAM_DESTROYED`) is ignored. Reporting it would write to the
same broken stream and raise the next error, which is how an endless logging loop starts. Any other
standard stream failure is fatal, as it is without a listener.

Install the guard once, as early as possible in the application entrypoint.

## Example

```typescript
const processGuard = PlatformProcessGuard.install({ logger: new Logger('Process') });

main().catch((error: unknown) => processGuard.terminate(error, 'startup'));
```

## Methods

### install()

```ts
static install(options?): PlatformProcessGuard;
```

Defined in: [libs/platform-bootstrap/src/process/PlatformProcessGuard.ts:75](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-bootstrap/src/process/PlatformProcessGuard.ts#L75)

Installs the guard on the process.

#### Parameters

| Parameter  | Type                                                                     | Description                                                    |
| ---------- | ------------------------------------------------------------------------ | -------------------------------------------------------------- |
| `options?` | [`IPlatformProcessGuardOptions`](Interface.IPlatformProcessGuardOptions) | Optional logger, rejection handling, flush bound, and process. |

#### Returns

`PlatformProcessGuard`

The installed guard, which can also terminate the process for fatal errors it does not observe itself.

---

### terminate()

```ts
terminate(error, origin): void;
```

Defined in: [libs/platform-bootstrap/src/process/PlatformProcessGuard.ts:91](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-bootstrap/src/process/PlatformProcessGuard.ts#L91)

Reports a fatal error once and terminates the process with exit code 1.

Calls made while the process is already terminating are ignored, so a failure raised by the report
itself cannot start another report.

#### Parameters

| Parameter | Type      | Description                                                             |
| --------- | --------- | ----------------------------------------------------------------------- |
| `error`   | `unknown` | The fatal error or rejection reason.                                    |
| `origin`  | `string`  | Where the error surfaced, for example `uncaughtException` or `startup`. |

#### Returns

`void`
