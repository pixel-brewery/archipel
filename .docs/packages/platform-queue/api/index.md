---
title: '@pixel-brewery/archipel-platform-queue'
generated: true
editUrl: false
---

# @pixel-brewery/archipel-platform-queue

## Classes

| Class                                                | Description                                                                  |
| ---------------------------------------------------- | ---------------------------------------------------------------------------- |
| [AzureQueue](Class.AzureQueue)                       | Azure Service Bus queue implementation.                                      |
| [BullMqQueue](Class.BullMqQueue)                     | BullMQ-backed queue implementation.                                          |
| [MemoryQueue](Class.MemoryQueue)                     | In-memory FIFO queue implementation.                                         |
| [QueueError](Class.QueueError)                       | Base error class for all queue-related errors.                               |
| [QueueHealthIndicator](Class.QueueHealthIndicator)   | Health indicator for the queue infrastructure.                               |
| [QueueJobNotFoundError](Class.QueueJobNotFoundError) | Thrown when a queue job cannot be found by its ID.                           |
| [QueueJobStateError](Class.QueueJobStateError)       | Thrown when a queue job is in an invalid state for the requested transition. |
| [QueueValidationError](Class.QueueValidationError)   | Thrown when a queue operation receives invalid input.                        |
| [VercelQueue](Class.VercelQueue)                     | Vercel Queues implementation of the [IQueue](Interface.IQueue) contract.     |

## Interfaces

| Interface                                            | Description                                                 |
| ---------------------------------------------------- | ----------------------------------------------------------- |
| [IAzureQueueOptions](Interface.IAzureQueueOptions)   | Configuration options for [AzureQueue](Class.AzureQueue).   |
| [IBullMqQueueOptions](Interface.IBullMqQueueOptions) | Configuration options for [BullMqQueue](Class.BullMqQueue). |
| [IMemoryQueueOptions](Interface.IMemoryQueueOptions) | Configuration options for [MemoryQueue](Class.MemoryQueue). |
| [IQueue](Interface.IQueue)                           | Contract for queue implementations.                         |
| [IQueueJob](Interface.IQueueJob)                     | Represents a job in a named queue with tracking metadata.   |
| [IVercelQueueOptions](Interface.IVercelQueueOptions) | Configuration options for [VercelQueue](Class.VercelQueue). |

## Type Aliases

| Type Alias                                 | Description                                                              |
| ------------------------------------------ | ------------------------------------------------------------------------ |
| [QueueJobStatus](TypeAlias.QueueJobStatus) | Union type derived from [QUEUE\_JOB\_STATUS](Variable.QUEUE_JOB_STATUS). |

## Variables

| Variable                                                                                        | Description                                                             |
| ----------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------- |
| [AZURE\_CONFIG\_ENTRIES](Variable.AZURE_CONFIG_ENTRIES)                                         | All configuration entries required by the Azure queue provider.         |
| [AZURE\_CONNECTION\_STRING](Variable.AZURE_CONNECTION_STRING)                                   | Azure queue connection string.                                          |
| [AZURE\_RECEIVE\_WAIT\_MS](Variable.AZURE_RECEIVE_WAIT_MS)                                      | Maximum wait time in milliseconds when receiving messages.              |
| [BULLMQ\_CONFIG\_ENTRIES](Variable.BULLMQ_CONFIG_ENTRIES)                                       | All configuration entries required by the BullMQ queue provider.        |
| [BULLMQ\_PREFIX](Variable.BULLMQ_PREFIX)                                                        | Optional key prefix applied to all BullMQ queues in Redis.              |
| [BULLMQ\_REDIS\_URL](Variable.BULLMQ_REDIS_URL)                                                 | Redis connection URL for BullMQ.                                        |
| [PLATFORM\_QUEUE\_CONFIG\_ENTRIES](Variable.PLATFORM_QUEUE_CONFIG_ENTRIES)                      | All configuration entries required by `platform-queue`.                 |
| [QUEUE\_JOB\_STATUS](Variable.QUEUE_JOB_STATUS)                                                 | Possible statuses of a queue job.                                       |
| [QUEUE\_MAX\_JOBS](Variable.QUEUE_MAX_JOBS)                                                     | Maximum number of jobs retained in the in-memory queue before eviction. |
| [VERCEL\_CONFIG\_ENTRIES](Variable.VERCEL_CONFIG_ENTRIES)                                       | All configuration entries required by the Vercel queue provider.        |
| [VERCEL\_QUEUE\_CONSUMER\_GROUP](Variable.VERCEL_QUEUE_CONSUMER_GROUP)                          | Consumer group name for receiving messages.                             |
| [VERCEL\_QUEUE\_DEPLOYMENT\_ID](Variable.VERCEL_QUEUE_DEPLOYMENT_ID)                            | Optional Vercel deployment ID for per-deployment message isolation.     |
| [VERCEL\_QUEUE\_REGION](Variable.VERCEL_QUEUE_REGION)                                           | Vercel region code (e.g. `iad1`, `fra1`, `sfo1`).                       |
| [VERCEL\_QUEUE\_TOKEN](Variable.VERCEL_QUEUE_TOKEN)                                             | Vercel OIDC bearer token for queue authentication.                      |
| [VERCEL\_QUEUE\_VISIBILITY\_TIMEOUT\_SECONDS](Variable.VERCEL_QUEUE_VISIBILITY_TIMEOUT_SECONDS) | Visibility timeout in seconds for received messages.                    |
