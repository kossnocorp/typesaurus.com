---
layout: "../../../layouts/Docs.astro"
---

# `set`

To set a given document, use `set` method on [`Collection`](/docs/classes/collection), [`Ref`](/docs/classes/ref) and [`Doc`](/docs/classes/doc):

```ts
await db.users.set(userId, { name: "Sasha" });

await userRef.set({ name: "Sasha" });

await userDoc.set({ name: "Sasha" });
```

> The method overwrites the document data entirely and just like [`add`](/docs/api/add) expects complete model payload.

The method also accepts `($: TypesaurusCore.WriteHelpers<Model>) => TypesaurusCore.WriteData<Model, Props>` as the argument, the function that allows you to use helpers when setting data:

```ts
await db.users.set(($) => ({
  name: "Sasha",
  createdAt: $.serverDate(),
}));
```

The method returns [Ref](/docs/classes/ref) instance:

```ts
const userRef = await db.users.set({ name: "Sasha" });
await userRef.update({ name: "Alexander" });
```

---

See other writing methods:

- [add](/docs/api/add)
- [set](/docs/api/set)
- [update](/docs/api/update)
- [upset](/docs/api/upset)
- [remove](/docs/api/remove)
