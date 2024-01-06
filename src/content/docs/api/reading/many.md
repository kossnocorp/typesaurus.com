---
title: many
sidebar:
  order: 4
---

To get documents from a collection by their ids, use the `many` method on [`Collection`](/classes/collection/#many).

The method returns an array of [`Doc`](/classes/doc) or `null` if particular document doesn't exist:

```ts
await db.users.many([userId1, userId2]);
//=> Array<null | Doc<User>>
```

:::tip[It's sugar!]
The method doesn't exist in Firestore, it's a sugar on top of `get` method.
:::

## Subscription

Instead of awaiting the promise returned from `many`, you can call `on` on it to subscribe to documents updates:

```ts
db.users.many([userId1, userId2]).on(([user1, user2]) => {
  user1;
  //=> null | Doc<User>
});
```

To stop listening to the updates, call the `off` function returned from the method:

```ts
const off = db.users.many([userId1, userId2]).on((users) => {
  // ...
});

// Unsubscribe after 5 seconds
setTimeout(off, 5000);
```

To catch errors, use `catch` after calling `on`:

```ts
db.users
  .many([userId1, userId2])
  .on((users) => {
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
const [serverUser] = await db.users.many([userId1, userId2], { as: "server" });
serverUser && serverUser.data.createdAt;
//=> Date

const [clientUser] = await db.users.many([userId1, userId2], { as: "client" });
clientUser && clientUser.data.createdAt;
//=> Date | null
```

By default, Typesaurus uses the `"client"` option.

→ [Read more about server dates](/type-safety/server-dates/).
