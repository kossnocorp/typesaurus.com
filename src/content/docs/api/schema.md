---
title: schema
---

To create a database instance, use `schema` method.

It accepts `($: TypesaurusCore.SchemaHelpers) => TypesaurusCore.Schema` as the argument, the function where you define the database structure:

```ts
import { schema } from "typesaurus";

const db = schema(($) => ({
  users: $.collection<User>().sub({
    notes: $.collection<Note>(),
  }),
  books: $.collection<Book>(),
}));

interface User {
  name: string;
}

interface Note {
  text: string;
}

interface Books {
  title: string;
}
```

What you return from the function, defines the database structure.

## `$`

`$` is the helpers object that exposes the `schema` API.

The type is `TypesaurusCore.SchemaHelpers`.

### `$.collection`

The function creates a collection with the given model. The key you assign the collection to, Typesaurus will use as the collection path:

```ts
import { schema } from "typesaurus";

const db = schema(($) => ({
  // users - the path
  // User - the model
  users: $.collection<User>(),
}));

interface Account {
  name: string;
}
```

[You can customize the path, see `collection.name`](#collectionname)

#### `$.collection` generics

##### `Model`

You always pass the model interface as the first generic param:

```ts
import { schema } from "typesaurus";

const db = schema(($) => ({
  accounts: $.collection<Account>(),
}));

interface Account {
  externalId: string;
  type: string;
}
```

You can also use a variable model where document can be only one of the given types:

```ts
import { schema } from "typesaurus";

const db = schema(($) => ({
  // Variable model
  accounts: $.collection<[GitHubAccount, MicrosoftAccount, GoogleAccount]>(),
}));

interface GitHubAccount {
  type: "github";
  userId: string;
}

interface MicrosoftAccount {
  type: "microsoft";
  accountId: string;
}

interface GoogleAccount {
  type: "google";
  email: string;
}
```

> It helps to simplify and secure operations on mixed document types.

[Read more about variable models](/docs/advanced/variable).

##### `CustomId`

The second generic param allows to set id type to the collectio, allowing you accessing i.e. `credentials` collection using `accountId` and vice versa.

```ts
import { schema, Typesaurus } from "typesaurus";

const db = schema(($) => ({
  accounts: $.collection<Account>(),
  credentials: $.collection<AccountCredentials, Typesaurus.Id<"accounts">>(),
  users: $.User(),
}));

await db.users.update(accountId, { userId: "123" });
//                    ^^^^^^^^^ wrong id

await db.credentials.update(accountId, { key: null });
```

You can also set a `string`, enum or union as the id type, that allows you to specify set of allowed ids:

```ts
import { schema, Typesaurus } from "typesaurus";

const db = schema(($) => ({
  stats: $.collection<Stats, "global" | "sg" | "us">(),
}));

await db.stats.update("sg", ($) => ({ users: $.increment(1) }));
```

## `collection`

### `collection.type`

Always `"collection"`.

### `collection.sub`

### `collection.name`
