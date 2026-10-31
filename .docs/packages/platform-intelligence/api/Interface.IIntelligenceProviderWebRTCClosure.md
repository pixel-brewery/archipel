---
title: 'Interface: IIntelligenceProviderWebRTCClosure'
generated: true
editUrl: false
---

# Interface: IIntelligenceProviderWebRTCClosure

Defined in: [libs/platform-intelligence/src/providers/IIntelligenceProviderWebRTCClosure.ts:13](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence/src/providers/IIntelligenceProviderWebRTCClosure.ts#L13)

Outcome of ending a browser-owned WebRTC session through a provider's
server control channel.

## Properties

### durationSeconds

```ts
readonly durationSeconds: number | null;
```

Defined in: [libs/platform-intelligence/src/providers/IIntelligenceProviderWebRTCClosure.ts:26](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence/src/providers/IIntelligenceProviderWebRTCClosure.ts#L26)

Final cumulative voice duration in seconds that the provider reported
for the closed session, or `null` when it reported none.

---

### status

```ts
readonly status: "terminated" | "already-ended";
```

Defined in: [libs/platform-intelligence/src/providers/IIntelligenceProviderWebRTCClosure.ts:20](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence/src/providers/IIntelligenceProviderWebRTCClosure.ts#L20)

`terminated` when this call closed the running session, or
`already-ended` when the provider no longer knew it.
