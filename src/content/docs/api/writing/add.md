---
title: add
sidebar:
  order: 1
---

The method allows one to add a document to a collection. It's available on [`Collection`](/docs/classes/collection).

The method returns [`Ref`](/docs/classes/ref) instance:

```ts
const ref = await db.users.add({ name: "Sasha" });
//=> Ref<User>

// The method generates random id:
ref.id;
//=> "E0YNA7wUDA2Nc5WGjJdz" (Id<"users">)
```

Typesaurus expects you to pass complete data.

It accepts a function as the argument that allows you to use [the `$` helper](#-helper) object:

```ts
await db.users.add(($) => ({
  name: "Sasha",
  createdAt: $.serverDate(),
}));
```

## `$` helper

The argument function receives the `$` helper object as the first argument that provides write helpers.

`$` type is `TypesaurusCore.WriteHelpers`.

### `$.serverDate`

To assign a server date to a field, use `$.serverDate`:

```ts
await db.users.add(($) => ({
  name: "Sasha",
  // Set createdAt to the server date
  createdAt: $.serverDate(),
}));
```

It will assign the date when Firestore saves the document.

→ [Read more about server dates](/type-safety/server-dates/).

## Options

### `as`

You can tell Typesaurus that it's safe to set dates to server dates by passing the `as` option (`"server" | "client"`):

```ts
import { Typesaurus } from "typesaurus";

interface User {
  name: string;
  createdAt: Typesaurus.ServerDate;
}

// Can't assign Date to ServerDate
await db.users.add(($) => ({
  name: "Sasha",
  createdAt: new Date(),
}));
//=> The types of 'createdAt' are incompatible between these types.
//=>    Type 'Date' is missing the following properties from type 'ValueServerDate': type, kind

// OK!
await db.users.add(
  ($) => ({
    name: "Sasha",
    // OK! We're on server
    createdAt: new Date(),
  }),
  { as: "server" },
);
```

By default, Typesaurus uses the `"client"` option.

→ [Read more about server dates](/type-safety/server-dates/).
