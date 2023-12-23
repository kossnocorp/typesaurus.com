---
layout: "../../../layouts/Docs.astro"
---

# `all`

To get all documents in a collection, use `all` method on [`Collection`](/docs/classes/collection).

> When working on a large database, consider [paginating via `query`](/docs/api/query#paginate) to avoid hitting Firestore connections limit.

```ts
await db.users.all();
// [{...}, {...}]
```

The method returns [`Doc[]`](/docs/classes/doc).

## Subscription

Instead of awaiting the promise returned from `all`, you can call `on` on it, to subscribe to the document updates:

```ts
db.users.all().on((allUsers) => {
  // ...
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
    error;
    // Don't have permission!
  });
```

## Options

You can tell Typesaurus that it's safe to use dates by passing `as` option:

```ts
const user = await db.users.all({ as: "server" });

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
