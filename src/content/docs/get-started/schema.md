---
title: Defining schema
sidebar:
  order: 1
---

In this document, you'll learn how to define your database schema with Typesaurus.

If you're looking for more advanced schema designing tips, check out the [Designing schema guide](/type-safety/designing/).

## `schema`

You define database structure by importing [`schema`](/api/schema) from [`typesaurus`] and describing each collection using [`$` helper](/api/schema#-helper):

```ts
import { schema } from "typesaurus";

export const db = schema(($) => ({
  users: $.collection<User>(),
}));

interface User {
  name: string;
}
```

→ [Read more about `schema`](/api/schema)

## `Typesaurus.Schema`

You'll find it handy to use `Typesaurus.Schema` type to expose your defined schema types:

```ts
import { schema, Typesaurus } from "typesaurus";

export const db = schema(($) => ({
  users: $.collection<User>(),
}));

export type Schema = Typesaurus.Schema<typeof db>;

// Use in function definitions:
function addUser(user: Schema["users"]["Model"]): Schema["users"]["Result"];

// Or in types:
interface UserProps {
  user: Schema["users"]["Doc"];
}
```

→ [Read more about `Typesaurus.Schema`](/types/schema/)

## Subcollections

To define a subcollection, use `sub` method on the helper `$`:

```ts
import { schema } from "typesaurus";

const db = schema(($) => ({
  // Nest notes into users:
  users: $.collection<User>().sub({
    notes: $.collection<Note>(),
  }),
}));

interface User {
  name: string;
}

interface Note {
  text: string;
}
```

→ [Read more about defining subcollections](/api/schema#collectionsub)

---

To access a subcollection:

```ts
// Add a note:
await db.users(userId).notes.add({ text: "Hello" });

// Create a typed id (you don't need to know userId for that):
const id = await db.users.sub.notes.id();
```

→ [Read more about accessing subcollections](/classes/collection/#sub)

## Renaming collection

If you want to use a different path to access Firestore (e.g. to keep legacy naming), you can use `name` method:

```ts
import { schema } from "typesaurus";

const db = schema(($) => ({
  subscriptions: $.collection<Subscription>().name("billing"),
}));
```

To Firestore it will be known as `billing`, so documents will have paths like `billing/4cQfqEdukBNhNJOaz5tzIFoxwCG2`.

To your app, you'll use the alias subscriptions:

```ts
await db.subscriptions.add({ accountId });
```

→ [Read more about renaming collections](/api/schema#collectionname).

---

[`typesaurus`]: https://www.npmjs.com/package/typesaurus
