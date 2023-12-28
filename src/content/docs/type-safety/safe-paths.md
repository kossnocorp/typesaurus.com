---
title: Safe paths
sidebar:
  order: 5
  badge: TODO
---

Besides preventing runtime errors, preserving data consistency is another big focus of Typesaurus.

One of the ways data can become inconsistent is through partial updates. While checking if the whole document is set correctly is a reasonably simple task, verifying if a single field update won't cause an inconsistency is challenging.

That's why Typesaurus incorporates safe path checks on updates that prevent field updates that would get your documents into an impossible state.

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

await firestore.organization.update(organizationId, ($) => [
  $.field("address", "street").set("Main street"),
  //      ^^^^^^^^^ address can be undefined
]);
```

In this example one could update the street, thus leaving the organization without zipcode. That's why this isn't allowed by Typesaurus
