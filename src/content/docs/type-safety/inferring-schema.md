---
title: Inferring schema
sidebar:
  order: 2
---

In this guide, you'll learn how to infer schema and use it in your codebase. It will help you access all your database types via a single type.

→ [For the full list of inferred types, see the `Schema` reference](/types/schema/).

## Basic example

Here's a basic example of how to infer schema:

```ts
import { schema, Typesaurus } from "typesaurus";

export const db = schema(($) => ({
  users: $.collection<User>(),
}));

export type Schema = Typesaurus.Schema<typeof db>;

// Use in function definitions:
function addUser(user: Schema["users"]["Model"]): Schema["users"]["Result"];

// Or in types:
interface UserProps {
  user: Schema["users"]["Doc"];
}
```

`Schema` resolves all possible types you might need to use in your codebase. To learn about them all, see the [`Schema` references](/types/schema/).

:::tip[Try this!]
Define your database and infer schema in a single file. It will simplify your database usage.
:::

## Most popular types

Here's an example with the most popular types that you might need to use:

- `Schema["collection"]["Id"]`: document id.
- `Schema["collection"]["Ref"]`: document reference - contains `id` and `collection` properties.
- `Schema["collection"]["Doc"]`: document - contains `ref` and `data` properties.
- `Schema["collection"]["Data"]`: document data.
- `Schema["collection"]["Model"]`: document model.
- `Schema["collection"]["Result"]`: document read result - `Doc`, `null` if not found or `undefined` if not fetched yet.

Besides those, you'll find many other types that will help you reuse code that works with your database, including types that the operations accept, the server version of type, and much more.

If you need a type, there's a big chance `Schema` has it. If not, [open an issue](https://github.com/kossnocorp/typesaurus/issues/new), and we'll add it.

→ [See the complete list of the inferred types](/types/schema/).

## The problem

To understand why such an exotic approach is needed (_why not export individual types as others do?_), let's look at the problem it solves.

Typesaurus performs many type manipulations behind the scenes to make the API pleasant. However, it makes the original types used to define schema incompatible:

```ts
interface User {
  firstName: string;
  lastName?: string | undefined;
}

const db = schema(($) => ({
  users: $.collection<User>(),
}));

function hello(user: User) {
  console.log(`Hello, ${user.firstName} ${user.lastName}!`);
}

const user = await db.users.get(userId);
user && hello(user.data);
//=> Type 'null' is not assignable to type 'string | undefined'.
```

In this example, `User` has `lastName` property union with [`undefined`, which turns into `null` after writing to Firestore](/type-safety/undefined-null/).

To mitigate this problem, you can use the data type:

```ts
export type Schema = Typesaurus.Schema<typeof db>;

function hello(user: Schema["users"]["Data"]) {
  console.log(`Hello, ${user.firstName} ${user.lastName}!`);
}

const user = await db.users.get(userId);
user && hello(user.data);
```

Although this is an extreme example, and you most likely won't need to do anything, as [you should avoid undefineds anyway](/type-safety/designing/#null-over-undefined), it illustrates the problem very well.
