---
title: update
sidebar:
  order: 3
---

The method allows updating a document. It's available on [`Collection`](/classes/collection/#update), [`Ref`](/classes/ref/#update), and [`Doc`](/classes/doc/#update).

The method returns [`Ref`](/docs/classes/ref) instance:

```ts
const ref = await db.users.update(userId, { name: "Alexander" });
//=> Ref<User>
```

Typesaurus accepts partial data. If the document doesn't exist, it will throw an error.

:::tip[Want to set if doesn't exist?]
As `update` throws an error if the document doesn't exist, if you want to update or set if the document doesn't exist, you can use the [`upset`](/docs/api/upset) method that does just that.
:::

It accepts a function as the argument that allows you to use [the `$` helper](#-helper) object:

```ts
await db.users.update(userId, ($) => ({
  name: "Sasha",
  updatedAt: $.serverDate(),
}));
```

## Deep fields update

You can update individual fields, including nested ones, using [`$.field`](#field) helper:

```ts
await db.users.update(userId, ($) => [
  $.field("name").set("Sasha"),
  $.field("address", "city").set("San Jose"),
]);
```

It allows you to update multiple disconnected fields at once.

When updating nested fields, make sure you use ["safe paths"](/type-safety/safe-paths/) to prevent data inconsistency.

→ [Read more about safe paths](/type-safety/safe-paths/).

## Builder mode

The `update` also allows you to use the builder mode, where you accumulate the update operations and then call `run` to execute them:

```ts
// Start building the update
const $ = db.users.update.build(userId);

$.field("updatedAt").set($.serverDate());
// ...Do something in between, including async operations
$.field("address", "city").set("San Jose");

// Run the update
await $.run();
// Ref<User>
```

Just like the function argument, the builder has the same set of helpers:

- [`$.field`](#field)
- [`$.serverDate`](#serverdate)
- [`$.remove`](#remove)
- [`$.increment`](#increment)
- [`$.arrayUnion`](#arrayunion)
- [`$.arrayRemove`](#arrayremove)

## Variable model

When updating a variable model, you can only update using the complete data or partial shared data:

```ts
const db = schema(($) => ({
  accounts: $.collection<[GitHubAccount, MicrosoftAccount, GoogleAccount]>(),
}));

interface GitHubAccount {
  type: "github";
  active: boolean;
  userId: string;
}

interface MicrosoftAccount {
  type: "microsoft";
  active: boolean;
  accountId: string;
}

interface GoogleAccount {
  type: "google";
  active: boolean;
  email: string;
}

// OK! We're updating a shared field.
await db.accounts.update(accountId, {
  active: true,
});

// OK! We're updating with complete data.
await db.accounts.update(accountId, {
  type: "google",
  active: true,
  email: "example@example.com",
});

// Nope!
await db.accounts.update(accountId, {
  // Email is only available for GoogleAccount
  email: "example@example.com",
  //=> Object literal may only specify known properties, and 'email' does not exist in type 'Arg<SharedShape3<GitHubAccount, MicrosoftAccount, GoogleAccount>, DocProps & { environment: RuntimeEnvironment; }>'.ts(2353)
});
```

You can also narrow the model before updating. Then, the partial update will be available:

```ts
const account = await db.accounts.get(accountId);

if (account) {
  const googleAccount = account.narrow(
    (data) => data.type === "google" && data,
  );

  await googleAccount?.update({
    email: "example@example.com",
  });
}
```

→ [Read more about variable models](/type-safety/variable/).

## `$` helper

The argument function receives the `$` helper object as the first argument that provides write helpers.

`$` type is `TypesaurusUpdate.Helpers`.

The function can return a falsy value to skip the update:

```ts
const name = undefined;
// Will not update the document as the name is undefined
await db.users.update(userId, ($) => name && { name });
//=> undefined
```

A skipped update call will return `undefined`.

### `$.field`

The helper allows to update individual fields, including nested ones:

```ts
interface User {
  name: string;
  address: {
    city: string;
    country: string;
  };
}

await db.users.update(userId, ($) => [
  $.field("name").set("Sasha"),
  $.field("address", "city").set("San Jose"),
]);
```

You can return an array of helpers to update multiple fields at once. You also can return a single field:

```ts
await db.users.update(userId, ($) =>
  $.field("address", "city").set("San Jose"),
);
```

If you return a falsy value, the update will be skipped:

```ts
const city = undefined;

await db.users.update(
  userId,
  ($) => city && $.field("address", "city").set(city),
);
//=> undefined
```

#### `$.field(...).set`

The `set` function allows setting a value to a field. It always accepts the field type or corresponding system value produced by a help like `$.serverDate()`:

```ts
await db.users.update(userId, ($) => $.field("name").set("Sasha"));
```

### `$.serverDate`

To assign a server date to a field, use `$.serverDate`:

```ts
await db.users.update(userId, ($) => ({
  name: "Sasha",
  // Set updatedAt to the server date
  updatedAt: $.serverDate(),
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

await db.users.update(userId, ($) => ({
  // Remove avatar field
  avatar: $.remove(),
}));
```

Removing a field that is not optional will show you a type error.

### `$.increment`

To increment a number field, use `$.increment`:

```ts
await db.users.update(userId, ($) => ({
  // Increment the kudos field by 1
  kudos: $.increment(1),
}));
```

The method is only available for the number fields.

### `$.arrayUnion`

To add an item to an array field, use `$.arrayUnion`:

```ts
await db.users.update(userId, ($) => ({
  // Add "cool" tag to the tags array
  tags: $.arrayUnion("cool"),
}));
```

The method is only available for the array fields.

### `$.arrayRemove`

To remove an item from an array field, use `$.arrayRemove`:

```ts
await db.users.update(userId, ($) => ({
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
  updatedAt: Typesaurus.ServerDate;
}

// Can't assign Date to ServerDate
await db.users.update(userId, ($) => ({
  name: "Sasha",
  updatedAt: new Date(),
}));
//=> The types of 'updatedAt' are incompatible between these types.
//=>    Type 'Date' is missing the following properties from type 'ValueServerDate': type, kind

// OK!
await db.users.update(
  userId,
  ($) => ({
    name: "Sasha",
    // OK! We're on the server
    updatedAt: new Date(),
  }),
  { as: "server" },
);
```

By default, Typesaurus uses the `"client"` option.

The builder mode also accepts the `as` option:

```ts
const $ = db.users.update.build(userId, { as: "server" });

$.field("updatedAt").set(new Date());

await $.run();
```

→ [Read more about server dates](/type-safety/server-dates/).
