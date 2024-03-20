---
title: Ref
sidebar:
  order: 2
---

The `Ref` class represents a reference to a document in the database. It provides methods to read and write the document.

Refs get returned from writing operations, it can be accessed through doc or [created by a collection](/classes/collection/#ref):

```ts
import { schema } from "typesaurus";

const db = schema({
  users: collection<User>("users"),
  posts: collection<Post>("posts"),
});

const ref = await db.users.add({ name: "Sasha" });
//=> Ref<User>

ref.id;
//=> "00sHm46UWKObv2W7XK9e" (Id<"users">)

await ref.update({ name: "Alexander" });
```

## `id`

The property contains the document id:

```ts
ref.id;
//=> "00sHm46UWKObv2W7XK9e" (Id<"users">)
```

## `get`

The method allows to get the document:

```ts
await ref.get();
//=> null | Doc<User>
```

→ [Read more about the `get` method](/api/reading/get/)

## `set`

The method allows to set the document:

```ts
await ref.set({ name: "Sasha" });
```

→ [Read more about the `set` method](/api/writing/set/)

## `update`

The method allows to update the document:

```ts
await ref.update({ name: "Alexander" });
```

→ [Read more about the `update` method](/api/writing/update/)

## `upset`

The method allows to update the document if it exists or set it if it doesn't:

```ts
await ref.upset({ name: "Alexander" });
```

→ [Read more about the `upset` method](/api/writing/upset/)

## `remove`

The method allows to remove the document:

```ts
await ref.remove();
```

→ [Read more about the `remove` method](/api/writing/remove/)

## `as`

The method resolves [`Typesaurus.SharedRef`](/types/typesaurus/#sharedref) if the model extends the given type. Otherwise, it resolves `unknown` preventing the usage of incompatible models:

```ts
rename(ref.as<NameFields>());
```

It allows sharing functionality across the refs and docs in a type-safe way.

→ [Read more about sharing functionality](/type-safety/sharing/)

→ [Read more about the `as` method](/api/misc/as/)
