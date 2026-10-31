---
title: 'Interface: IDocumentProbeReport'
generated: true
editUrl: false
---

# Interface: IDocumentProbeReport

Defined in: [libs/platform-documents/src/types/DocumentTypes.ts:73](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-documents/src/types/DocumentTypes.ts#L73)

Document probe report.

## Properties

### dataKeys?

```ts
dataKeys?: string[];
```

Defined in: [libs/platform-documents/src/types/DocumentTypes.ts:112](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-documents/src/types/DocumentTypes.ts#L112)

Optional list of available data keys

---

### errorMessage?

```ts
errorMessage?: string;
```

Defined in: [libs/platform-documents/src/types/DocumentTypes.ts:102](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-documents/src/types/DocumentTypes.ts#L102)

Optional error message

---

### format

```ts
format: DocumentFormat;
```

Defined in: [libs/platform-documents/src/types/DocumentTypes.ts:77](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-documents/src/types/DocumentTypes.ts#L77)

Document format

---

### placeholders

```ts
placeholders: IDocumentPlaceholderDetail[];
```

Defined in: [libs/platform-documents/src/types/DocumentTypes.ts:117](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-documents/src/types/DocumentTypes.ts#L117)

Detailed placeholder information

---

### replacedPlaceholders

```ts
replacedPlaceholders: number;
```

Defined in: [libs/platform-documents/src/types/DocumentTypes.ts:87](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-documents/src/types/DocumentTypes.ts#L87)

Number of placeholders successfully replaced

---

### success

```ts
success: boolean;
```

Defined in: [libs/platform-documents/src/types/DocumentTypes.ts:97](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-documents/src/types/DocumentTypes.ts#L97)

Whether probing succeeded

---

### templateId?

```ts
templateId?: string;
```

Defined in: [libs/platform-documents/src/types/DocumentTypes.ts:107](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-documents/src/types/DocumentTypes.ts#L107)

Optional template identifier

---

### totalPlaceholders

```ts
totalPlaceholders: number;
```

Defined in: [libs/platform-documents/src/types/DocumentTypes.ts:82](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-documents/src/types/DocumentTypes.ts#L82)

Total placeholders found

---

### unresolvedPlaceholders

```ts
unresolvedPlaceholders: number;
```

Defined in: [libs/platform-documents/src/types/DocumentTypes.ts:92](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-documents/src/types/DocumentTypes.ts#L92)

Number of placeholders not resolved
