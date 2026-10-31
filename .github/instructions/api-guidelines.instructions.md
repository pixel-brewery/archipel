---
applyTo: '**'
description: 'Guidelines for naming and structuring RESTful API URLs (endpoints) to ensure consistency, readability, maintainability, and SEO friendliness.'
---

# API URL / Endpoint Naming Guideline (REST & SEO-Friendly)

This document defines general rules for naming and structuring RESTful API URLs (endpoints). It is **not** tied to a specific domain - it should be applicable across different APIs - and aims to ensure consistency, readability, maintainability and SEO friendliness.

## Table of Contents

- [1. Core Principles & Foundations](#1-core-principles--foundations)
- [2. Additional Rules & Refinements](#2-additional-rules--refinements)
- [3. Example Template (Pseudo-URLs)](#3-example-template-pseudo-urls)
- [4. How Tools / AI / IDEs Should Enforce This](#4-how-tools--ai--ides-should-enforce-this)

---

## 1. Core Principles & Foundations

- **Use nouns, not verbs**
  Endpoints should represent _resources_ (nouns) rather than actions. The HTTP methods (GET, POST, PUT, PATCH, DELETE) represent the actions.
  _Bad:_ `/getUsers`, `/createOrder`
  _Good:_ `/users`, `/orders/{orderId}`
  (Aus: REST URI Naming Conventions – “Do not use CRUD function names in URIs”)

- **Use plural nouns for collections**
  When an endpoint represents a collection of items, use the plural form. For a single item, use the same noun plus an identifier.
  _Example:_ `/books` (all books), `/books/{bookId}` (one book)
  (Aus: REST API URI Naming Conventions – “Use ‘plural’ name to denote store resource archetype”)

- **Hierarchy via forward slash for relationships**
  Use `/parent/{parentId}/child/{childId}` to reflect parent-child relationships. But avoid deep or arbitrary nesting.
  _Example:_ `/users/{userId}/orders/{orderId}`
  (Aus: “Use forward slash (/) to indicate hierarchical relationships”)

- **No trailing slash in URIs**
  The trailing slash at the end of a URI adds no semantic value and may confuse clients; omit it.
  _Better:_ `/api/devices` not `/api/devices/`

- **Lowercase, hyphens for readability**
    - Use lowercase letters in all path segments.
    - Use hyphens (`-`) to separate words (kebab-case).
    - Avoid underscores (`_`) or CamelCase, as they reduce readability or cause confusion.
      (Aus: REST API URI Naming Conventions – “Use lowercase letters … Use hyphens … Do not use underscores”)
      (Aus: DreamFactory – “Separate words with hyphens … Use lowercase letters … Avoid underscores”)
      (Aus: Moesif – “Resource names use exclusively lowercase letters … words separated by hyphens”)

- **Do not use file extensions**
  Paths should not include `.json`, `.xml` or other file extensions. Use HTTP headers (e.g. `Accept`, `Content-Type`) to negotiate formats.
  (Aus: REST API URI Naming Conventions – “Do not use file extensions”)
  (Aus: DreamFactory – “Avoid including file extensions in URIs; instead, use the Content-Type header”)

- **Use HTTP methods, not verbs in paths**
  Actions (create, update, delete) should **not** be embedded in the path. Use POST / DELETE / PATCH etc.
  _Bad:_ `/users/create`, `/posts/delete/123`
  _Good:_ `POST /users`, `DELETE /posts/{postId}`
  (Aus: REST API URI Naming Conventions – “Never use CRUD function names in URIs”)

- **Query parameters for filtering, sorting, pagination**
  When clients need to filter, sort, page through a collection, use query parameters rather than new endpoints.
  _Example:_ `/products?category=books&sort=price_asc&page=2`
  (Aus: REST API URI Naming Conventions – “Use query component to filter URI collection”)

---

## 2. Additional Rules & Refinements

- **Limit nesting depth**
  Deep nested paths (5+ segments) become hard to maintain and understand. Only nest where semantically necessary.

- **Be consistent across the API**
  Once you choose conventions (pluralization, hyphen usage, path structure), apply them uniformly. Inconsistencies create confusion.
  (Aus: DreamFactory – “Be consistent with naming REST API endpoints”)

- **Version your API in the path**
  Use a version prefix, e.g. `/api/v1/…`, so you can evolve the API without breaking clients.

- **Status or relation endpoints**
  Sometimes you need to expose “state” or relations (e.g. “is bookmarked?”, “follow status”). Model these as clear subpaths under the relevant resource, e.g. `/posts/{postId}/bookmark-status`, `/users/{userId}/follow-status`.

- **Model “action-like” resources as nouns when needed**
  For actions that do not naturally map to a persistent resource (e.g. search, analytics), wrap them as noun-like endpoints: `/search`, `/analytics`, `/reports` rather than `/do-search` etc.

- **Hide implementation / DB details**
  The path should reflect the domain model, not the internal data schema or table names. Avoid exposing internal architecture.

- **Path parameters only for resource identity**
  Use `{id}` or `{username}` for identifying a specific resource. Use query parameters for optional criteria (filters, sorting, paging).

- **Optional hypermedia / linking (HATEOAS)**
  If you adopt hypermedia, include a `links` or `_links` section in response bodies to allow clients to navigate to related resources (self, parent, child). This is optional.

- **Consistent error handling and HTTP status codes**
  Use standard status codes:
    - `200 OK` for successful GET
    - `201 Created` for successful POST (resource creation)
    - `204 No Content` for successful DELETE: declare
      `@HttpCode(HttpStatus.NO_CONTENT)`, return `Promise<void>`, and publish no
      response serializer/schema or OpenAPI content body
    - `400 Bad Request`, `401 Unauthorized`, `404 Not Found`, etc. for error cases

- **Keep URLs short, intuitive and meaningful**
  Avoid unnecessary segments, abbreviations, or cryptic identifiers that reduce clarity.

---

## 3. Example Template (Pseudo-URLs)

These examples show how endpoints might look under these rules (not tied to your domain):

```
GET     /api/v1/users
POST    /api/v1/users
GET     /api/v1/users/{userId}
PUT     /api/v1/users/{userId}
PATCH   /api/v1/users/{userId}
DELETE  /api/v1/users/{userId}

GET     /api/v1/users/{userId}/orders
POST    /api/v1/users/{userId}/orders
GET     /api/v1/orders/{orderId}
DELETE  /api/v1/orders/{orderId}

GET     /api/v1/orders/{orderId}/items
POST    /api/v1/orders/{orderId}/items
DELETE  /api/v1/orders/{orderId}/items/{itemId}

GET     /api/v1/posts/{postId}/comments
POST    /api/v1/posts/{postId}/comments
DELETE  /api/v1/posts/{postId}/comments/{commentId}

GET     /api/v1/posts/{postId}/likes
POST    /api/v1/posts/{postId}/likes
DELETE  /api/v1/posts/{postId}/likes/{likeId}
GET     /api/v1/posts/{postId}/like-status
```

---

## 4. How Tools / AI / IDEs Should Enforce This

When generating or validating endpoints:

1. Derive a **resource noun** (e.g. “users”, “orders”).
2. Use **plural** form for collections.
3. Include path parameters only for resource identity (`{id}`, `{username}`).
4. Use HTTP methods (GET, POST, PUT, PATCH, DELETE) for the operations rather than verbs in paths.
5. Use only **lowercase letters + hyphens** in path segments.
6. Nest only when a genuine parent-child relationship exists.
7. Use query parameters for optional filters, sorting, pagination - not extra path segments.
8. If a path segment is “verb-like”, refactor it: remove the verb, use the resource noun and proper HTTP method.
9. Ensure new endpoints follow the same conventions as existing ones (pluralization, hyphens, depth).
10. Optionally generate `links` metadata in responses if hypermedia is used.
11. Always include API version if versioning is in use.
12. Use standard HTTP status codes consistently for success, errors, deletes, creates, etc.

---

You can hand this Markdown to any AI, tool, or developer, and require that they only **generate, validate or refactor** API endpoints in full compliance with these rules.
