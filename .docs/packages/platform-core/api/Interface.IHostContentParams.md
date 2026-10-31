---
title: 'Interface: IHostContentParams'
generated: true
editUrl: false
---

# Interface: IHostContentParams

Defined in: [libs/platform-core/src/services/HostService.ts:19](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-core/src/services/HostService.ts#L19)

Parameters for generating host content.

## Properties

### actions?

```ts
actions?: {
  description: string;
  link: string;
}[];
```

Defined in: [libs/platform-core/src/services/HostService.ts:38](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-core/src/services/HostService.ts#L38)

Optional array of action buttons (CTAs).

#### description

```ts
description: string;
```

The description of the action (used as button text).

#### link

```ts
link: string;
```

The link URL for the action.

---

### data?

```ts
data?: Record<string, unknown>;
```

Defined in: [libs/platform-core/src/services/HostService.ts:126](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-core/src/services/HostService.ts#L126)

Optional additional data to be injected into the template.

---

### description

```ts
description: string;
```

Defined in: [libs/platform-core/src/services/HostService.ts:28](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-core/src/services/HostService.ts#L28)

The subtitle/description of the page.

---

### features?

```ts
features?: {
  description: string;
  icon?: string;
  link: string;
  title: string;
}[];
```

Defined in: [libs/platform-core/src/services/HostService.ts:53](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-core/src/services/HostService.ts#L53)

Optional array of feature cards.

#### description

```ts
description: string;
```

The description of the feature (used as link text).

#### icon?

```ts
icon?: string;
```

Optional icon (emoji or URL).

#### link

```ts
link: string;
```

The link URL for the feature.

#### title

```ts
title: string;
```

The title of the feature.

---

### footer?

```ts
footer?: {
  copyright: string;
  links?: {
     label: string;
     url: string;
  }[];
  stage?: string;
  version?: string;
};
```

Defined in: [libs/platform-core/src/services/HostService.ts:91](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-core/src/services/HostService.ts#L91)

Optional footer configuration.

#### copyright

```ts
copyright: string;
```

Copyright text (e.g., "© 2025 Company Name. All rights reserved.").

#### links?

```ts
links?: {
  label: string;
  url: string;
}[];
```

Optional array of footer links.

#### stage?

```ts
stage?: string;
```

Optional stage label (e.g., "Beta", "Alpha").

#### version?

```ts
version?: string;
```

Optional version string.

---

### health?

```ts
health?: IHealthCheckResult[];
```

Defined in: [libs/platform-core/src/services/HostService.ts:86](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-core/src/services/HostService.ts#L86)

Optional health check result to display.

---

### logo

```ts
logo: string;
```

Defined in: [libs/platform-core/src/services/HostService.ts:33](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-core/src/services/HostService.ts#L33)

The logo URL (can be a regular URL or data URL).

---

### style?

```ts
style?: {
  primary: string;
  secondary: string;
};
```

Defined in: [libs/platform-core/src/services/HostService.ts:78](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-core/src/services/HostService.ts#L78)

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

### title

```ts
title: string;
```

Defined in: [libs/platform-core/src/services/HostService.ts:23](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-core/src/services/HostService.ts#L23)

The title of the page.
