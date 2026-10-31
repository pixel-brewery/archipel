---
title: 'Interface: ISessionStepOptions'
generated: true
editUrl: false
---

# Interface: ISessionStepOptions

Defined in: [libs/platform-bootstrap/src/session/ISessionStepOptions.ts:9](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-bootstrap/src/session/ISessionStepOptions.ts#L9)

Options for the Express-compatible session bootstrap step.

## Properties

### cookie?

```ts
readonly cookie?: CookieOptions | ((req) => CookieOptions);
```

Defined in: [libs/platform-bootstrap/src/session/ISessionStepOptions.ts:38](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-bootstrap/src/session/ISessionStepOptions.ts#L38)

Cookie options merged into the generated session cookie settings.

---

### enabled?

```ts
readonly enabled?: boolean;
```

Defined in: [libs/platform-bootstrap/src/session/ISessionStepOptions.ts:11](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-bootstrap/src/session/ISessionStepOptions.ts#L11)

Whether the session middleware should be registered.

---

### maxAgeConfigKey?

```ts
readonly maxAgeConfigKey?: IConfigKey<string | number>;
```

Defined in: [libs/platform-bootstrap/src/session/ISessionStepOptions.ts:20](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-bootstrap/src/session/ISessionStepOptions.ts#L20)

Config key containing the session lifetime.

---

### name?

```ts
readonly name?: string;
```

Defined in: [libs/platform-bootstrap/src/session/ISessionStepOptions.ts:23](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-bootstrap/src/session/ISessionStepOptions.ts#L23)

Session cookie name.

---

### resave?

```ts
readonly resave?: boolean;
```

Defined in: [libs/platform-bootstrap/src/session/ISessionStepOptions.ts:26](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-bootstrap/src/session/ISessionStepOptions.ts#L26)

Express-session `resave` option.

---

### rolling?

```ts
readonly rolling?: boolean;
```

Defined in: [libs/platform-bootstrap/src/session/ISessionStepOptions.ts:29](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-bootstrap/src/session/ISessionStepOptions.ts#L29)

Express-session `rolling` option. Renews the cookie max age on every response.

---

### saveUninitialized?

```ts
readonly saveUninitialized?: boolean;
```

Defined in: [libs/platform-bootstrap/src/session/ISessionStepOptions.ts:32](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-bootstrap/src/session/ISessionStepOptions.ts#L32)

Express-session `saveUninitialized` option.

---

### secretConfigKey?

```ts
readonly secretConfigKey?: IConfigKey<string>;
```

Defined in: [libs/platform-bootstrap/src/session/ISessionStepOptions.ts:14](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-bootstrap/src/session/ISessionStepOptions.ts#L14)

Config key containing the session secret.

---

### secureConfigKey?

```ts
readonly secureConfigKey?: IConfigKey<boolean>;
```

Defined in: [libs/platform-bootstrap/src/session/ISessionStepOptions.ts:17](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-bootstrap/src/session/ISessionStepOptions.ts#L17)

Config key containing the secure-cookie flag.

---

### store?

```ts
readonly store?: Store;
```

Defined in: [libs/platform-bootstrap/src/session/ISessionStepOptions.ts:35](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-bootstrap/src/session/ISessionStepOptions.ts#L35)

Optional persistent session store.
