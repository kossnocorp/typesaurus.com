---
title: add
sidebar:
  order: 1
  badge: TODO
---

To add a document with random id to a collection, use `add` method on [`Collection`](/docs/classes/collection).

```ts
await db.users.add({ name: "Sasha" });
```

The method also accepts `($: TypesaurusCore.WriteHelpers<Model>) => TypesaurusCore.WriteData<Model, Props>` as the argument, the function that allows you to use helpers when setting data:

```ts
await db.users.add(($) => ({
  name: "Sasha",
  createdAt: $.serverDate(),
}));
```

The method returns [Ref](/docs/classes/ref) instance:

```ts
const userRef = await db.users.add({ name: "Sasha" });
await userRef.update({ name: "Alexander" });
```

## Write helpers

### `$.serverDate`

---

See other writing methods:

- [add](/docs/api/add)
- [set](/docs/api/set)
- [update](/docs/api/update)
- [upset](/docs/api/upset)
- [remove](/docs/api/remove)
