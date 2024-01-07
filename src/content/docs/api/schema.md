---
title: schema
---

The `schema` creates a database instance from the given schema.

It accepts a function as the argument, where you define the database structure:

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

## `$` helper

The argument function receives `$` helper object as the first argument that provides the `schema` API.

`$` type is `TypesaurusCore.SchemaHelpers`.

### `$.collection`

The `$.collection` function creates a collection with the given model. The key you assign the collection to, Typesaurus will use as the collection path:

```ts
import { schema } from "typesaurus";

const db = schema(($) => ({
  // `users` is the the path, `User` is the model
  users: $.collection<User>(),
}));
```

→ [You can customize the path, see `collection.name`](#collectionname)

#### Generics

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

It defines the shape of the documents in the collection.

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

It helps to simplify and secure operations on mixed document types.

→ [Read more about variable models](/type-safety/variable/)

##### `CustomId`

The second optional generic param allows to set id type to the collection, allowing accessing i.e., `credentials` collection using `accountId` and vice versa.

```ts
import { schema, Typesaurus } from "typesaurus";

const db = schema(($) => ({
  accounts: $.collection<Account>(),
  credentials: $.collection<AccountCredentials, Typesaurus.Id<"accounts">>(),
  users: $.User(),
}));

await db.credentials.update(accountId, { key: null });
```

→ [Read more about shared ids](/type-safety/typed-ids/#shared-ids)

---

You can also set a `string`, enum or union as the id type, that allows you to specify set of allowed ids:

```ts
import { schema, Typesaurus } from "typesaurus";

const db = schema(($) => ({
  stats: $.collection<Stats, "global" | "sg" | "us">(),
}));

await db.stats.update("sg", ($) => ({ users: $.increment(1) }));
```

→ [Read more about static ids](/type-safety/typed-ids/#static-ids)

### `$.collection(...).sub`

The `sub` function creates a subcollection:

```ts
import { schema } from "typesaurus";

const db = schema(($) => ({
  posts: $.collection<Post>().sub({
    comments: $.collection<Comment>(),
  }),
}));
```

The subcollection path will be `posts/{postId}/comments` and the id will be [`Id<"posts/comments">`](/types/typesaurus/#id).

You can access a subcollection calling the partent collection with an id:

```ts
// Fetch all post comments
await db.posts(postId).comments.all();
```

The subcollections can be nested as well:

```ts
// Fetch all post comment ratings
await db.posts(postId).comments(commentId).ratings.all();
```

When you need to access a subcollection, i.e. to convert string to its id, you can use [`sub`](/classes/collection/#sub) property:

```ts
await db.posts.sub.comments.sub.ratings.id("rating-id");
```

### `$.collection(...).name`

By default the collection has the same name as the key you assign it to. But you can customize it using `name` property:

```ts
const db = schema(($) => ({
  subscriptions: $.collection<Subscription>().name("billing"),
}));
```

It will allow you to access collection via the alias `subscription` while keeping the original name in the database:

```ts
// Will fetch "billing/{subscriptionId}" document
await db.subscriptions.get(subscriptionId);
```

The name also affects the collection id type, so for our example it will be [`Id<"billing">`](/types/typesaurus/#id).
