---
title: API Documentation Standards
description: Documentation standards for stable Archipel public APIs and generated reference pages.
order: 5
tags: [guides, docs, api, standards]
---

# API Documentation Standards

Use these standards for package APIs that are consumed by application teams.

## What must be documented

For every exported public symbol:

- purpose and intended usage,
- input/output contract,
- failure behavior,
- minimal usage example when non-obvious.

## Consumer-first writing rules

- Explain **what integrators need to do**, not repository internals.
- Mark required vs optional integration points explicitly.
- Keep examples small and runnable.
- Avoid architecture jargon without practical effect.

## Recommended structure for package overview pages

1. Capability summary
2. Installation/import information
3. Required abstract bases and adapters
4. Optional extension points
5. Minimal registration example
6. Link to generated API reference

## Stability signaling

Document stability expectations clearly:

- `Stable`: safe for long-lived integrations
- `Evolving`: may receive additive changes
- `Experimental`: breaking changes possible

If a symbol is internal, do not expose it from the package barrel.
