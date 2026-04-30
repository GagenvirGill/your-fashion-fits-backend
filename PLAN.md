# Backend Rewrite Plan

## Overview

Full TypeScript rewrite of the YourFashionFits backend. Same Postgres database, reshaped schema, redesigned API surface. Prioritizes type safety, correctness, and production-readiness.

## Stack

- **Runtime**: Node.js + TypeScript
- **Framework**: Fastify
- **ORM**: Prisma
- **Validation**: Zod
- **Logging**: Pino (built into Fastify)
- **Image Storage**: Cloudflare R2 (same as current)
- **Auth**: API key middleware (BFF pattern, Auth.js on frontend)

## Schema Redesign

### Keep as tables
- **User** — id, email, createdAt
- **Item** — id, userId, imagePath, imageWidth, imageHeight, createdAt
- **Category** — id, userId, name, favoriteItem, createdAt
- **ItemCategory** — itemId, categoryId (join table)
- **Outfit** — id, userId, dateWorn, description, layout (JSONB), createdAt

### Remove (collapsed into Outfit.layout)
- OutfitTemplate
- TemplateRow
- TemplateItem

### Layout JSONB structure
```ts
// Each outfit stores its visual layout as:
type OutfitLayout = {
  itemId: string
  weight: number
}[][] // array of rows, each row is array of items with display weight
```

### Migration strategy
1. Introspect existing DB with `prisma db pull`
2. Add `layout` JSONB column to Outfit table
3. Write migration script: read OutfitTemplate/TemplateRow/TemplateItem data, transform into JSONB, write to Outfit.layout
4. Verify all outfits migrated correctly
5. Drop old template tables

## API Design

All routes prefixed with authenticated API key middleware.

| Method | Path | Purpose |
|--------|------|---------|
| GET | `/items` | List items, optional `?categories=id1,id2` filter |
| POST | `/items` | Upload item image (multipart) |
| DELETE | `/items/:id` | Delete item + R2 image cleanup |
| GET | `/items/:id/categories` | Get categories for an item |
| PUT | `/items/:id/categories` | Set item's categories (full replace) |
| GET | `/items/random` | Random item, optional category filter |
| GET | `/categories` | List user's categories |
| POST | `/categories` | Create category |
| PATCH | `/categories/:id` | Update category |
| DELETE | `/categories/:id` | Delete category |
| GET | `/outfits` | List outfits with layout |
| POST | `/outfits` | Create outfit |
| DELETE | `/outfits/:id` | Delete outfit |
| GET | `/outfits/search` | Search by description (`ILIKE` in Postgres) |
| GET | `/health` | Server uptime check (no auth) |

### Key API changes from current
- `PUT /items/:id/categories` — replaces separate add/remove endpoints. Client sends full category list, backend diffs.
- `/outfits/search` — uses DB-level `ILIKE` instead of fetching all outfits and filtering in JS
- Consistent plural paths (`/items` not `/item`)
- All responses follow `{ success, message, data? }` shape
- Error responses never leak internal details in production

## Project Structure

```
src/
  modules/
    items/
      items.routes.ts
      items.schema.ts    (Zod schemas + inferred types)
      items.service.ts   (business logic)
    categories/
      categories.routes.ts
      categories.schema.ts
      categories.service.ts
    outfits/
      outfits.routes.ts
      outfits.schema.ts
      outfits.service.ts
    users/
      users.routes.ts
      users.schema.ts
      users.service.ts
  middleware/
    authenticate.ts      (API key + user ID extraction)
    rate-limit.ts
  lib/
    r2.ts               (R2 upload/delete utilities)
    prisma.ts           (Prisma client singleton)
    logger.ts           (Pino config)
    errors.ts           (Custom error classes)
  server.ts             (Fastify init, plugin registration, start)
prisma/
  schema.prisma
  migrations/
```

## Security & Production Hardening

- Rate limiting per route (stricter on upload/create)
- Request body size limits
- Helmet-equivalent headers (via fastify-helmet)
- CORS configured for known frontend origins only
- Error handler strips stack traces in production
- Structured logging with request IDs for tracing

## Implementation Order

1. **Project scaffolding** — TS config, Fastify setup, Prisma init, introspect existing DB
2. **Schema migration** — Add layout column, write data migration script, verify, drop old tables
3. **Core middleware** — Auth, rate limiting, error handler, CORS
4. **Items module** — Routes, validation, service, R2 integration
5. **Categories module** — Routes, validation, service
6. **Outfits module** — Routes, validation, service (with ILIKE search)
7. **Users module** — Routes as needed
8. **Testing & verification** — Manual endpoint testing, edge cases
9. **Cutover** — Deploy new backend, update frontend API calls

## Item deletion & outfit layout integrity

When an item is deleted, its references in outfit layouts must be cleaned up. The items service will:
1. Delete the item from the DB
2. Delete the image from R2
3. Query outfits containing that itemId in their layout JSONB
4. Remove the item from those layouts (or mark as deleted placeholder)

This replaces the implicit CASCADE behavior of the old normalized tables.
