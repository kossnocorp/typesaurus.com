---
title: transaction
sidebar:
  order: 1
---

The method allows to run a transaction on the database. It's available as an extension that you import separately:

```ts
import { transaction } from "typesaurus";

transaction(db)
  .read(($) => $.db.users.get(userId))
  .write(($) => {
    const user = $.result;
    if (!user) return;
    user.update({ rating: user.data.rating + 1 });
  });
```

The method accepts the database instance as the argument and returns a transaction builder that allows you to chain read and write operations.

## `read`

The `read` method on the object returned by `transaction` accepts a function that receives a `$` helper. In the function, you perform the necessary read operations:

```ts
transaction(db)
  .read(($) =>
    Promise.all([
      // Read user
      $.db.users.get(userId),
      // Read user's subscriptions
      $.db.subscriptions.get(userId),
    ]),
  )
  .write(($) => {
    // ...
  });
```

Whatever you return from the function will be resolved and available in the `write` function as `$.result`:

```ts
transaction(db)
  .read(($) =>
    Promise.all([$.db.users.get(userId), $.db.subscriptions.get(userId)]),
  )
  .write(($) => {
    // Access the result of read operation
    const [user, subscriptions] = $.result;
  });
```

### `$` helper

The argument function receives the `$` helper object as the first argument that provides write helpers.

`$` type is `TypesaurusTransaction.ReadHelpers`.

#### `$.db`

`$.db` is a database wrapper that enables you to perform read operations inside the transaction.

It repeats the database structure, including subcollections, but only allows reading documents by id, including subcollections:

```ts
transaction(db)
  .read(($) =>
    Promise.all([
      // Get a post
      $.db.posts.get(postId),
      // Get a comment
      $.db.posts(postId).comments.get(commentId),
    ]),
  )
  .write(($) => {
    // ...
  });
```

## `write`

The `read` method returns an object with the `write` method that accepts a function where you perform the necessary write operations. The function receives a `$` helper.

```ts
transaction(db)
  .read(($) => $.db.users.get(userId))
  .write(($) => {
    const user = $.result;
    // Check if user exists
    if (!user) return;
    // Update the user's rating
    user.update({ rating: user.data.rating + 1 });
  });
```

All write operations in the function are performed atomically after the `write` function returns. If, during the commit, one of the read documents gets changed, the transaction will be retried.

### `$` helper

The argument function receives the `$` helper object as the first argument that provides write helpers.

`$` type is `TypesaurusTransaction.WriteHelpers`.

#### `$.result`

`$.result` is the result of the read operation. Whatever you return from the `read` function will be available here:

```ts
transaction(db)
  .read(($) => $.db.users.get(userId))
  .write(($) => {
    const user = $.result;
    // null | WriteDoc<User>
  });
```

All documents in `$.result` get wrapped as `WriteDoc` with altered methods:

- [`set`](/api/writing/set/) - sets the document data
- [`update`](/api/writing/update/) - updates the document data
- [`upset`](/api/writing/upset/) - updates the document data if it exists or sets it if it doesn't
- [`remove`](/api/writing/remove/) - removes the document

#### `$.db`

`$.db` is a database wrapper that enables you to perform write operations inside the transaction.

It repeats the database structure, including subcollections, but only allows writing documents by their ids:

```ts
transaction(db)
  .read(($) => $.db.users.get(userId))
  .write(($) => {
    const user = $.result;
    if (!user) return;

    // Set comment id and feature it if user's rating is above 10
    $.db.posts(postId).comments.set(commentId, {
      text,
      featured: user.data.rating > 10,
    });
  });
```

The collections have the following altered methods:

- [`set`](/api/writing/set/) - sets a document data
- [`update`](/api/writing/update/) - updates a document data
- [`upset`](/api/writing/upset/) - updates a document data if it exists or sets it if it doesn't
- [`remove`](/api/writing/remove/) - removes a document

## Options

### `as`

You can tell Typesaurus that it's safe to use dates by passing the `as` option (`"server" | "client"`):

```ts
transaction(db, { as: "server" })
  .read(($) => $.db.users.get(userId))
  .write(($) => {
    const serverUser = $.result;
    serverUser && serverUser.data.createdAt;
    //=> Date
  });

transaction(db, { as: "client" })
  .read(($) => $.db.users.get(userId))
  .write(($) => {
    const serverUser = $.result;
    serverUser && serverUser.data.createdAt;
    //=> Date | null
  });
```

By default, Typesaurus uses the `"client"` option.

→ [Read more about server dates](/type-safety/server-dates/).
