# @pixel-brewery/archipel-platform-reporting

Business intelligence integration layer with dataset catalogues, query orchestration, and export primitives for NestJS.

## Features

- **Report generation** — Build and execute structured reports
- **Data aggregation** — Aggregate data from multiple sources
- **Export utilities** — CSV, PDF, and Excel export formats
- **Query orchestration** — `ReportingFacade.executeQuery()` with timeout protection
- **Contributor registry** — `ReportingContributorRegistry` for pluggable data sources

## Quick Start

```typescript
import { ReportingModule } from '@pixel-brewery/archipel-platform-reporting';

@Module({
    imports: [ReportingModule],
})
export class AppModule {}
```

## Error Handling

| Error Class                     | When Thrown                       |
| ------------------------------- | --------------------------------- |
| `ReportingDatasetNotFoundError` | Referenced dataset does not exist |
| `ReportingQueryValidationError` | Invalid query parameters          |
| `ReportingExecutionError`       | Query execution failure           |

## Resource Limits

| Limit            | Value      | Description                                                     |
| ---------------- | ---------- | --------------------------------------------------------------- |
| Max contributors | 200        | `ReportingContributorRegistry` rejects registrations beyond 200 |
| Query timeout    | 30 seconds | `ReportingFacade.executeQuery()` aborts after 30 seconds        |

## Peer Dependencies

| Package          | Required | Notes       |
| ---------------- | -------- | ----------- |
| `@nestjs/common` | Yes      | NestJS core |

## Documentation

📖 **Package Docs:** [`.docs/packages/platform-reporting/index.md`](../../.docs/packages/platform-reporting/index.md)

## Development

```bash
# Build
yarn nx build platform-reporting

# Test
yarn nx test platform-reporting

# Lint
yarn nx lint platform-reporting
```
