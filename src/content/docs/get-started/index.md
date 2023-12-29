---
title: Quickstart
description: Get started with Typesaurus
sidebar:
  order: 0
---

Follow this guide to quickly start with Typesaurus in your project.

:::tip[Before you start!]
I highly recommend reading or skimming the whole **Getting started** and **Type safety** sections. However, feel free to jump right into code and get back when you encounter a problem or want to learn more.
:::

## Installation

To start, install [`typesaurus`], [`firebase`] and [`firebase-admin`]:

```bash
npm install --save typesaurus firebase firebase-admin
```

:::note
Note that Typesaurus requires the [`firebase`] package to work in the web environment and [`firebase-admin`] to work in Node.js. These packages aren't listed as dependencies, so they won't install automatically with the Typesaurus package.
:::

## Configuration

Use recommended TypeScript config to make the most of Typesaurus:

```json
{
  "compilerOptions": {
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "exactOptionalPropertyTypes": true
  }
}
```

→ [Read more recommended config](/type-safety/tsconfig/)

## Using

### Defining schema

To define the database schema, import [`schema`] from [`typesaurus`]:

```ts
import { schema } from "typesaurus";

// Generate the db object from given schem that you can use to access
// Firestore, i.e.:
//   await db.get(userId)
export const db = schema(($) => ({
  users: $.collection<User>().sub({
    notes: $.collection<Note>(),
  }),
  orders: $.collection<Order>(),
  books: $.collection<Book>(),
}));

// Infer schema type helper with shortcuts to types in your database:
//   function getUser(id: Schema["users"]["Id"]): Schema["users"]["Result"]
export type Schema = Typesaurus.Schema<typeof db>;

// Your model types:

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

→ [Read more about defining schema](/get-started/schema/)

→ [Learn designing schema best practices](/design/best-practices/)

### Using the db

After defining the schema, use the returned object to work with the database:

#### Reading data

Quick overview of available reading operations:

```ts
import { db } from "./db";

// Get a single document:
const user = await db.users.get(userId);

// The document might be null:
if (user) {
  user.data.name;
  //=> "Sasha"
  user.ref.id;
  //=> "ykodM19iSxnI9CG0nq3g"

  // Get the latest document state:
  await user.get();
}

// Read from a subcollection:
await db.users(userId).notes.get(noteId);

// Get all documents in a collection
await db.users.all();

// Query a collection:
await db.users.query(($) => $.field("name").eq("Sasha"));

// Use real-time subscriptions:
db.users
  .query(($) => $.field("name").eq("Sasha"))
  .on((users) => {
    users;
    //=> [{ data: { name: "Sasha" }, ... }, { data: { name: "Sasha" }, ... }]
  })
  .catch((error) => {
    error;
    //=> Error, i.e. no permission
  });

// Get many documents by ids:
await db.users.many([userAId, userBId]);
```

→ [Read more about reading data](/get-started/reading/)

#### Writing data

Quick overview of available writing operations:

```ts
import { db } from "./db";

// Add a document:
const ref = await db.users.add({ name: "Alexander" });

// Set document using an id:
await db.users.set(userId, { name: "Sasha" });

// References, just like documents provide operation methods:
await ref.set({ name: "Sasha" });

// Add to a subcollection:
await db.users(ref.id).notes.add({ text: "Hello" });

// Update a document:
await ref.update({ name: "Sasha" });

// Set or update a document:
await db.users.upset(userId, { name: "Sasha" });

// Remove a document:
await ref.remove();
```

→ [Read more about writing data](/get-started/writing/)

[`typesaurus`]: https://www.npmjs.com/package/typesaurus
[`firebase-admin`]: https://www.npmjs.com/package/firebase-admin
[`firebase`]: https://www.npmjs.com/package/firebase
[`schema`]: /api/schema
