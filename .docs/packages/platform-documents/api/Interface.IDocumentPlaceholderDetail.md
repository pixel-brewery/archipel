---
title: 'Interface: IDocumentPlaceholderDetail'
generated: true
editUrl: false
---

# Interface: IDocumentPlaceholderDetail

Defined in: [libs/platform-documents/src/types/DocumentTypes.ts:41](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-documents/src/types/DocumentTypes.ts#L41)

Placeholder detail for document probe report.

## Properties

### original

```ts
original: string;
```

Defined in: [libs/platform-documents/src/types/DocumentTypes.ts:45](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-documents/src/types/DocumentTypes.ts#L45)

Original placeholder text as found in template

---

### path

```ts
path: string;
```

Defined in: [libs/platform-documents/src/types/DocumentTypes.ts:50](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-documents/src/types/DocumentTypes.ts#L50)

Resolved data path

---

### reason?

```ts
reason?: string;
```

Defined in: [libs/platform-documents/src/types/DocumentTypes.ts:65](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-documents/src/types/DocumentTypes.ts#L65)

Reason why placeholder was not replaced or had issues

---

### replacementValue?

```ts
replacementValue?: string;
```

Defined in: [libs/platform-documents/src/types/DocumentTypes.ts:60](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-documents/src/types/DocumentTypes.ts#L60)

Replacement value (stringified if replaced)

---

### status

```ts
status: 'replaced' | 'notFound' | 'error';
```

Defined in: [libs/platform-documents/src/types/DocumentTypes.ts:55](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-documents/src/types/DocumentTypes.ts#L55)

Processing status
