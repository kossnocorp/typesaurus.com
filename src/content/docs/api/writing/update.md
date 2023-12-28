---
title: update
sidebar:
  order: 3
  badge: TODO
---

# `update`

To update a given document, use `update` method on [`Collection`](/docs/classes/collection), [`Ref`](/docs/classes/ref) and [`Doc`](/docs/classes/doc):

```ts
await db.users.update(userId, { name: "Sasha" });

await userRef.update({ name: "Sasha" });

await userDoc.update({ name: "Sasha" });
```

> The method updates the document with partial model payload, so it expects the document to exist otherwise it will throw an error.
>
> Use [`upset`](/docs/api/upset) if you want to update or set.

The method also accepts a function argument that allows you to use helpers when setting data:

```ts
await db.users.update(($) => ({
  name: "Sasha",
  updatedAt: $.serverDate(),
}));
```

[See Helpers list](#helpers-list)

The method returns [`Ref`](/docs/classes/ref) instance:

```ts
const userRef = await db.users.update({ name: "Sasha" });
await userRef.update({ name: "Alexander" });
```

## Write helpers

### `$.serverDate`

- `$.serverDate` - set current server date to the field. [Read more about server dates](https://firebase.google.com/docs/firestore/manage-data/add-data#server_timestamp).

## Updating path

When updating nested fields, or

> It's is crucial that the path can be safety updated without causing data incosistency

## Builder mode

---

See other writing methods:

- [add](/docs/api/add)
- [set](/docs/api/set)
- [update](/docs/api/update)
- [upset](/docs/api/upset)
- [remove](/docs/api/remove)
