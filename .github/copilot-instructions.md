# RealWorld NestJS - AI Coding Agent Instructions

## Architecture Overview

This is a **RealWorld API implementation** using NestJS with TypeScript, PostgreSQL, and JWT authentication. The project follows a **modular architecture** where each domain (user, article, profile, tag, course) is organized as a separate NestJS module under `src/api/`.

### Key Architectural Patterns

- **API-First Design**: All modules are nested under `src/api/` and exported through `ApiModule`
- **Global Guards & Filters**: Authentication, validation, and exception handling are applied globally in `main.ts`
- **Configuration-Based Setup**: Environment-specific configs using `@nestjs/config` with validation classes
- **Abstract Entity Pattern**: All entities extend `AbstractEntity` for consistent timestamps

## Authentication System

**Authentication is GLOBAL by default** - every endpoint requires JWT unless explicitly marked:

```typescript
@Public() // Completely bypasses auth (login, register)
@AuthOptional() // Auth is optional, user may or may not be present
// No decorator = Auth required
```

- JWT tokens are validated by `AuthGuard` in `src/guards/auth.guard.ts`
- User payload is injected via `@GetCurrentUser()` decorator
- Password hashing uses **Argon2** (not bcrypt) - see `src/utils/hashing.util.ts`

## Database Patterns

### Entity Structure

- **All entities extend `AbstractEntity`** for `createdAt`/`updatedAt` timestamps
- Use `@Index()` decorators for unique constraints: `@Index('UQ_user_email', { unique: true })`
- Password hashing happens in entity lifecycle hooks (`@BeforeInsert`, `@BeforeUpdate`)

### Migrations

- TypeORM migrations in `src/database/migrations/`
- **Always use migrations** - synchronize is disabled in production
- Commands: `pnpm run migration:generate`, `migration:run`, `migration:revert`

## Request/Response Patterns

### DTO Structure

- **Nested DTO pattern**: Request DTOs wrap data in property (e.g., `{ user: { username, email } }`)
- **Separate Request/Response DTOs**: `*.req.dto.ts` and `*.res.dto.ts`
- **Comprehensive Swagger docs**: Every DTO property has `@ApiProperty` with examples

```typescript
// Standard pattern - data wrapped in domain property
class RegisterReqDto {
  @ValidateNested()
  @Type(() => UserData)
  user: UserData;
}
```

### API Response Format

- Responses wrap data in domain property: `{ user: {...}, article: {...} }`
- Error responses use global exception filter with structured format
- All endpoints have `/api` prefix (set globally)

## Development Workflow

### Essential Commands

```bash
# Development with hot reload
pnpm run start:dev

# Database operations
pnpm run migration:generate src/database/migrations/MigrationName
pnpm run migration:run

# Testing
pnpm run test        # Unit tests
pnpm run test:e2e    # E2E tests
pnpm run test:watch  # Watch mode
```

### Module Creation Pattern

When adding new features:

1. Create module in `src/api/[domain]/`
2. Include: `[domain].controller.ts`, `[domain].service.ts`, `[domain].module.ts`
3. Add `dto/` and `entities/` subdirectories
4. Export from `src/api/api.module.ts`

## Key Files & Directories

- **`src/main.ts`**: Global configuration, guards, pipes, filters, CORS, Swagger setup
- **`src/app.module.ts`**: Root module with config, database, i18n setup
- **`src/api/api.module.ts`**: Aggregates all feature modules
- **`src/config/`**: Environment-specific configuration with validation
- **`src/guards/auth.guard.ts`**: JWT authentication logic with optional auth support
- **`src/filters/global-exception.filter.ts`**: Centralized error handling
- **`src/decorators/`**: Custom decorators for auth (@Public, @AuthOptional, @GetCurrentUser)

## Project-Specific Conventions

- **Absolute imports**: Use `@/` prefix for `src/` (configured in tsconfig.json)
- **Entity naming**: `[Domain]Entity` class name, `[domains]` table name
- **Global interceptor**: Request/response logging is enabled by default
- **Validation**: Global validation pipe with `whitelist: true` and transformation
- **TypeScript strict mode**: Full type safety with strict compiler options

## Integration Points

- **Swagger/OpenAPI**: Auto-generated docs at `/api` endpoint
- **i18n Support**: Multi-language via nestjs-i18n with query parameter resolver
- **CORS**: Enabled for all origins in development
- **Custom TypeORM Logger**: Structured database query logging
- **Global Exception Filter**: Handles TypeORM errors, validation errors, and HTTP exceptions

## Testing Patterns

- E2E tests in `test/` directory using Jest
- Test database configuration separate from development
- Use request validation DTOs in tests to ensure API contract compliance

Remember: This codebase follows **RealWorld specification** - maintain compatibility with the expected API format and response structure when making changes.
