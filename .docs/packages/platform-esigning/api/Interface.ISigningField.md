---
title: 'Interface: ISigningField'
generated: true
editUrl: false
---

# Interface: ISigningField

Defined in: [libs/platform-esigning/src/models/ISigningField.ts:12](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-esigning/src/models/ISigningField.ts#L12)

Normalized representation of a signing field placed on a document.

## Properties

### documentId

```ts
readonly documentId: string;
```

Defined in: [libs/platform-esigning/src/models/ISigningField.ts:23](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-esigning/src/models/ISigningField.ts#L23)

Identifier of the document this field is placed on.

---

### fieldId

```ts
readonly fieldId: string;
```

Defined in: [libs/platform-esigning/src/models/ISigningField.ts:14](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-esigning/src/models/ISigningField.ts#L14)

Provider-specific field identifier.

---

### height

```ts
readonly height: number;
```

Defined in: [libs/platform-esigning/src/models/ISigningField.ts:38](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-esigning/src/models/ISigningField.ts#L38)

Height of the field in points.

---

### pageNumber

```ts
readonly pageNumber: number;
```

Defined in: [libs/platform-esigning/src/models/ISigningField.ts:26](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-esigning/src/models/ISigningField.ts#L26)

Page number where the field is placed (1-based).

---

### positionX

```ts
readonly positionX: number;
```

Defined in: [libs/platform-esigning/src/models/ISigningField.ts:29](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-esigning/src/models/ISigningField.ts#L29)

X-coordinate position (points from left).

---

### positionY

```ts
readonly positionY: number;
```

Defined in: [libs/platform-esigning/src/models/ISigningField.ts:32](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-esigning/src/models/ISigningField.ts#L32)

Y-coordinate position (points from top).

---

### required

```ts
readonly required: boolean;
```

Defined in: [libs/platform-esigning/src/models/ISigningField.ts:41](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-esigning/src/models/ISigningField.ts#L41)

Whether the field is required.

---

### signerId

```ts
readonly signerId: string;
```

Defined in: [libs/platform-esigning/src/models/ISigningField.ts:20](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-esigning/src/models/ISigningField.ts#L20)

Identifier of the signer associated with this field.

---

### type

```ts
readonly type: SigningFieldType;
```

Defined in: [libs/platform-esigning/src/models/ISigningField.ts:17](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-esigning/src/models/ISigningField.ts#L17)

Type of the field.

---

### value?

```ts
readonly value?: string;
```

Defined in: [libs/platform-esigning/src/models/ISigningField.ts:44](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-esigning/src/models/ISigningField.ts#L44)

Current value of the field, if filled.

---

### width

```ts
readonly width: number;
```

Defined in: [libs/platform-esigning/src/models/ISigningField.ts:35](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-esigning/src/models/ISigningField.ts#L35)

Width of the field in points.
