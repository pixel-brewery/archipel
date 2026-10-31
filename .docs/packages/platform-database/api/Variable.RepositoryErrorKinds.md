---
title: 'Variable: RepositoryErrorKinds'
generated: true
editUrl: false
---

# Variable: RepositoryErrorKinds

```ts
const RepositoryErrorKinds: {
    RecordNotFound: 'record-not-found';
    Unclassified: 'unclassified';
    UniqueConstraintViolation: 'unique-constraint-violation';
};
```

Defined in: [libs/platform-database/src/models/errors/RepositoryErrorKinds.ts:6](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-database/src/models/errors/RepositoryErrorKinds.ts#L6)

Classifies why a repository operation failed, independent of the database driver.

## Type Declaration

| Name                                                                        | Type                            | Default value                   | Description                                                                                                                                                                          | Defined in                                                                                                                                                                                      |
| --------------------------------------------------------------------------- | ------------------------------- | ------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| <a id="property-recordnotfound"></a> `RecordNotFound`                       | `"record-not-found"`            | `'record-not-found'`            | An operation required a record that does not exist or no longer matches its filter (Prisma `P2025`), for example a revision-bound update of a record that changed after it was read. | [libs/platform-database/src/models/errors/RepositoryErrorKinds.ts:14](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-database/src/models/errors/RepositoryErrorKinds.ts#L14) |
| <a id="property-unclassified"></a> `Unclassified`                           | `"unclassified"`                | `'unclassified'`                | Any other failure reported by the database client.                                                                                                                                   | [libs/platform-database/src/models/errors/RepositoryErrorKinds.ts:16](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-database/src/models/errors/RepositoryErrorKinds.ts#L16) |
| <a id="property-uniqueconstraintviolation"></a> `UniqueConstraintViolation` | `"unique-constraint-violation"` | `'unique-constraint-violation'` | A write violated a unique constraint (Prisma `P2002`).                                                                                                                               | [libs/platform-database/src/models/errors/RepositoryErrorKinds.ts:8](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-database/src/models/errors/RepositoryErrorKinds.ts#L8)   |
