---
title: Typesaurus
sidebar:
  order: 2
  badge: TODO
---

The namespaces provides a number of types that help to work with Typesaurus.

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
