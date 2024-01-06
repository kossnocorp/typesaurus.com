---
title: update
sidebar:
  order: 3
  badge: TODO
---

The method allows updating a document. It's available on [`Collection`](/classes/collection/#update), [`Ref`](/classes/ref/#update), and [`Doc`](/classes/doc/#update).

The method returns [`Ref`](/docs/classes/ref) instance:

```ts
const ref = await db.users.upset(userId, { name: "Alexander" });
//=> Ref<User>
```

Typesaurus accepts partial data. If the document doesn't exist, it will throw an error.

:::tip[Want to set if doesn't exists?]
As `update` throws an error if the document doesn't exist, if you want to update or set if the document doesn't exist, you can use [`upset`](/docs/api/upset) method that does just that.
:::

It accepts a function as the argument that allows you to use [the `$` helper](#-helper) object:

```ts
await db.users.update(userId, ($) => ({
  name: "Sasha",
  createdAt: $.serverDate(),
}));
```

## Deep field update

TODO

## Builder mode

TODO

## Variable model

TODO

## `$` helper

The argument function receives the `$` helper object as the first argument that provides write helpers.

`$` type is `TypesaurusUpdate.Helpers`.

### `$.serverDate`

To assign a server date to a field, use `$.serverDate`:

```ts
await db.users.update(userId, ($) => ({
  name: "Sasha",
  // Set createdAt to the server date
  createdAt: $.serverDate(),
}));
```

It will assign the date when Firestore saves the document.

→ [Read more about server dates](/type-safety/server-dates/).

### `$.remove`

### `$.increment`

### `$.arrayUnion`

### `$.arrayRemove`

### `$.field`

#### `$.field(...).set`

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
await db.users.set(userId, ($) => ({
  name: "Sasha",
  createdAt: new Date(),
}));
//=> The types of 'createdAt' are incompatible between these types.
//=>    Type 'Date' is missing the following properties from type 'ValueServerDate': type, kind

// OK!
await db.users.set(
  userId,
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
