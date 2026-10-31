---
title: 'Abstract Class: SocialAuthBase'
generated: true
editUrl: false
---

# Abstract Class: SocialAuthBase

Defined in: [libs/platform-authentication/src/abstracts/SocialAuthBase.ts:10](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-authentication/src/abstracts/SocialAuthBase.ts#L10)

Abstract base for resolving or creating subjects from social / OAuth profiles.
Used by all social strategies (GitHub, Google, Microsoft, Apple).

## Constructors

### Constructor

```ts
new SocialAuthBase(): SocialAuthBase;
```

#### Returns

`SocialAuthBase`

## Methods

### findOrCreateByProfile()

```ts
abstract findOrCreateByProfile(profile): Promise<IAuthSubject>;
```

Defined in: [libs/platform-authentication/src/abstracts/SocialAuthBase.ts:30](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-authentication/src/abstracts/SocialAuthBase.ts#L30)

Find an existing subject matching the social profile,
or create a new one if none exists.

#### Parameters

| Parameter | Type                                         | Description                    |
| --------- | -------------------------------------------- | ------------------------------ |
| `profile` | [`ISocialProfile`](Interface.ISocialProfile) | The normalized social profile. |

#### Returns

`Promise`\<[`IAuthSubject`](Interface.IAuthSubject)\>

The existing or newly created subject.
