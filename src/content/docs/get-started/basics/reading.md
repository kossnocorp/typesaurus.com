---
title: Reading data
sidebar:
  order: 2
---

Several methods allow reading documents:

- [`get`](#get) - get a single document by id
- [`all`](#all) - get all documents in a collection
- [`query`](#query) - query documents by fields
- [`many`](#many) - get documents by their ids

## `get`

To get a single document from a collection:

```ts
const user = await db.users.get(userId);

// user is null when not found
user?.data.name;
//=> "Sasha"
```

→ [Read more about `get`](/api/reading/get/)

## `all`

To get all documents from a collection:

```ts
const users = await db.users.all();

users[0]?.data.name;
//=> "Sasha"
```

## `query`

To query documents from a collection:

```ts
const users = await db.users.query(($) => $.field("name").eq("Alexander"));

users[0]?.data.name;
//=> "Alexander"
```

→ [Read more about `query`](/api/reading/query/)

## `many`

To get documents by their ids:

```ts
const users = await db.users.many([userId1, userId2, userId3]);

users.length;
//=> 3
users[0]?.data.name;
//=> "Tati"
```

→ [Read more about `query`](/api/reading/query/)

## Realtime

You can subscribe to updates calling `.on` on any of the reading methods:

```ts
db.users
  .query(($) => $.field("name").eq("Alexander"))
  .on((users) => {
    users[0]?.data.name;
    //=> "Alexander"
  });
```

→ [Read more about realtime](/advanced/core/realtime/)
