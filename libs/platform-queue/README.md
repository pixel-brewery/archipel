# @pixel-brewery/archipel-platform-queue

Queue infrastructure for NestJS with in-memory FIFO, BullMQ (Redis), Azure Service Bus, and Vercel Queues provider backends.

## Features

- **Interface-driven** — `IQueue` contract for all queue implementations
- **In-memory FIFO** — `MemoryQueue` with LRU-style capacity eviction
- **BullMQ (Redis)** — Persistent, distributed job queue via Redis
- **Azure Service Bus** — Enterprise-grade cloud messaging with peek-lock
- **Vercel Queues** — Durable serverless event streaming via the official `@vercel/queue` SDK
- **Job lifecycle** — Pending → Processing → Completed / Failed with timestamps
- **Generic payloads** — Type-safe `IQueueJob<TPayload>` with full metadata tracking
- **Domain errors** — `QueueJobNotFoundError`, `QueueJobStateError`, `QueueValidationError`
- **Capacity bounding** — Configurable `maxJobs` with automatic eviction of finished jobs (MemoryQueue)
- **Health checks** — `QueueHealthIndicator` for readiness probes (separate `/health` subpath)

## Quick Start

### Memory (development / single-instance)

```typescript
import { Module } from '@nestjs/common';
import { MemoryQueue, IQueue } from '@pixel-brewery/archipel-platform-queue';

@Module({
    providers: [
        {
            provide: 'IQueue',
            useFactory: () => new MemoryQueue({ maxJobs: 5_000 }),
        },
    ],
    exports: ['IQueue'],
})
export class AppModule {}
```

### BullMQ (Redis)

```typescript
import { Module } from '@nestjs/common';
import { IQueue } from '@pixel-brewery/archipel-platform-queue';
import { BullMqQueue } from '@pixel-brewery/archipel-platform-queue/bullmq';

@Module({
    providers: [
        {
            provide: 'IQueue',
            useFactory: () => new BullMqQueue({ redisUrl: 'redis://localhost:6379' }),
        },
    ],
    exports: ['IQueue'],
})
export class AppModule {}
```

### Azure Service Bus

```typescript
import { Module } from '@nestjs/common';
import { IQueue } from '@pixel-brewery/archipel-platform-queue';
import { AzureQueue } from '@pixel-brewery/archipel-platform-queue/azure';

@Module({
    providers: [
        {
            provide: 'IQueue',
            useFactory: () =>
                new AzureQueue({
                    connectionString: 'Endpoint=sb://...;SharedAccessKeyName=...;SharedAccessKey=...',
                }),
        },
    ],
    exports: ['IQueue'],
})
export class AppModule {}
```

### Vercel Queues

```typescript
import { Module } from '@nestjs/common';
import { IQueue } from '@pixel-brewery/archipel-platform-queue';
import { VercelQueue } from '@pixel-brewery/archipel-platform-queue/vercel';

@Module({
    providers: [
        {
            provide: 'IQueue',
            useFactory: () =>
                new VercelQueue({
                    region: 'iad1',
                    consumerGroup: 'my-consumer',
                }),
        },
    ],
    exports: ['IQueue'],
})
export class AppModule {}
```

### Usage

```typescript
import { Injectable, Inject } from '@nestjs/common';
import { IQueue, QUEUE_JOB_STATUS } from '@pixel-brewery/archipel-platform-queue';

@Injectable()
export class InvoiceService {
    constructor(@Inject('IQueue') private readonly _queue: IQueue) {}

    public async scheduleInvoice(invoiceId: number): Promise<void> {
        await this._queue.enqueue('invoices', { invoiceId });
    }

    public async processNext(): Promise<void> {
        const job = await this._queue.dequeue('invoices');
        if (!job) return;

        try {
            // ... process the job
            await this._queue.markCompleted(job.id);
        } catch (error) {
            await this._queue.markFailed(job.id, (error as Error).message);
        }
    }
}
```

## Supported Providers

| Provider              | Package                                         | Description                                       |
| --------------------- | ----------------------------------------------- | ------------------------------------------------- |
| **Memory**            | `@pixel-brewery/archipel-platform-queue`        | In-memory FIFO queue (dev / single-instance)      |
| **BullMQ**            | `@pixel-brewery/archipel-platform-queue/bullmq` | Redis-backed distributed queue via BullMQ         |
| **Azure Service Bus** | `@pixel-brewery/archipel-platform-queue/azure`  | Azure Service Bus with peek-lock message handling |
| **Vercel Queues**     | `@pixel-brewery/archipel-platform-queue/vercel` | Durable serverless event streaming via Vercel     |

**Health indicator (optional):**

```typescript
import { QueueHealthIndicator } from '@pixel-brewery/archipel-platform-queue/health';
```

## Error Handling

| Error Class             | Base Class   | When Thrown                                    |
| ----------------------- | ------------ | ---------------------------------------------- |
| `QueueError`            | `Error`      | Base class for all queue errors                |
| `QueueJobNotFoundError` | `QueueError` | Job ID does not exist                          |
| `QueueJobStateError`    | `QueueError` | Job is in wrong state for requested transition |
| `QueueValidationError`  | `QueueError` | Empty queue name or error message              |

## Resource Limits

| Limit    | Default | Description                                                   |
| -------- | ------- | ------------------------------------------------------------- |
| Max jobs | 10,000  | `MemoryQueue` evicts oldest completed/failed jobs at capacity |

## Environment Variables

| Variable                                  | Provider          | Required | Default | Description                                          |
| ----------------------------------------- | ----------------- | -------- | ------- | ---------------------------------------------------- |
| `QUEUE_MAX_JOBS`                          | Memory            | No       | `10000` | Maximum jobs retained before eviction                |
| `BULLMQ_REDIS_URL`                        | BullMQ            | Yes      | —       | Redis connection URL (e.g. `redis://localhost:6379`) |
| `BULLMQ_PREFIX`                           | BullMQ            | No       | `""`    | Optional key prefix applied to all BullMQ queues     |
| `AZURE_CONNECTION_STRING`                 | Azure Service Bus | Yes      | —       | Azure Service Bus connection string                  |
| `AZURE_RECEIVE_WAIT_MS`                   | Azure Service Bus | No       | `5000`  | Max wait time (ms) when receiving messages           |
| `VERCEL_QUEUE_REGION`                     | Vercel Queues     | Yes      | —       | Vercel region code (e.g. `iad1`, `fra1`, `sfo1`)     |
| `VERCEL_QUEUE_TOKEN`                      | Vercel Queues     | No       | —       | OIDC bearer token (auto-fetched when omitted)        |
| `VERCEL_QUEUE_CONSUMER_GROUP`             | Vercel Queues     | Yes      | —       | Consumer group name for receiving messages           |
| `VERCEL_QUEUE_VISIBILITY_TIMEOUT_SECONDS` | Vercel Queues     | No       | `300`   | Visibility timeout (seconds); SDK auto-extends lease |
| `VERCEL_QUEUE_DEPLOYMENT_ID`              | Vercel Queues     | No       | —       | Optional deployment ID for message isolation         |

## Peer Dependencies

| Package                                   | Required | Notes                         |
| ----------------------------------------- | -------- | ----------------------------- |
| `@nestjs/common`                          | Yes      | NestJS core                   |
| `bullmq`                                  | Optional | Required for BullMQ provider  |
| `@azure/service-bus`                      | Optional | Required for Service Bus      |
| `@pixel-brewery/archipel-platform-health` | Optional | Required for health indicator |
| `@nestjs/terminus`                        | Optional | Required for health indicator |
| `@vercel/queue`                           | Optional | Required for Vercel provider  |

The Vercel Queues provider uses the official `@vercel/queue` SDK. When no token is provided, the SDK automatically fetches one via OIDC.

## Development

```bash
# Build
yarn nx build platform-queue

# Test
yarn nx test platform-queue

# Lint
yarn nx lint platform-queue
```
