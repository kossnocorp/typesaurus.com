---
title: get
sidebar:
  order: 1
  badge: TODO
---

# `get`

To get the latest version of a document, use `get` method on [`Collection`](/docs/classes/collection), [`Ref`](/docs/classes/ref) and [`Doc`](/docs/classes/doc):

```ts
// Collection
await db.users.get(userId);

// Ref
await userRef.get();

// Doc
await userDoc.get();
```

The method returns [`Doc`](/docs/classes/doc) instance or `null`:

```ts
const userRef = await db.users.get();
await userRef?.update({ name: "Alexander" });
```

## Subscription

Instead of awaiting the promise returned from `get`, you can call `on` on it, to subscribe to the document updates:

```ts
db.users.get(userId).on((updatedUser) => {
  // ...
});
```

To catch errors, use `catch` after calling `on`:

```ts
db.users
  .get(userId)
  .on((updatedUser) => {
    // ...
  })
  .catch((error) => {
    error;
    // Don't have permission!
  });
```

## Options

You can tell Typesaurus that it's safe to use dates by passing `as` option:

```ts
const user = await db.users.get(userId, { as: "server" });

user?.data.createdAt;
//=> Date, without { as: "server" } would be Date | undefined
```

[Read more about server dates](/docs/advanced/serverdates).

---

See other reading methods:

- [get](/docs/api/get)
- [all](/docs/api/all)
- [query](/docs/api/query)
- [many](/docs/api/many)
