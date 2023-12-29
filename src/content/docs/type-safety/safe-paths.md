---
title: Safe paths
sidebar:
  order: 5
---

In this document, you'll learn about an essential concept of Typesaurus called safe paths. Safe paths are a way to prevent data inconsistencies in your database.

It's also a source of widespread type errors, so it's worth understanding how it works.

You're in the right place if you see `never` when trying to update a document.

## The problem

Besides preventing runtime errors, preserving data consistency is another big focus of Typesaurus.

One of the ways data can become inconsistent is through partial updates. While checking if the whole document is set correctly is a reasonably simple task, verifying if a single field update won't cause an inconsistency is challenging.

That's why Typesaurus incorporates safe path checks on updates that prevent field updates that would set your documents into an impossible state.

To understand the problem and how safe paths work, let's take a look at an example:

```ts
interface Organization {
  name: string;
  createdAt: Typesaurus.ServerDate;
  address?: {
    street: string;
    zipcode: string;
  };
}

await db.organization.update(
  organizationId,
  ($) => $.field("address", "street").set("Main street"),
  //             ^^^^^^^^^ address can be undefined
);
```

In this example, one could update the street, thus leaving the organization without `zipcode`. That's why this isn't allowed by Typesaurus.

If this code were to compile, it would cause an organization to look like this:

```json
{
  "name": "My organization",
  "createdAt": "2023-12-28T07:59:48.172Z",
  "address": {
    "street": "Main street"
  }
}
```

You can see that `zipcode` is missing, which is not allowed by the `Organization` type.

:::caution[Keep in mind!]
Safe paths check applies to any nesting level, so if you see `never` when trying to [`update`](/api/writing/update/) your documents, you're likely trying to update a field that is not allowed to be updated.
:::

## The solution

One way to address this problem is make all `address` fields optional:

```ts
interface Organization {
  name: string;
  createdAt: Typesaurus.ServerDate;
  address?: {
    street?: string;
    zipcode?: string;
  };
}
```

:::tip[Not all fields must be optional!]
In this example if you need to set `street` without `zipcode`, you can make only `zipcode` optional, and it will work too.
:::

Another solution is to update the whole `address` object at once:

```ts
await db.organization.update(organizationId, ($) =>
  $.field("address").set({
    street: "Main street",
    zipcode: "12345",
  }),
);
```

Sometimes, you'll have to fetch the document first, like in this example:

```ts
interface Report {
  update?: {
    text: string;
    createdAt: Date;
    updatedAt?: Date | null;
  };
}

// This fails:
await db.reports.update(reportId, ($) => [
  $.field("update", "text").set("Very important report"),
  //=>              ^^^^^^
  //=> Argument of type 'string' is not assignable to parameter of type 'never'.
  $.field("update", "createdAt").set(new Date()),
  //=>              ^^^^^^^^^^^
  //=> Argument of type 'string' is not assignable to parameter of type 'never'.
]);

//
const report = await db.reports.get(reportId);
report?.update(($) =>
  $.field("update").set({
    text: "Very important report",
    createdAt: report.data.update?.createdAt || new Date(),
    updatedAt: new Date(),
  }),
);
```

:::caution[It's worth it!]
It all might seem redundant, but that's the only to ensure data consistency, so the hurdle is well worth it.
:::

→ [Learn about designing models that are easy to update](/design/updatability/)
