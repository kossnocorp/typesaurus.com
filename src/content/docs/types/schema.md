---
title: Schema
sidebar:
  order: 1
  badge: TODO
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

## Advanced

The following types are used internally in Typesaurus. You probably don't need to use them directly, but they're there for advanced use cases.

### `Def`

The type represents the document definition. It's in many methods as a generic parameter.

```ts
function addPost<Def extends Schema["posts"]["Def"]>(
  collection: TypesaurusCore.Collection<Def>,
) {
  return collection.add({ title: "Hello!" });
}
```

### `Model`

The type represents the document model shape. It differs from the interface you use to define the collection as it produces an intersected shape for variable models:

```ts
const db = schema(($) => ({
  posts: $.collection<[EmailAccount, SocialAccount]>(),
}));

interface EmailAccount {
  type: "email";
  email: string;
}

interface SocialAccount {
  type: "social";
  provider: string;
  id: string;
}

type Account = Schema["posts"]["Model"];

function doSomething(account: Account) {
  account.type;
  //=> "email" | "social"

  account.email;
  //=> string | undefined

  account.provider;
  //=> string | undefined
}
```
