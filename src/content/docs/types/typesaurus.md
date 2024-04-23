---
title: Typesaurus
sidebar:
  order: 2
---

The namespace provides a number of types that help to work with Typesaurus.

## `Schema`

The type represents your database structure and provides type shortcuts for all kinds of data:

```ts
import { schema, Typesaurus } from "typesaurus";

const db = schema(($) => ({
  orders: $.collection<Order>(),
  books: $.collection<Book>(),
}));

// Infer schema type:
type Schema = Typesaurus.Schema<typeof db>;

// Use in a function:
function orderBook(bookId: Schema["books"]["Id"]) {
  return db.orders.add({ bookId });
}
```

→ [Read more about the `Schema` type](/types/schema/)

## `ServerDate`

Defines a server date. Use it to define a field that will be set to the server date on creation:

```ts
import { schema, Typesaurus } from "typesaurus";

interface Post {
  text: string;
  createdAt: Typesaurus.ServerDate;
  updatedAt?: Typesaurus.ServerDate;
}

const db = schema(($) => ({
  posts: $.collection<Posts>(),
}));
```

→ [Read more about the server dates](/type-safety/server-dates/)

## `NormalizeServerDates`

Deeply normalizes server dates in a given type. It replaces ServerDate with regular Date. It's useful when reusing interfaces in a non-Typesaurus environment or when you need to store it in an array (where server dates are not allowed).

```ts
interface Timeline {
  // Server dates can't be used in arrays:
  updates: Typesaurus.NormalizeServerDates<Update>[];
}

interface Update {
  text: string;
  createdAt: Typesaurus.ServerDate;
  updatedAt?: Typesaurus.ServerDate;
}
```

→ [Read more about the server dates](/type-safety/server-dates/)

## `Nullify`

Deeply adds null to all undefined values. It's helpful in wrapping your types when you expect data from Firestore, where undefined values turn into nulls.

```ts
interface User {
  name: string;
  email?: string | undefined;
}

function sendEmail(user: User) {
  // ...
}

function sendEmailNullified(user: Typesaurus.Nullify<User>) {
  // ...
}

// Without Nullify it would show a type error.
const user = await db.users.get(userId);
if (user) {
  // Type error!
  sendEmail(user.data);
  //=> Type 'null' is not assignable to type 'string | undefined'

  // Ok!
  sendEmailNullified(user.data);
}
```

## `NarrowDoc`

Narrows doc type. If your doc has a variable model, the type will help you narrow down the doc type to a specific data type.

```ts
function sendEmail(
  doc: Typesaurus.NarrowDoc<Schema["accounts"]["Doc"], GoogleAccount>,
  email: string,
) {
  // ...
}
```

## `SharedRef`

The shared ref type. Unlike regular ref, the shared ref lacks methods which type-safety depends on knowing the full type of the model: `set`, `upset`, and `as`.

The ref's `collection` is also limited.

```ts
export interface NameFields {
  firstName: string;
  lastName: string;
}

function rename(entity: Typesaurus.SharedRef<NameFields>, name: string) {
  const [firstName = "", lastName = ""] = name.split(" ");
  return entity.update({ firstName, lastName });
}

rename(userRef.as<NameFields>());
```

→ [Read more about sharing functionality](/type-safety/sharing/)

→ [Read more about the `as` method](/api/misc/as/)

## `SharedDoc`

The shared doc type. Unlike regular doc, the shared doc lacks methods which type-safety depends on knowing the full type of the model: `set`, `upset`, and `as`.

The doc's `ref` is also limited.

```ts
export interface NameFields {
  firstName: string;
  lastName: string;
}

function rename(entity: Typesaurus.SharedDoc<NameFields>, name: string) {
  const [firstName = "", lastName = ""] = name.split(" ");
  return entity.update({ firstName, lastName });
}

rename(userDoc.as<NameFields>());
```

→ [Read more about sharing functionality](/type-safety/sharing/)

→ [Read more about the `as` method](/api/misc/as/)

## `SharedEntity`

The shared ref or doc type. Unlike regular entity type, the shared entity lacks methods which type-safety depends on knowing the full type of the model: `set`, `upset`, and `as`.

```ts
export interface NameFields {
  firstName: string;
  lastName: string;
}

function rename(entity: Typesaurus.SharedEntity<NameFields>, name: string) {
  const [firstName = "", lastName = ""] = name.split(" ");
  return entity.update({ firstName, lastName });
}

// Accepts both refs and docs:
rename(userRef.as<NameFields>());
rename(userDoc.as<NameFields>());
```

→ [Read more about sharing functionality](/type-safety/sharing/)

→ [Read more about the `as` method](/api/misc/as/)

## `SharedCollection`

The shared collection type. Unlike regular collection, the shared collection lacks methods which type-safety depends on knowing the full type of the model: `add`, `set`, `upset`, and `update`.

→ [Read more about sharing functionality](/type-safety/sharing/)

→ [Read more about the `as` method](/api/misc/as/)

## `SharedGroup`

**⚠️ Available starting with v10.7.0**

The shared collection group type. Unlike regular groups, the shared group lacks methods which type-safety depends on knowing the full type of the model: `add`, `set`, `upset`, and `update`.

→ [Read more about sharing functionality](/type-safety/sharing/)

→ [Read more about the `as` method](/api/misc/as/)

## `Id`

The type allows to define typed id strings. It accepts the collection path as the first generic argument:

```ts
import { schema, Typesaurus } from "typesaurus";

const db = schema(($) => ({
  organizations: $.collection<Organization>(),
  subscriptions: $.collection<Subscription, Typesaurus.Id<"organizations">>(),
}));
```

:::tip[Use `Schema` where possible]
It's recommended to use [the inferred `Schema` type](/types/schema/#id) instead of `Id` type where possible. `Id` type is useful when you need to define a type for a collection that is not defined in the schema.
:::

→ [Learn more about typed ids](/type-safety/typed-ids/).

→ [See `Id` in `Schema`](/types/schema/#id).

## `Collection`

**⚠️ Deprecated starting with v10.7.0 in favor [`SharedCollection`](#sharedcollection)**

The type allows defining collection types:

```ts
// Define collection type:
type UserCollection = Typesaurus.Collection<User, "users">;

// Customize collection path (billing):
type SubscriptionCollection = Typesaurus.Collection<
  Subscription,
  "users",
  "billing"
>;

// Set the wider variable model:
type AccountCollection = Typesaurus.Collection<
  GoogleAccount,
  "accounts",
  "accounts",
  [GitHubAccount, GoogleAccount]
>;
```

→ [See `Collection` in `Schema`](/types/schema/#collection).

## `Ref`

**⚠️ Deprecated starting with v10.7.0 in favor [`SharedRef`](#sharedref)**

The type allows defining references:

```ts
// Define reference type:
type UserRef = Typesaurus.Ref<User, "users">;

// Customize collection path (billing):
type SubscriptionRef = Typesaurus.Ref<Subscription, "users", "billing">;

// Set the wider variable model:
type AccountRef = Typesaurus.Ref<
  GoogleAccount,
  "accounts",
  "accounts",
  [GitHubAccount, GoogleAccount]
>;
```

→ [See `Ref` in `Schema`](/types/schema/#ref).

## `Doc`

**⚠️ Deprecated starting with v10.7.0 in favor [`SharedDoc`](#shareddoc)**

The type represents the document type:

```ts
// Define document type:
type UserDoc = Typesaurus.Doc<User, "users">;

// Customize collection path (billing):
type SubscriptionDoc = Typesaurus.Doc<Subscription, "users", "billing">;

// Set the wider variable model:
type AccountDoc = Typesaurus.Doc<
  GoogleAccount,
  "accounts",
  "accounts",
  [GitHubAccount, GoogleAccount]
>;
```

→ [See `Doc` in `Schema`](/types/schema/#doc).

## `Data`

The type represents the document data type:

```ts
type UserData = Typesaurus.Data<User, "users">;
```

→ [See `Data` in `Schema`](/types/schema/#data).

## `Def`

The type represents the document definition. It's in many methods as a generic parameter.

```ts
// Define def type:
type UserDef = Typesaurus.Def<User, "users">;

// Customize collection path (billing):
type SubscriptionDef = Typesaurus.Def<Subscription, "users", "billing">;

// Set the wider variable model:
type AccountDef = Typesaurus.Def<
  GoogleAccount,
  "accounts",
  "accounts",
  [GitHubAccount, GoogleAccount]
>;
```

→ [See `Def` in `Schema`](/types/schema/#def).
