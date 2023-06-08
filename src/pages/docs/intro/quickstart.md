---
layout: "../../../layouts/Docs.astro"
---

# Quickstart

Follow this guide to quickly start with Typesaurus in your project.

## Installation

To install Typesaurus, install [`typesaurus`], [`firebase`] and [`firebase-admin`]:

```bash
npm install --save typesaurus firebase firebase-admin
```

Note that [`firebase`] and [`firebase-admin`] aren't listed as peer dependencies so you could use only one of them when needed without polluting `npm install` logs.

## Using

### Defining schema

To define the database schema, import `schema` from [`typesaurus`]:

```ts
import { schema } from "typesaurus";

// The database object, i.e.:
//   await db.get(userId)
export const db = schema(($) => ({
  users: $.collection<User>().sub({
    notes: $.collection<Note>(),
  }),
  orders: $.collection<Order>(),
  books: $.collection<Book>(),
}));

// The database schema type, i.e.:
//   function getUser(id: Schema["users"]["Id"]): Schema["users"]["Doc"]
export type Schema = Typesaurus.Schema<typeof db>;

interface User {
  name: string;
}

interface Note {
  text: string;
}

interface Order {
  userId: Schema["users"]["Id"];
  bookId: Schema["books"]["Id"];
}

interface Book {
  title: string;
}
```

[Read more about defining schema](/docs/intro/schema)

### Using the db

After defining the schema, use the returned object to use the database:

#### Reading data

Quick overview of available reading operations:

```ts
import { db } from "./db";

// Single
const user = await db.users.get(userId);

// Might be null
if (user) {
  user.data.name;
  //=> "Sasha"
  user.ref.id;
  //=> "ykodM19iSxnI9CG0nq3g"
}

// From subcollection
await db.users(userId).notes.get(noteId);

// All
await db.users.all();

// Query
await db.users.query(($) => $.field("name").equal("Sasha"));

// Subscription
db.users
  .query(($) => $.field("name").equal("Sasha"))
  .on((users) => {
    users;
    //=> [{ data: { name: "Sasha" }, ... }, { data: { name: "Sasha" }, ... }]
  })
  .catch((error) => {
    // Error, i.e. no permission
  });

// Many
await db.users.many([userAId, userBId]);
```

[Read more about reading data](/docs/intro/reading)

#### Writing data

Quick overview of available writing operations:

```ts
import { db } from "./db";

// Add
const ref = await db.users.add({ name: "Alexander" });

// Set to id
await db.users.set(userId, { name: "Sasha" });

// Use via ref
await ref.set({ name: "Sasha" });

// In subcollection
await db.users(ref.id).notes.add({ text: "Hello" });

// Update
await ref.update({ name: "Sasha" });

// Update if exists or set
await db.users.upset(userId, { name: "Sasha" });

// Remove
await ref.remove();
```

[Read more about writing data](/docs/intro/writing)

---

[Defining schema →](/docs/intro/schema)

[`typesaurus`]: https://www.npmjs.com/package/typesaurus
[`firebase-admin`]: https://www.npmjs.com/package/firebase-admin
[`firebase`]: https://www.npmjs.com/package/firebase
