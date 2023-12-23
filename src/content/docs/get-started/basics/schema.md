---
title: Defining schema
sidebar:
  order: 1
  badge: TODO
---

# Defining schema

## `schema`

You define schema importing [`schema`](/docs/api/schema) from [`typesaurus`]:

```ts
import { schema } from "typesaurus";

export const db = schema(($) => ({
  users: $.collection<User>(),
}));

interface User {
  name: string;
}
```

[Read more about `schema`](/docs/api/schema).

## `Typesaurus.Schema`

You'll find handy to use `Typesaurus.Schema` type to expose your database types:

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

// ...
```

[Read more about `Typesaurus.Schema`](/docs/types/schema)

## Subcollections

To define a subcollection, use `sub` method on the helper `$`:

```ts
import { schema } from "typesaurus";

const db = schema(($) => ({
  // Nest notes into users
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

To access a subcollection:

```ts
await db.users(userId).notes.add({ text: "Hello" });
```

## Renaming collection

If you want to use different path to access Firestore (e.g. to keep legacy naming), you can use `name` method:

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

[Read more about `name`](/docs/api/schema#collectionname).

---

[Reading data →](/docs/intro/reading)

[`typesaurus`]: https://www.npmjs.com/package/typesaurus
