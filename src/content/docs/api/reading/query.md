---
title: query
sidebar:
  order: 3
  badge: TODO
---

To query a collection, use the `query` method on [`Collection`](/classes/collection/#query):

It accepts a function as the argument, where you define the query.

The method returns an array of [`Doc`](/classes/doc) instances:

```ts
await db.users.query(($) => [
  $.field("name").eq("Sasha"),
  $.field("birthday").gte(new Date(2000, 1, 1)),
]);
//=> Doc<User>[]
```

## Subscription

Instead of awaiting the promise returned from `query`, you can call `on` on it to subscribe to the document updates:

```ts
db.users
  .query(($) => [
    $.field("name").eq("Sasha"),
    $.field("birthday").gte(new Date(2000, 1, 1)),
  ])
  .on((users) => {
    // Doc<User>[]
  });
```

To catch errors, use `catch` after calling `on`:

```ts
db.users
  .query(($) => [
    $.field("name").eq("Sasha"),
    $.field("birthday").gte(new Date(2000, 1, 1)),
  ])
  .on((users) => {
    // ...
  });
  .catch((error) => {
    //=> PERMISSION_DENIED: Missing or insufficient permissions
  });
```

To stop listening to the updates, call the `off` function returned from the method:

```ts
const off = db.users
  .query(($) => [
    $.field("name").eq("Sasha"),
    $.field("birthday").gte(new Date(2000, 1, 1)),
  ])
  .on((users) => {
    // ...
  });

// Unsubscribe after 5 seconds
setTimeout(off, 5000);
```

→ [Read more about subscribing to real-time updates](/advanced/realtime/)

## Pagination

To paginate data, use one of methods provided by [the `$` helper](#-helper):

```ts
await db.users.query(($) => [
  // $.docId - use the id for sorting
  $.field($.docId()).order($.startAfter(lastUserId)),
  // Every page - 25 documents
  $.limit(25),
]);
```

Use last user id, starting with `undefined`, to query the page, `$.limit` to specify the page size.

:::caution[Keep in mind!]
When querying extensive collections with similar data, i.e., using `name` or `country,` ordering by that data might cause Firestore to skip pages. So unless you know why - use `$.docId()`.
:::

## `$` helper

The argument function receives `$` helper object as the first argument that provides the query API.

`$` type is `TypesaurusQuery.Helpers<Def>`.

You can return either a single query, array of queries or falsy value to skip the query and return `undefined`:

```ts
// Single query
await db.users.query(($) => $.field("name").eq("Sasha"));
//=> Doc<User>[]

// Array of queries
await db.users.query(($) => [
  $.field("name").eq("Sasha"),
  $.field("birthday").gte(new Date(2000, 1, 1)),
]);
//=> Doc<User>[]

// If name is string or null:
await db.users.query(($) => name && $.field("name").eq(name));
//=> undefined | Doc<User>[]
```

### `$.field`

The `$.field` allows you to target specific fields in the document. It allows you to query nested fields as well:

```ts
await db.users.query(($) =>
  // Where profile.name.first is Alexander
  $.field("profile", "name", "first").eq("Alexander"),
);
```

The result of the `$.field` provides few methods that define the query.

#### `$.field(...).eq`

#### `$.field(...).not`

#### `$.field(...).lt`

#### `$.field(...).lte`

#### `$.field(...).gt`

#### `$.field(...).gte`

#### `$.field(...).in`

#### `$.field(...).notIn`

#### `$.field(...).contains`

#### `$.field(...).containsAny`

#### `$.field(...).order`

### `$.limit`

### `$.startAt`

### `$.startAfter`

### `$.endAt`

### `$.endBefore`

### `$.docId`

## Options

You can tell Typesaurus that it's safe to use dates by passing `as` option:

```ts
const users = await db.users.query(
  ($) => [
    $.field("name").eq("Sasha"),
    $.field("birthday").gte(new Date(2000, 1, 1)),
  ],
  { as: "server" }
);

users?[0].data.createdAt;
//=> Date, without { as: "server" } would be Date | undefined
```

## Options

### `as`

You can tell Typesaurus that it's safe to use dates by passing the `as` option (`"server" | "client"`):

```ts
const [serverUser] = await db.users.query(($) => $.field("name").eq("Sasha"), {
  as: "server",
});
serverUser && serverUser.data.createdAt;
//=> Date

const [clientUser] = await db.users.query(($) => $.field("name").eq("Sasha"), {
  as: "client",
});
clientUser && clientUser.data.createdAt;
//=> Date | null
```

By default, Typesaurus uses `"client"` option.

→ [Read more about server dates](/type-safety/server-dates/).
