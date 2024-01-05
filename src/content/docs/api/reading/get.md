---
title: get
sidebar:
  order: 1
---

The method allows one to read a document by its id. It's available on [`Collection`](/classes/collection/#get), [`Ref`](/classes/ref/#get) and [`Doc`](/classes/doc/#get):

The method returns [`Doc`](/classes/doc) instance or `null` if the document doesn't exist:

```ts
const userRef = await db.users.get(userId);
//=> null | Doc<User>

// Update the user
await userRef?.update({ name: "Alexander" });
```

## Subscription

Instead of awaiting the promise returned from `get`, you can call `on` on it to subscribe to the document updates:

```ts
db.users.get(userId).on((user) => {
  //=> null | Doc<User>
});
```

To catch errors, use `catch` after calling `on`:

```ts
db.users
  .get(userId)
  .on((user) => {
    // ...
  })
  .catch((error) => {
    //=> PERMISSION_DENIED: Missing or insufficient permissions
  });
```

→ [Read more about subscribing to real-time updates](/advanced/realtime/)

## Options

### `as`

You can tell Typesaurus that it's safe to use dates by passing the `as` option (`"server" | "client"`):

```ts
const serverUser = await db.users.get(userId, { as: "server" });
serverUser && serverUser.data.createdAt;
//=> Date

const clientUser = await db.users.get(userId, { as: "client" });
clientUser && clientUser.data.createdAt;
//=> Date | null
```

By default, Typesaurus uses `"client"` option.

→ [Read more about server dates](/type-safety/server-dates/).
