---
title: 'Interface: IAzureQueueOptions'
generated: true
editUrl: false
---

# Interface: IAzureQueueOptions

Defined in: [libs/platform-queue/src/azure/AzureQueue.ts:19](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-queue/src/azure/AzureQueue.ts#L19)

Configuration options for [AzureQueue](Class.AzureQueue).

## Properties

### connectionString

```ts
connectionString: string;
```

Defined in: [libs/platform-queue/src/azure/AzureQueue.ts:28](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-queue/src/azure/AzureQueue.ts#L28)

Azure Service Bus connection string.

#### Example

```ts
`Endpoint=sb://my-namespace.servicebus.windows.net/;SharedAccessKeyName=...;SharedAccessKey=...`
@public
```

---

### receiveWaitMs?

```ts
receiveWaitMs?: number;
```

Defined in: [libs/platform-queue/src/azure/AzureQueue.ts:36](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-queue/src/azure/AzureQueue.ts#L36)

Maximum wait time in milliseconds when receiving messages.

#### Default Value

```ts
5_000
@public
```
