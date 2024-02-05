---
title: Collection
sidebar:
  order: 1
---

The `Collection` class represents a collection in the database. It provides methods to read and write documents, access subcollections, and construct [ids](#id), [refs](#ref), and [docs](#doc).

You access collections through the database instance you create with [the `schema` function](/api/schema):

```ts
import { schema } from "typesaurus";

const db = schema({
  users: collection<User>("users"),
  posts: collection<Post>("posts"),
});

db.users;
//=> Collection<User>
```

## Subcollections

You can access subcollections by calling the collection with an id:

```ts
await db.posts(postId).comments.add({ text: "Hello!" });
```

## `get`

The method allows to get a document by its id:

```ts
await db.users.get(userId);
//=> null | Doc<User>
```

→ [Read more about the `get` method](/api/reading/get/)

## `all`

The method allows to get all documents in the collection:

```ts
await db.users.all();
//=> Doc<User>[]
```

→ [Read more about the `all` method](/api/reading/all/)

## `query`

The method allows to query documents in the collection:

```ts
await db.users.query(($) => $.field("age").gte(21));
//=> Doc<User>[]
```

→ [Read more about the `query` method](/api/reading/query/)

## `many`

The method allows to get many documents by their ids:

```ts
await db.users.many([userId1, userId2]);
//=> Array<null | Doc<User>>
```

→ [Read more about the `many` method](/api/reading/many/)

## `count`

The method allows counting documents in the collection:

```ts
await db.users.count();
//=> 420
```

→ [Read more about the `count` method](/api/reading/count/)

## `sum`

:::tip[Change log]
The method first appeared in `v10.1.0` and requires at least `firebase-admin@^12.0.0` and `firebase@^10.5.0`
:::

The method enables summing the collection field values:

```ts
await db.users.sum("age");
//=> 42069
```

→ [Read more about the `sum` method](/api/reading/sum/)

## `average`

:::tip[Change log]
The method first appeared in `v10.1.0` and requires at least `firebase-admin@^12.0.0` and `firebase@^10.5.0`
:::

The method allows to calculate the average of collection field values:

```ts
await db.users.average("age");
//=> 42
```

→ [Read more about the `sum` method](/api/reading/sum/)

## `add`

The method allows to add a new document to the collection:

```ts
await db.users.add({ name: "Sasha" });
//=> Ref<User>
```

→ [Read more about the `add` method](/api/writing/add/)

## `set`

The method allows to set a document data:

```ts
await db.users.set(userId, { name: "Sasha" });
```

→ [Read more about the `set` method](/api/writing/set/)

## `update`

The method allows to update a document data:

```ts
await db.users.update(userId, { name: "Sasha" });
```

→ [Read more about the `update` method](/api/writing/update/)

## `upset`

The method allows to update a document data if it exists or set it if it doesn't:

```ts
await db.users.upset(userId, { name: "Sasha" });
```

→ [Read more about the `upset` method](/api/writing/upset/)

## `remove`

The method allows to remove a document:

```ts
await db.users.remove(userId);
```

→ [Read more about the `remove` method](/api/writing/remove/)

## `sub`

The property allows access to nested subcollections:

```ts
const commentId = await db.posts.sub.comments.id(idStr);
```

Typically you access the [`id`](#id) method on a collection, but in the case with subcollections, it's inconvenient to create it first to get an id. That's where `sub` comes in handy:

```ts
// 👎 too verbose, need to use random id:
const badCommentId = await db
  .posts(db.posts.id("does not matter"))
  .comments.id();

// 👍 short and sweet:
const newCommentId = await db.posts.sub.comments.id();

// You can also cast:
const commentId = db.posts.sub.comments.id("t2nNOgoQY8a5vcvWl1yAz26Ue7k2");
```

## `id`

The `id` method allows generating a random id or cast `string` to the collection id type.

→ [Learn more about typed ids](/type-safety/typed-ids/).

### Generating id

When called without arguments, the function generates a random document id using Firebase and returns `Promise<string>`.

```ts
await db.comments.id();
//=> "t2nNOgoQY8a5vcvWl1yAz26Ue7k2" (Id<"comments">)
```

:::tip[Why id is async?]
You might have noticed that when generating an id, the method returns a promise.

Like any other method that depends on the Firebase SDKs, it returns a promise so that the Web SDK package can be loaded asynchronously, save a few kilobytes, and reduce time to [LCP](https://web.dev/lcp/).
:::

### Casting `string`

If you have an untyped id string, you can cast it to the id type using the function:

```ts
const commentId = db.comments.id("t2nNOgoQY8a5vcvWl1yAz26Ue7k2");
```

## `ref`

The method allows to create a [`Ref`](/classes/ref/) instance:

```ts
db.comments.ref(db.comments.id("42"));
// Ref<Comment>
```

→ [Read more about the `Ref` class](/classes/ref/)

## `doc`

The method allows to create a [`Doc`](/classes/doc/) instance:

```ts
db.comments.doc(db.comments.id("42"), {
  text: "Hello!",
});
// Doc<Comment>
```

→ [Read more about the `Doc` class](/classes/doc/)
