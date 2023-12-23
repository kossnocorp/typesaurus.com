---
layout: "../../../layouts/Docs.astro"
---

# `query`

To query a collection, use `query` method on [`Collection`](/docs/classes/collection):

It accepts `($: TypesaurusQuery.Helpers<Def>) => Data<Def['Model']>` as the argument, the function where you define the query:

```ts
await db.users.query(($) => [
  $.field("name").equal("Sasha"),
  $.field("birthday").moreOrEqual(new Date(2000, 1, 1)),
]);
```

The method returns [`Doc[]`](/docs/classes/doc).

## Subscription

Instead of awaiting the promise returned from `query`, you can call `on` on it, to subscribe to the document updates:

```ts
db.users
  .query(($) => [
    $.field("name").equal("Sasha"),
    $.field("birthday").moreOrEqual(new Date(2000, 1, 1)),
  ])
  .on((users) => {
    // ...
  });
```

To catch errors, use `catch` after calling `on`:

```ts
db.users
  .query(($) => [
    $.field("name").equal("Sasha"),
    $.field("birthday").moreOrEqual(new Date(2000, 1, 1)),
  ])
  .on((users) => {
    // ...
  });
  .catch((error) => {
    error;
    // Don't have permission!
  });
```

## Pagination

To paginate data, use one of methods provided by [`$` helpers](#helpers):

```ts
await db.users.query(($) => [
  // $.docId - use id for sorting
  $.field($.docId()).order($.startAfter(lastUserId)),
  // Every page - 25 documents
  $.limit(25),
]);
```

Use last user id, starting with `undefined`, to query the page, `$.limit` to specify the page size.

> Note that when quering large datasets with a lot of similar data, i.e. by name, ordering by that data might cause Firestore skip pages, so unless you know why - use `$.docId()`.

## Helpers

The query helper `$`, contains several methods that will help you build your query:

- [`$.field`](#field)
- [`$.limit`](#limit)
- [`$.startAt`](#startat)
- [`$.startAfter`](#startafter)
- [`$.endAt`](#endat)
- [`$.endBefore`](#endbefore)

### `$.field`

The method selects a given field, including nested paths:

```ts
await db.users.query(($) =>
  // Where profile.name.first is Alexander
  $.field("profile", "name", "first").equal("Alexander")
);
```

The result of field provides few methods that define the query:

- [`$.field.less`](#fieldless)
- [`$.field.lessOrEqual`](#fieldlessorequal)
- [`$.field.equal`](#fieldequal)
- [`$.field.not`](#fieldnot)
- [`$.field.more`](#fieldmore)
- [`$.field.moreOrEqual`](#fieldmoreorequal)
- [`$.field.in`](#fieldin)
- [`$.field.notin`](#fieldnotin)

#### `$.field.less`

TODO

#### `$.field.lessOrEqual`

TODO

#### `$.field.equal`

TODO

#### `$.field.not`

TODO

#### `$.field.more`

TODO

#### `$.field.moreOrEqual`

TODO

#### `$.field.in`

TODO

#### `$.field.notIn`

TODO

### `$.limit`

TODO

### `$.startAt`

TODO

### `$.startAfter`

TODO

### `$.endAt`

TODO

### `$.endBefore`

TODO

### `$.docId`

TODO

## Options

You can tell Typesaurus that it's safe to use dates by passing `as` option:

```ts
const users = await db.users.query(
  ($) => [
    $.field("name").equal("Sasha"),
    $.field("birthday").moreOrEqual(new Date(2000, 1, 1)),
  ],
  { as: "server" }
);

users?[0].data.createdAt;
//=> Date, without { as: "server" } would be Date | undefined
```

[Read more about server dates](/docs/advanced/serverdates).

---

See other reading methods:

- [get](/docs/api/get)
- [all](/docs/api/all)
- [query](/docs/api/query)
- [many](/docs/api/many)
