---
title: 'Interface: IExpressServerStepOptions'
generated: true
editUrl: false
---

# Interface: IExpressServerStepOptions

Defined in: [libs/platform-bootstrap/src/server/express/IExpressServerStepOptions.ts:9](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-bootstrap/src/server/express/IExpressServerStepOptions.ts#L9)

Options for the Express-compatible server bootstrap step.

## Properties

### compression?

```ts
readonly compression?: boolean | CompressionOptions;
```

Defined in: [libs/platform-bootstrap/src/server/express/IExpressServerStepOptions.ts:17](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-bootstrap/src/server/express/IExpressServerStepOptions.ts#L17)

Compression middleware options, or `false` to skip compression.

---

### json?

```ts
readonly json?: boolean | OptionsJson;
```

Defined in: [libs/platform-bootstrap/src/server/express/IExpressServerStepOptions.ts:11](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-bootstrap/src/server/express/IExpressServerStepOptions.ts#L11)

JSON body parser options, or `false` to skip JSON body parsing.

---

### urlEncoded?

```ts
readonly urlEncoded?: boolean | OptionsUrlencoded;
```

Defined in: [libs/platform-bootstrap/src/server/express/IExpressServerStepOptions.ts:14](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-bootstrap/src/server/express/IExpressServerStepOptions.ts#L14)

URL-encoded body parser options, or `false` to skip URL-encoded body parsing.
