---
title: query
sidebar:
  order: 3
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

To paginate data, use one of the methods provided by [the `$` helper](#-helper):

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

The result of the `$.field` provides a few methods that define the query:

- [`$.field(...).eq`](#fieldeq) - field is equal to a value
- [`$.field(...).not`](#fieldnot) - field is not equal to a value
- [`$.field(...).lt`](#fieldlt) - field is less than a value
- [`$.field(...).lte`](#fieldlte) - field is less or equal to a value
- [`$.field(...).gt`](#fieldgt) - field is greater than a value
- [`$.field(...).gte`](#fieldgte) - field is greater or equal to a value
- [`$.field(...).in`](#fieldin) - field is in an array of values
- [`$.field(...).notIn`](#fieldnotin) - field is not in an array of values
- [`$.field(...).contains`](#fieldcontains) - field array contains a value
- [`$.field(...).containsAny`](#fieldcontainsany) - field array contains any of the values
- [`$.field(...).order`](#fieldorder) - order the query by the field

#### `$.field(...).eq`

To query documents where the field is equal to a value, use the `eq` method:

```ts
await db.users.query(($) =>
  // Query users named Alexander
  $.field("profile", "name", "first").eq("Alexander"),
);
```

#### `$.field(...).not`

To query documents where the field is not equal to a value, use the `not` method:

```ts
await db.users.query(($) =>
  // Query users not named Alexander
  $.field("profile", "name", "first").not("Alexander"),
);
```

:::tip[Keep in mind!]
Firestore will not return documents if the field is not set. So consider using [query flags](/design/query-flags/) or making the field required if you need it to query all documents.
:::

#### `$.field(...).lt`

To query documents where the field is less than a value, use the `lt` method:

```ts
await db.games.query(($) =>
  // Query games with rating less than 3
  $.field("rating").lt(3),
);
```

The method only works with numbers and dates.

#### `$.field(...).lte`

To query documents where the field is less or equal to a value, use the `lte` method:

```ts
await db.games.query(($) =>
  // Query games with rating 3 or less
  $.field("rating").lte(3),
);
```

The method only works with numbers and dates.

#### `$.field(...).gt`

To query documents where the field is greater than a value, use the `gt` method:

```ts
await db.games.query(($) =>
  // Query games with rating greater than 8
  $.field("rating").gt(8),
);
```

The method only works with numbers and dates.

#### `$.field(...).gte`

To query documents where the field is greater or equal to a value, use the `gte` method:

```ts
await db.games.query(($) =>
  // Query games with rating 8 or greater
  $.field("rating").gte(8),
);
```

The method only works with numbers and dates.

#### `$.field(...).in`

To query documents where the field is in an array of values, use the `in` method:

```ts
await db.games.query(($) =>
  // Query games published by Nintendo or Sony
  $.field("publisher").in(["Nintendo", "Sony"]),
);
```

#### `$.field(...).notIn`

To query documents where the field is not in an array of values, use the `notIn` method:

```ts
await db.games.query(($) =>
  // Query games not published by Nintendo or Sony
  $.field("publisher").notIn(["Nintendo", "Sony"]),
);
```

#### `$.field(...).contains`

To query documents where the field array contains a value, use the `contains` method:

```ts
await db.games.query(($) =>
  // Query games that has rpg tag
  $.field("tags").contains("rpg"),
);
```

The method only works with arrays.

#### `$.field(...).containsAny`

To query documents where the field array contains any of the values, use the `containsAny` method:

```ts
await db.games.query(($) =>
  // Query games that has rpg or action tag
  $.field("tags").containsAny(["rpg", "action"]),
);
```

The method only works with arrays.

#### `$.field(...).order`

To order the query by the field, use the `order` method:

```ts
await db.games.query(($) =>
  // Order games published between 2000 and 2010 by year
  $.field("year").order("desc", [$.startAt(2000), $.endAt(2010)]),
);
```

It accepts the optional direction (`"asc" | "desc"`) and optionally the range of values to order by. You can call the method without any arguments to order by the field in ascending order:

```ts
await db.games.query(($) =>
  // Order games by year in ascending order
  $.field("year").order(),
);
```

The field helpers that can be used to define the range are:

- [`$.startAt`](#startat) - start the range at a value
- [`$.startAfter`](#startafter) - start the range after a value
- [`$.endAt`](#endat) - end the range at a value
- [`$.endBefore`](#endbefore) - end the range before a value

### `$.limit`

To limit the number of documents returned by the query, use the `limit` method:

```ts
await db.users.query(($) =>
  // Query 10 users
  $.limit(10),
);
```

### `$.startAt`

To start the range at a value, use the `startAt` method:

```ts
await db.games.query(($) =>
  // Query games published 2000 or later
  $.field("year").order($.startAt(2000)),
);
```

### `$.startAfter`

To start the range after a value, use the `startAfter` method:

```ts
await db.games.query(($) =>
  // Query games published after 2019
  $.field("year").order($.startAfter(2019)),
);
```

### `$.endAt`

To end the range at a value, use the `endAt` method:

```ts
await db.games.query(($) =>
  // Query games published 2019 or earlier
  $.field("year").order($.endAt(2019)),
);
```

### `$.endBefore`

To end the range before a value, use the `endBefore` method:

```ts
await db.games.query(($) =>
  // Query games published before 2000
  $.field("year").order($.endBefore(2000)),
);
```

### `$.docId`

To use the document id in the query, use the `$.docId` method:

```ts
await db.users.query(($) => [
  // Query users after the last user id
  $.field($.docId()).order($.startAfter(lastUserId)),
  $.limit(25),
]);
```

It effectively allows you to [paginate the query](#pagination).

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
