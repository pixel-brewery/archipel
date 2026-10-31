---
title: 'Interface: ISocialProfile'
generated: true
editUrl: false
---

# Interface: ISocialProfile

Defined in: [libs/platform-authentication/src/contracts/ISocialProfile.ts:6](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-authentication/src/contracts/ISocialProfile.ts#L6)

Profile data received from a social / OAuth provider.

## Properties

### displayName

```ts
readonly displayName: string | null;
```

Defined in: [libs/platform-authentication/src/contracts/ISocialProfile.ts:27](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-authentication/src/contracts/ISocialProfile.ts#L27)

Display name.

---

### email

```ts
readonly email: string;
```

Defined in: [libs/platform-authentication/src/contracts/ISocialProfile.ts:22](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-authentication/src/contracts/ISocialProfile.ts#L22)

Email address as reported by the provider.

---

### provider

```ts
readonly provider: string;
```

Defined in: [libs/platform-authentication/src/contracts/ISocialProfile.ts:12](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-authentication/src/contracts/ISocialProfile.ts#L12)

The OAuth provider name (e.g. 'github', 'google', 'microsoft', 'apple').

---

### userName

```ts
readonly userName: string | null;
```

Defined in: [libs/platform-authentication/src/contracts/ISocialProfile.ts:17](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-authentication/src/contracts/ISocialProfile.ts#L17)

User name as reported by the provider.
