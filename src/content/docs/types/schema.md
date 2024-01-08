---
title: Schema
sidebar:
  order: 1
---

The type represents your database structure and provides type shortcuts for all kinds of data. It's helpful to use it side by side with the database instance so that you can type your functions.

It's inferred from your database type with the help of [`Typesaurus.Schema`](/types/typesaurus/#schema).

```tsx
import { schema, Typesaurus } from "typesaurus";

const db = schema(($) => ({
  orders: $.collection<Order>(),
  books: $.collection<Book>(),
}));

// Infer schema type:
type Schema = Typesaurus.Schema<typeof db>;

interface Order {
  // Reference to the book id type
  bookId: Schema["books"]["Id"];
}

interface Book {
  title: string;
}

// Use in components:

interface Props {
  book: Schema["books"]["Doc"];
}

function Book({ book }: Props) {
  return <div>Book: {book.data.title}</div>;
}

// Use in functions:
function orderBook(bookId: Schema["books"]["Id"]) {
  return db.orders.add({ bookId });
}
```

The types are accessible through their name in the schema.

## Subcollections

To access subcollections, you can use `"sub"` property:

```ts
const db = schema(($) => ({
  posts: $.collection<Post>().sub({
    comments: $.collection<Comments>(),
  }),
}));

type Schema = Typesaurus.Schema<typeof db>;

// Get the type of the comment id:
type CommentId = Schema["posts"]["sub"]["comments"]["Id"];
```

## `Id`

The type represents the document id.

```ts
function addComment(postId: Schema["posts"]["Id"], text: string) {
  return db.posts(postId).comments.add({ text });
}
```

→ [See `Id` in `Typesaurus`](/types/typesaurus/#id).

## `Collection`

The type represents [the collection `Collection` instance](/classes/collection).

```ts
function addComment(
  comments: Schema["posts"]["sub"]["comments"],
  text: string,
) {
  return comments.add({ text });
}

addComment(db.posts(postId).comments, "Hello!");
```

## `Ref`

The type represents [the document `Ref` instance](/classes/ref).

```ts
function updateComment(
  comment: Schema["posts"]["sub"]["comments"]["Ref"],
  text: string,
) {
  return comment.update({ text });
}
```

## `Doc`

The type represents [the document `Doc` instance](/classes/doc).

```ts
function updateComment(
  comment: Schema["posts"]["sub"]["comments"]["Doc"],
  text: string,
) {
  return comment.update({ text });
}
```

## `Data`

The type represents the document data. It's what you get reading or creating a document via [collection's `doc`](/classes/collection/#doc).

```ts
interface Props {
  post: Schema["posts"]["Data"];
}

function Post({ post }: Props) {
  return <div>Post: {post.title}</div>;
}
```

## `Result`

The type represents the result of a reading operation, like [the `get` method](/api/reading/get). It can be the [`Doc`](/classes/doc) instance, `null` if the document is not found, or `undefined` if the operation is still in progress.

```ts
interface Props {
  post: Schema["posts"]["Result"];
}

function Post({ post }: Props) {
  if (post === null) return <div>Post not found</div>;
  if (post === undefined) return <div>Loading...</div>;
  return <div>Post: {post.title}</div>;
}
```

## `AssignArg`

The type represents the argument of an assign function. It can be used for all writing operations and expects the complete document data.

It unions [`AssignData`](#assigndata) and [`AssignGetter`](#assigngetter) types.

```ts
function createPost(data: Schema["posts"]["AssignArg"]) {
  return db.posts.add(data);
}

createPost(($) => ({
  title: "Hello!",
  publishedAt: $.serverDate(),
}));

createPost({ title: "Hello!" });
```

## `AssignData`

The type represents the data of an assign function. It can be used for all writing operations and expects the complete document data.

```ts
function createPost(data: Schema["posts"]["AssignData"]) {
  return db.posts.add(data);
}

createPost({ title: "Hello!" });
```

## `AssignGetter`

The type represents the getter of an assign function. It can be used for all writing operations and expects the complete document data.

```ts
function createPost(data: Schema["posts"]["AssignGetter"]) {
  return db.posts.add(data);
}

createPost(($) => ({
  title: "Hello!",
  publishedAt: $.serverDate(),
}));
```

## `WriteHelpers`

The type represents the write helpers of an assign function. It can be used for all writing operations.

```ts
type Data = (
  $: Schema["posts"]["WriteHelpers"],
) => Schema["posts"]["AssignData"];

function createPost(data: Data) {
  return db.posts.add(($) => data($));
}

createPost(($) => ({
  title: "Hello!",
  publishedAt: $.serverDate(),
}));
```

## `UpdateBuilder`

The type represents [the update builder object](/api/writing/update/#builder-mode).

```ts
function maybeUpdatePost(
  rating: number,
  builder: Schema["posts"]["UpdateBuilder"],
) {
  if (rating > -10) return;
  // If rating is less than -10, set the published field to false
  builder.field("published").set(false);
}
```

## `UpdateArg`

The type represents the argument of an update function.

It unions [`UpdateData`](#updatedata) and [`UpdateGetter`](#updategetter) types.

```ts
function updatePost(
  id: Schema["posts"]["Id"],
  data: Schema["posts"]["UpdateArg"],
) {
  return db.posts.update(id, data);
}
```

## `UpdateData`

The type represents the data of an update function.

```ts
function updatePost(
  id: Schema["posts"]["Id"],
  data: Schema["posts"]["UpdateData"],
) {
  return db.posts.update(id, data);
}
```

## `UpdateGetter`

The type represents the getter of an update function.

```ts
function updatePost(
  id: Schema["posts"]["Id"],
  data: Schema["posts"]["UpdateGetter"],
) {
  return db.posts.update(id, data);
}
```

## `UpdateHelpers`

The type represents the update helpers of an update function.

```ts
type Data = (
  $: Schema["posts"]["UpdateHelpers"],
) => Schema["posts"]["UpdateData"];

function updatePost(id: Schema["posts"]["Id"], data: Data) {
  return db.posts.update(id, ($) => data($));
}

updatePost(id, ($) => $.field("title").set("Hello!"));
```

## `QueryBuilder`

The type represents [the query builder object](/api/reading/query/#builder-mode).

```ts
function getPublishedPosts(builder: Schema["posts"]["QueryBuilder"]) {
  builder.field("published").eq(true);
  builder.limit(10);
}
```

## `QueryData`

The type represents what [the `query` method](/api/reading/query) expects you to return from the query function.

```ts
function publishedQuery(
  $: Schema["posts"]["QueryHelpers"],
): Schema["posts"]["QueryData"] {
  return $.field("published").eq(true);
}
```

## `QueryGetter`

The type represents the query function.

```ts
const publishedQuery: Schema["posts"]["QueryGetter"] = ($) =>
  $.field("published").eq(true);
```

## `QueryHelpers`

The type represents the query helpers of a query function.

```ts
type Data = (
  $: Schema["posts"]["QueryHelpers"],
) => Schema["posts"]["QueryData"];

function queryPosts(data: Data) {
  return db.posts.query(($) => data($));
}

queryPosts(($) => $.field("published").eq(true));
```

## `ServerDoc`

The type is a server version of [the `Doc` type](#doc) where server dates are always present, unlike the client version where they might be `null`.

→ [Read more about server dates](/type-safety/server-dates/)

## `ServerData`

The type is a server version of [the `Data` type](#data) where server dates are always present, unlike the client version where they might be `null`.

→ [Read more about server dates](/type-safety/server-dates/)

## `ServerResult`

The type is a server version of [the `Result` type](#result) where server dates are always present, unlike the client version where they might be `null`.

→ [Read more about server dates](/type-safety/server-dates/)

## `ServerAssignArg`

The type is a server version of [the `AssignArg` type](#assignarg) where server dates are always present, unlike the client version where they might be `null`.

→ [Read more about server dates](/type-safety/server-dates/)

## `ServerAssignData`

The type is a server version of [the `AssignData` type](#assigndata) where server dates are always present, unlike the client version where they might be `null`.

→ [Read more about server dates](/type-safety/server-dates/)

## `ServerAssignGetter`

The type is a server version of [the `AssignGetter` type](#assigngetter) where server dates are always present, unlike the client version where they might be `null`.

→ [Read more about server dates](/type-safety/server-dates/)

## `ServerUpdateBuilder`

The type is a server version of [the `UpdateBuilder` type](#updatebuilder) where server dates are always present, unlike the client version where they might be `null`.

→ [Read more about server dates](/type-safety/server-dates/)

## `ServerUpdateArg`

The type is a server version of [the `UpdateArg` type](#updatearg) where server dates are always present, unlike the client version where they might be `null`.

→ [Read more about server dates](/type-safety/server-dates/)

## `ServerUpdateData`

The type is a server version of [the `UpdateData` type](#updatedata) where server dates are always present, unlike the client version where they might be `null`.

→ [Read more about server dates](/type-safety/server-dates/)

## `ServerUpdateGetter`

The type is a server version of [the `UpdateGetter` type](#updategetter) where server dates are always present, unlike the client version where they might be `null`.

→ [Read more about server dates](/type-safety/server-dates/)

## `ServerUpdateHelpers`

The type is a server version of [the `UpdateHelpers` type](#updatehelpers) where server dates are always present, unlike the client version where they might be `null`.

→ [Read more about server dates](/type-safety/server-dates/)

## `Def`

The type represents the document definition. It's in many methods as a generic parameter.

```ts
function addPost<Def extends Schema["posts"]["Def"]>(
  collection: TypesaurusCore.Collection<Def>,
) {
  return collection.add({ title: "Hello!" });
}
```

:::caution[You probably don't need it!]
The type is for advanced use cases. If you're unsure if you need it, you most likely don't.
:::
