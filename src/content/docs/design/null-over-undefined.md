---
title: null over undefined
sidebar:
  order: 1
---

Unless you have existing code relying on `undefined`, can't have [`exactOptionalPropertyTypes` enabled](/type-safety/tsconfig/#exactoptionalpropertytypes), or want to use types that you can't control or don't want to change, it's better to use `null` when designing your schema.

:::tip[Still have to use it?]
For more details about and how to use `undefined`, read [the type safety guide "undefined & null"](/type-safety/undefined-null/)
:::

The reason for that Firestore, just like JSON and many other programming languages, doesn't have the `undefined` type. So when you try to write `undefined` to Firestore, it will throw an error unless you set an option to ignore it, making it a source of runtime errors.

However, when you set `undefined` with Typesaurus, it turns into `null`:

```ts
await db.users.set(userId, { lastName: undefined });

const user = await db.users.get(userId);
user.lastName;
//=> null
```

So make your life easier and use `null` instead of `undefined` in your schema unless you **have to** use it:

```ts
interface User {
  firstName: string;
  lastName?: string | null;
}
```

Note that even though `lastName` is optional, Typesaurus recognizes it (as long as you [have `exactOptionalPropertyTypes` enabled](/type-safety/tsconfig/#exactoptionalpropertytypes)) and will force you to set `null`, `string`, or `$.remove` helper:

```ts
db.users.upset(userId, {
  firstName: "Sasha",
  lastName: undefined,
});
//=> Types of property 'lastName' are incompatible.
//=>    Type 'undefined' is not assignable to type 'string | ValueRemove | null'
```
