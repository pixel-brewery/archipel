---
title: AI Realtime Voice
description: Choose client-secret WebSocket, server WebSocket, or browser WebRTC for realtime audio and text, continue a conversation on a new WebRTC connection, and end browser-owned sessions from the server.
order: 17
---

# AI Realtime Voice

`IntelligenceRealtimeSessionFactory` selects a connection mode for a realtime
model. Realtime differs from `IntelligenceTranscriptionGenerator.stream()`:
transcription receives an audio stream and produces text, while realtime is a
bidirectional conversation.

| `connectionMode`          | Connection                                                            | `createSession()` returns                  |
| ------------------------- | --------------------------------------------------------------------- | ------------------------------------------ |
| `client-secret-websocket` | Archipel opens an upstream WebSocket using a short-lived model secret | `IntelligenceRealtimeSessionBase`          |
| `server-websocket`        | Archipel opens an upstream WebSocket with server credentials          | `IntelligenceRealtimeSessionBase`          |
| `webrtc`                  | Archipel exchanges a browser SDP offer with the provider              | `IIntelligenceRealtimeWebRTCSessionResult` |

Omitting `connectionMode` selects a supported server WebSocket first, then a
client-secret WebSocket. The requested model must advertise the selected mode.
In the installed OpenAI adapter, `gpt-live-1` offers server WebSocket and WebRTC;
`gpt-realtime` uses client-secret WebSocket. Other registered providers can
advertise their own supported modes.

## Registration

```typescript
import { Module } from '@nestjs/common';
import { IntelligenceModule } from '@pixel-brewery/archipel-platform-intelligence';
import { OPENAI_CONFIG_ENTRIES, OpenAIIntelligenceProviderAdapter } from '@pixel-brewery/archipel-platform-intelligence/provider/openai';

@Module({
    imports: [
        IntelligenceModule.register({
            configEntries: [...OPENAI_CONFIG_ENTRIES],
            providerAdapters: [OpenAIIntelligenceProviderAdapter],
            realtime: {
                connectionTimeoutMs: 5_000,
                closeTimeoutMs: 5_000,
                maxActiveSessions: 100,
                maxPendingEvents: 512,
                maxBufferedBytes: 4 * 1024 * 1024,
                meteringIntervalMs: 30_000,
                terminationMaxRetries: 2,
                meteringAdapter: ApplicationRealtimeMeteringAdapter,
            },
        }),
    ],
})
export class ApplicationModule {}
```

The application supplies `ApplicationRealtimeMeteringAdapter` if it needs
durable metering. Otherwise the module uses its no-op adapter.
`closeTimeoutMs` also bounds a complete WebRTC termination, including up to
`terminationMaxRetries` retries of transient provider failures.

## WebSocket sessions

The application authenticates its own browser WebSocket, resolves tenant
context, creates an Archipel session, and forwards the normalized events. The
upstream credentials and socket stay in the backend.

```typescript
const session = await sessions.createSession({
    connectionMode: 'client-secret-websocket',
    sessionId: applicationSessionId,
    provider: 'openai',
    model: 'gpt-realtime',
    metadata: { tenantId, userId },
    sessionConfiguration: {
        instructions: 'Help with the authenticated tenant context only.',
        outputModalities: ['text', 'audio'],
    },
    onEvent: (event) => forwardToApplicationSocket(event),
});

await session.connect();
await session.appendAudio(base64AudioChunk);
await session.commitAudio();
await session.close();
```

For OpenAI Live, choose `connectionMode: 'server-websocket'` and
`model: 'gpt-live-1'`. Live starts with `session-start`, accepts continuous
audio and `context-append`, and ends with `session-close`. Its startup settings
are immutable; turn-based helpers such as `sendText()` and `requestResponse()`
are for models that support those events. For example, while a Live session is
connected:

```typescript
await session.send({
    type: 'context-append',
    content: 'Answer in German.',
    delegationId: null,
    providerOptions: { openai: { channel: 'instructions' } },
});
```

The abstract base exposes the selected `connectionMode` and closes the upstream socket
on `close()` or module shutdown. WebSocket sessions count toward
`maxActiveSessions`.

## Browser WebRTC

WebRTC needs two authenticated application endpoints. The first calls
`getWebRTCConfiguration({ provider: 'openai', model: 'gpt-live-1' })` and returns
the `dataChannelLabel` before the browser creates its SDP offer. The second
passes that offer to `createSession()` and returns `answerSdp`:

```typescript
// In the authenticated configuration endpoint:
return sessions.getWebRTCConfiguration({ provider: 'openai', model: 'gpt-live-1' });

// In the authenticated SDP exchange endpoint:
const answer = await sessions.createSession({
    connectionMode: 'webrtc',
    sessionId: applicationSessionId,
    provider: 'openai',
    model: 'gpt-live-1',
    offerSdp: browserOfferSdp,
    sessionConfiguration: {
        instructions: 'Help with the authenticated tenant context only.',
    },
});

// Keep what the server needs to end the provider session later.
await connections.recordStarted({
    sessionId: answer.sessionId,
    provider: answer.provider,
    model: answer.model,
    providerSessionId: answer.providerSessionId,
});

return { answerSdp: answer.answerSdp };
```

The browser uses the returned label when creating its data channel, adds a
microphone track, and sends the completed local SDP offer through the second
endpoint. It then applies `answerSdp` as the remote description:

```typescript
const configuration = await fetch('/api/realtime/webrtc/config').then((response) => response.json());
const peer = new RTCPeerConnection();
const output = new Audio();
output.autoplay = true;
peer.ontrack = (event) => {
    output.srcObject = event.streams[0] ?? null;
};
const microphone = await navigator.mediaDevices.getUserMedia({ audio: true });
for (const track of microphone.getAudioTracks()) {
    peer.addTrack(track, microphone);
}

const events = peer.createDataChannel(configuration.dataChannelLabel);
events.onmessage = (message) => handleProviderEvent(JSON.parse(message.data));

const offer = await peer.createOffer();
await peer.setLocalDescription(offer);
if (peer.iceGatheringState !== 'complete') {
    await new Promise<void>((resolve) => {
        const onIceGatheringStateChange = (): void => {
            if (peer.iceGatheringState === 'complete') {
                peer.removeEventListener('icegatheringstatechange', onIceGatheringStateChange);
                resolve();
            }
        };
        peer.addEventListener('icegatheringstatechange', onIceGatheringStateChange);
    });
}
if (!peer.localDescription?.sdp) {
    throw new Error('WebRTC offer has no SDP.');
}
const response = await fetch('/api/realtime/webrtc/session', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ offerSdp: peer.localDescription.sdp }),
});
const { answerSdp } = await response.json();
await peer.setRemoteDescription({ type: 'answer', sdp: answerSdp });

// On application shutdown, close the peer and stop the microphone tracks.
```

After the SDP exchange, audio and the data channel connect directly from the
browser to the provider. The data channel carries the provider's native event
format, so the browser must handle that protocol. Archipel cannot observe that
connection and does not emit its WebSocket metering events for it, but it can
end the provider session from the server, as described below. The
application owns WebRTC admission limits, lifecycle, and usage reconciliation
through its provider account data.

## Continuing a conversation on a new connection

A browser-owned provider session ends with its peer connection. When the
application continues the same conversation on a new connection, for example
after a pause that closed the connection, a dropped network, or a page reload,
the new provider session starts without the earlier turns. Pass the most recent
turns, oldest first, as `conversationHistory` in the SDP exchange:

```typescript
const answer = await sessions.createSession({
    connectionMode: 'webrtc',
    sessionId: applicationSessionId,
    provider: 'openai',
    model: 'gpt-live-1',
    offerSdp: browserOfferSdp,
    sessionConfiguration: { instructions },
    // Most recent turns within IntelligenceRealtimeConversationHistoryLimits, oldest first.
    conversationHistory: [
        { speaker: 'user', text: 'How many tasks are open?' },
        { speaker: 'assistant', text: 'Three tasks are open.' },
    ],
});

if (answer.conversationHistory === 'unsupported') {
    // The model starts without the earlier conversation.
}
```

Load the turns on the server from the application's own record of the
conversation, after the usual ownership checks. Archipel hands them to the
provider as one quoted, untrusted context block: never as instructions and never
as the model's own statements, so a transcript that a browser reported can
neither speak for the model nor grant permissions. The handover does not make the
model respond; it answers the next turn with the earlier conversation in mind.

| `IntelligenceRealtimeConversationHistoryLimits` | Value                                        |
| ----------------------------------------------- | -------------------------------------------- |
| `maxTurns`                                      | 32 turns                                     |
| `maxTextBytes`                                  | 6,144 UTF-8 bytes of all turn texts combined |

A history within these limits fits every provider that supports the handover,
including the quoting that Archipel adds. Select the most recent turns that fit:
an empty or larger history, a turn without visible text, or a speaker other than
`user` or `assistant` raises `IntelligenceValidationError` before any provider
request. Archipel never shortens a history on its own. Line breaks inside a turn
are rendered as spaces, so a turn cannot pose as another speaker's turn.

| Result `conversationHistory` | Meaning                                                                                                                          |
| ---------------------------- | -------------------------------------------------------------------------------------------------------------------------------- |
| `handed-over`                | The provider received the turns with the session setup.                                                                          |
| `unsupported`                | The model's API cannot receive earlier turns during WebRTC setup. The session started without them, and Archipel logs a warning. |
| absent                       | No history was requested.                                                                                                        |

The OpenAI adapter seeds GPT-Live sessions through the session's `input`
messages, which do not trigger speech, and sends all turns as one `user`
message. Combining the handover with `providerOptions.openai.input` raises
`IntelligenceValidationError`. A Realtime API model would report `unsupported`,
because its calls cannot receive earlier turns during setup; in the installed
SDK only GPT-Live models negotiate WebRTC at all, and the Google, xAI/Grok, and
Gateway adapters negotiate none. A provider adapter declares support by
implementing `IntelligenceProviderAdapterBase.applyWebRTCConversationHistory()`.

## Ending browser-owned sessions

The provider keeps a browser-owned session running, and keeps consuming provider
usage, for as long as the browser keeps its peer connection open. Rejecting the
browser's heartbeats, losing the backend, or closing the application's own
channels does not end it. `terminateWebRTCSession()` ends the provider session
with the server credentials, using the identifiers persisted during the SDP
exchange:

```typescript
import { IntelligenceRealtimeError } from '@pixel-brewery/archipel-platform-intelligence';

try {
    const result = await sessions.terminateWebRTCSession({
        requestId,
        sessionId: connection.sessionId,
        provider: connection.provider,
        model: connection.model,
        providerSessionId: connection.providerSessionId,
        reason: 'lease-expired',
    });
    await connections.recordEnded(connection, result.status, result.durationSeconds);
} catch (error: unknown) {
    if (!(error instanceof IntelligenceRealtimeError) || !error.isRetryable) {
        throw error;
    }
    await connections.scheduleTerminationRetry(connection);
}
```

Call it on every path that ends the application's claim on a connection:

| Trigger                                                                  | Suggested `reason`    |
| ------------------------------------------------------------------------ | --------------------- |
| A server-side connection lease expires because heartbeats stopped        | `lease-expired`       |
| The browser reports that it closed its peer connection                   | `client-disconnected` |
| The logical session completes, for example on logout or exhausted credit | `session-completed`   |

The lease-expiry path is the fail-closed safety net because it does not depend
on the browser. A browser that ends a conversation normally can still close the
session gracefully over its data channel; the server call afterwards is safe
because termination is idempotent:

| `status`        | Meaning                                                                                  |
| --------------- | ---------------------------------------------------------------------------------------- |
| `terminated`    | The provider closed the session or accepted the hang-up and ends it.                     |
| `already-ended` | The provider reports the session as unknown, closed, or expired. Nothing remains to end. |
| `unsupported`   | The provider cannot end sessions from the server. Treat the session as still running.    |

Invalid identifiers raise `IntelligenceValidationError`; an unregistered
provider or missing credentials raise `IntelligenceConfigurationError`. Both
happen before any provider request. Other provider failures raise
`IntelligenceRealtimeError` with `phase: 'close'`, after Archipel has retried
transient failures up to `terminationMaxRetries` times within `closeTimeoutMs`.
Archipel logs neither credentials nor provider error messages.

Pass the `model` returned by `createSession()`. It selects the provider API that
owns the session, and there is deliberately no default: after a default-model
change, a request could reach an API that reports the session as unknown while
it keeps running. Applications that must be able to stop every provider session
can call `supportsWebRTCSessionTermination(provider)` before the SDP exchange
and refuse browser-owned sessions when it returns `false`.

### Final provider duration

Some providers report a session's final billable duration only while closing
it. For those, `terminateWebRTCSession()` first closes the running session
through the provider's control channel and returns `durationSeconds`, the
provider's cumulative voice duration for the closed session. The channel gets
half of `closeTimeoutMs`; when it fails or does not answer in time, Archipel
hangs the session up within the remaining budget instead, and the result
carries no duration. `durationSeconds` is also absent for `already-ended`,
because nothing was closed by this call, and for providers that report no
duration. Settle duration-based billing against it when present, and keep the
application's own measurement otherwise.

The OpenAI adapter closes GPT-Live sessions such as `gpt-live-1` through their
sideband WebSocket `wss://…/v1/live/sessions/{session_id}/attach`. It attaches
with the server API key, sends `session.close`, and reads `usage.seconds` from
`session.closed`; it ignores the audio copies the sideband also carries and
ends the attempt on any event larger than 1 MiB. Its fallback is
`POST /v1/live/sessions/{session_id}/hangup`. Realtime API calls, which OpenAI
bills by tokens, are hung up with `POST /v1/realtime/calls/{call_id}/hangup`.
The adapter chooses the API through the same SDK model routing that negotiated
the session and resolves OpenAI's `session_id_not_found` and
`call_id_not_found` responses as `already-ended`. A provider adapter declares
the control channel by implementing
`IntelligenceProviderAdapterBase.closeWebRTCSession()` alongside
`terminateWebRTCSession()`. The Google, xAI/Grok, and Gateway adapters
negotiate no WebRTC sessions and report `unsupported`.

## Tools and metering

For turn-based WebSocket models, Archipel converts registered application tools
to realtime definitions unless explicit tools are supplied. `activeToolNames`
restricts the available set. Registered Archipel tools are not auto-injected
into continuous Live models. The installed OpenAI Live adapter does not accept
realtime tools in its startup configuration.

`IntelligenceRealtimeMeteringBase` receives idempotent session-start,
billing-interval, provider-usage, provider-duration, and session-end events for
server-owned WebSockets. `provider-duration` is cumulative provider-reported
seconds, not an interval delta. The application chooses its pricing and charging
units and persists business-critical charges transactionally.
