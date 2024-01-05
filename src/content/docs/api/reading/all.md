---
title: all
sidebar:
  order: 2
  badge: TODO
---

To get all documents in a collection, use the `all` method on [`Collection`](/classes/collection/#all).

The method returns an array of [`Doc`](/classes/doc) instances:

```ts
await db.users.all();
//=> Doc<User>[]
```

:::tip[Paginate with query]
When working on a large database, consider [paginating via `query`](/api/reading/query/#pagination) to avoid hitting the Firestore connections limit.
:::

## Subscription

Instead of awaiting the promise returned from `all`, you can call `on` on it to subscribe to the document updates:

```ts
db.users.all().on((users) => {
  // Doc<User>[]
});
```

To catch errors, use `catch` after calling `on`:

```ts
db.users
  .all()
  .on((allUsers) => {
    // ...
  })
  .catch((error) => {
    //=> PERMISSION_DENIED: Missing or insufficient permissions
  });
```

## Options

### `as`

You can tell Typesaurus that it's safe to use dates by passing the `as` option (`"server" | "client"`):

```ts
const [serverUser] = await db.users.all({ as: "server" });
serverUser && serverUser.data.createdAt;
//=> Date

const [clientUser] = await db.users.all({ as: "client" });
clientUser && clientUser.data.createdAt;
//=> Date | null
```

By default, Typesaurus uses `"client"` option.

→ [Read more about server dates](/type-safety/server-dates/).
