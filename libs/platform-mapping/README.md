# @pixel-brewery/archipel-platform-mapping

Type-safe object-to-object mapping framework for NestJS with a fluent builder API and profile-based configuration.

## Features

- **Type-safe mapping keys** — Compile-time safety for source → destination pairs
- **Profile-based configuration** — Group related mappings in reusable profile classes
- **Fluent builder API** — `createMap`, `forMember` for declarative field mapping
- **NestJS integration** — Injectable `MappingService` with dynamic module registration

## Quick Start

```typescript
import { MappingModule, MappingService, MappingProfileBase, MappingKey } from '@pixel-brewery/archipel-platform-mapping';

const USER_TO_RESPONSE = new MappingKey<UserEntity, UserResponse>('UserToResponse');

class UserMappingProfile extends MappingProfileBase {
    public configure(builder: IMappingBuilder): void {
        builder.createMap<UserEntity, UserResponse>(USER_TO_RESPONSE, UserResponse).forMember('displayName', (src) => `${src.firstName} ${src.lastName}`);
    }
}

@Module({
    imports: [
        MappingModule.register({
            profiles: [UserMappingProfile],
        }),
    ],
})
export class AppModule {}
```

## Error Handling

| Error Class                     | When Thrown                                  |
| ------------------------------- | -------------------------------------------- |
| `MappingNotRegisteredError`     | No mapping registered for the given key      |
| `TypeMappingNotRegisteredError` | No type mapping registered for the given key |

## Peer Dependencies

| Package          | Required | Notes       |
| ---------------- | -------- | ----------- |
| `@nestjs/common` | Yes      | NestJS core |

## Documentation

📖 **Package Docs:** [`.docs/packages/platform-mapping/index.md`](../../.docs/packages/platform-mapping/index.md)

## Development

```bash
# Build
yarn nx build platform-mapping

# Test
yarn nx test platform-mapping

# Lint
yarn nx lint platform-mapping
```

# Lint

yarn nx lint platform-mapping

```

```
