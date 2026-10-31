---
title: 'Interface: IErrorPageParams'
generated: true
editUrl: false
---

# Interface: IErrorPageParams

Defined in: [libs/platform-core/src/services/ErrorTemplateService.ts:19](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-core/src/services/ErrorTemplateService.ts#L19)

Parameters for generating error page content.

## Properties

### actionText?

```ts
actionText?: string;
```

Defined in: [libs/platform-core/src/services/ErrorTemplateService.ts:49](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-core/src/services/ErrorTemplateService.ts#L49)

Optional action button text.

#### Default

```ts
'Go to Home';
```

---

### footer?

```ts
footer?: {
  copyright: string;
};
```

Defined in: [libs/platform-core/src/services/ErrorTemplateService.ts:68](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-core/src/services/ErrorTemplateService.ts#L68)

Optional footer configuration.

#### copyright

```ts
copyright: string;
```

---

### message

```ts
message: string;
```

Defined in: [libs/platform-core/src/services/ErrorTemplateService.ts:33](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-core/src/services/ErrorTemplateService.ts#L33)

The error message.

---

### path

```ts
path: string;
```

Defined in: [libs/platform-core/src/services/ErrorTemplateService.ts:38](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-core/src/services/ErrorTemplateService.ts#L38)

The request path.

---

### showDetails?

```ts
showDetails?: boolean;
```

Defined in: [libs/platform-core/src/services/ErrorTemplateService.ts:55](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-core/src/services/ErrorTemplateService.ts#L55)

Whether to show error details (path, timestamp).

#### Default

```ts
false in production;
```

---

### statusCode

```ts
statusCode: number;
```

Defined in: [libs/platform-core/src/services/ErrorTemplateService.ts:23](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-core/src/services/ErrorTemplateService.ts#L23)

The HTTP status code.

---

### style?

```ts
style?: {
  primary: string;
  secondary: string;
};
```

Defined in: [libs/platform-core/src/services/ErrorTemplateService.ts:60](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-core/src/services/ErrorTemplateService.ts#L60)

Optional style configuration.

#### primary

```ts
primary: string;
```

#### secondary

```ts
secondary: string;
```

---

### timestamp?

```ts
timestamp?: string;
```

Defined in: [libs/platform-core/src/services/ErrorTemplateService.ts:43](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-core/src/services/ErrorTemplateService.ts#L43)

Optional timestamp.

---

### title

```ts
title: string;
```

Defined in: [libs/platform-core/src/services/ErrorTemplateService.ts:28](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-core/src/services/ErrorTemplateService.ts#L28)

The error title.
