---
title: Doc
sidebar:
  order: 3
---

The `Doc` class represents a document in the database. It provides methods to read and write the document.

Docs get returned from reading operations or [created by a collection](/classes/collection/#doc):

```ts
import { schema } from "typesaurus";

const db = schema({
  users: collection<User>("users"),
  posts: collection<Post>("posts"),
});

const doc = await db.users.get(db.users.id("00sHm46UWKObv2W7XK9e"));
//=> Doc<User>

doc.ref.id;
//=> "00sHm46UWKObv2W7XK9e" (Id<"users">)

await doc.ref.update({ name: "Alexander" });
```

## `ref`

The property contains the references to the document:

```ts
doc.ref;
//=> Ref<User>
```

→ [Read more about the `Ref` class](/classes/ref/)

## `data`

The property contains the document data:

```ts
doc.data;
//=> User
```

## `get`

The method allows to get the document:

```ts
await doc.get();
//=> Doc<User>
```

→ [Read more about the `get` method](/api/reading/get/)

## `set`

The method allows to set the document:

```ts
await doc.set({ name: "Sasha" });
```

→ [Read more about the `set` method](/api/writing/set/)

## `update`

The method allows to update the document:

```ts
await doc.update({ name: "Alexander" });
```

→ [Read more about the `update` method](/api/writing/update/)

## `upset`

The method allows to update the document if it exists or set it if it doesn't:

```ts
await doc.upset({ name: "Alexander" });
```

→ [Read more about the `upset` method](/api/writing/upset/)

## `remove`

The method allows to remove the document:

```ts
await doc.remove();
```

→ [Read more about the `remove` method](/api/writing/remove/)

## `narrow`

The method narrows the [variable model](/type-safety/variable/) doc type:

```ts
const ghAccount = account.narrow<GitHubAccount>(
  (data) => data.type === "github" && data,
);
//=> Doc<GitHubAccount> | undefined
```

It checks the data structure on the runtime and asserts the type.

→ [Read more about variable models](/type-safety/variable/)

→ [Read more about the `narrow` method](/api/misc/narrow/)

## `as`

The method resolves [`Typesaurus.SharedDoc`](/types/typesaurus/#shareddoc) if the model extends the given type. Otherwise, it resolves `unknown` preventing the usage of incompatible models:

```ts
rename(doc.as<NameFields>());
```

It allows sharing functionality across the refs and docs in a type-safe way.

→ [Read more about sharing functionality](/type-safety/sharing/)

→ [Read more about the `as` method](/api/misc/as/)
