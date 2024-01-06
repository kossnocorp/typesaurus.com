---
title: upset
sidebar:
  order: 4
---

The method allows setting or updating a document. It's available on [`Collection`](/classes/collection/#update), [`Ref`](/classes/ref/#upset), and [`Doc`](/classes/doc/#upset).

The method returns [`Ref`](/docs/classes/ref) instance:

```ts
const ref = await db.users.upset(userId, {
  name: "Alexander",
  location: "Singapore",
});
//=> Ref<User>
```

Typesaurus accepts complete data. If the document doesn't exist, it will set it. Otherwise, it will merge with the existing data:

```ts
interface User {
  name: string;
  location: string;
  avatar?: string;
}

await db.users.set(userId, {
  name: "Sasha",
  location: "Singapore",
  avatar: "https://example.com/avatar.png",
});

const ref = await db.users.upset(userId, {
  name: "Alexander",
  location: "USA",
});

const user = await ref.get();

user?.data;
//=> {
//=>   name: "Alexander",
//=>   location: "USA",
//=>   avatar: "https://example.com/avatar.png",
//=> }
```

It accepts a function as the argument that allows you to use [the `$` helper](#-helper) object:

```ts
await db.users.upset(userId, ($) => ({
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
await db.users.upset(userId, ($) => ({
  name: "Sasha",
  // Set createdAt to the server date
  createdAt: $.serverDate(),
}));
```

It will assign the date when Firestore saves the document.

→ [Read more about server dates](/type-safety/server-dates/).

### `$.remove`

To remove a field, use `$.remove`:

```ts
interface User {
  name: string;
  avatar?: string;
}

await db.users.upset(userId, ($) => ({
  name: "Sasha",
  // Remove avatar field
  avatar: $.remove(),
}));
```

Removing a field that is not optional will show you a type error.

### `$.increment`

To increment a number field, use `$.increment`:

```ts
await db.users.upset(userId, ($) => ({
  name: "Sasha",
  // Increment the kudos field by 1
  kudos: $.increment(1),
}));
```

The method is only available for the number fields.

### `$.arrayUnion`

To add an item to an array field, use `$.arrayUnion`:

```ts
await db.users.upset(userId, ($) => ({
  name: "Sasha",
  // Add "cool" tag to the tags array
  tags: $.arrayUnion("cool"),
}));
```

The method is only available for the array fields.

### `$.arrayRemove`

To remove an item from an array field, use `$.arrayRemove`:

```ts
await db.users.upset(userId, ($) => ({
  name: "Sasha",
  // Remove the "cool" tag from the tags array
  tags: $.arrayRemove("cool"),
}));
```

The method is only available for the array fields.

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
await db.users.upset(userId, ($) => ({
  name: "Sasha",
  createdAt: new Date(),
}));
//=> The types of 'createdAt' are incompatible between these types.
//=>    Type 'Date' is missing the following properties from type 'ValueServerDate': type, kind

// OK!
await db.users.upset(
  userId,
  ($) => ({
    name: "Sasha",
    // OK! We're on the server
    createdAt: new Date(),
  }),
  { as: "server" },
);
```

By default, Typesaurus uses the `"client"` option.

→ [Read more about server dates](/type-safety/server-dates/).
