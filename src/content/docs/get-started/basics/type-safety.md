---
title: Type safety
sidebar:
  order: 4
  badge: TODO
---

# Type safety

## Recommended config

While Typesaurus will work with any TypeScript config, it's recommended to use the following:

```json
{
  "compilerOptions": {
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "exactOptionalPropertyTypes": true
  }
}
```

:::caution[Keep in mind!]
Enabling those options in existing projects might cause a lot of type errors. However, starting using them as soon as possible is recommended to prevent runtime errors and make your code more robust.

To enable them gradually, you can use [`@ts-expect-error`](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-3-9.html#-ts-expect-error-comments) comment.
:::

:::danger[Prevent runtime errors!]
The [`exactOptionalPropertyTypes`] option is not widely used but is extremely important as it prevents corrupting the data consistency by preventing setting `undefined` to required fields.

Read more about it down below.
:::

### [`exactOptionalPropertyTypes`]

One recommended option [`exactOptionalPropertyTypes`] is not well known, especially to TypeScript beginners, because it's not included in [`strict`]. However, it's crucial and will cause runtime errors where you don't expect them.

This option makes such a code invalid:

```ts
interface User {
  firstName: string;
  lastName?: string;
}

const user: User = {
  firstName: "Sasha",
  lastName: undefined,
};
```

It will show you a type error:

```
Type '{ firstName: string; lastName: undefined; }' is not assignable to type 'User' with 'exactOptionalPropertyTypes: true'. Consider adding 'undefined' to the types of the target's properties.
  Types of property 'lastName' are incompatible.
    Type 'undefined' is not assignable to type 'string'.(2375)
```

With this option, to allow setting undefined to an optional field, you have to specify it explicitly:

```ts
interface User {
  firstName: string;
  lastName?: string | undefined;
}
```

At first glance, it might seem like a nuisance, but consider the following example:

```ts
function updateUser(data: Partial<User>) {
  Object.assign(user, data);
}

updateUser({ firstName: undefined });
```

The code above would be valid without the option, but it would set the user into an impossible state and ultimately cause runtime errors.

:::tip[Bite the bullet!]
While inconvenient at first, the [`exactOptionalPropertyTypes`] option is worth the effort and will teach you write better TypeScript. So bite the bullet and enable it!
:::

## Schema types

---

## `undefined` & `null`

---

## Subcollections

---

## Typed ids

Often databases have similarily sounding entities, e.g., user and account. To prevent developers from mixing those and introducing stealthy bugs, Typesaurus makes all ids typed.

By default a collection have an id corresponding to its path.

```ts
import { schema } from 'typesaurus'

const db = schema(($) => {
  users: $.collection<User>(),
  accounts: $.collection<Account>().sub({
    reports: $.collection<Report>()
  })
})
```

In the given example, the user document id is `Id<'users'>`, and the account reports subcollection document id is `Id<'users/reports'>`.

Mixing types or trying to use a `string` will cause TypeScript to complain about it:

```ts
db.users.update(accountId, { name: "Sasha" });
// Argument of type 'Id<"accounts">' is not assignable to parameter of type 'Id<"users">'.
```

### Creating id

If you need to convert a string to an id or create a new random id, you can use a collection method `id`:

```ts
// Convert string to an id:
const userId = db.users.id("sasha");

// Create a new random id:
const newUserId = await db.users.id();
```

[Read more about the `id` method](/docs/api/id).

### Id type

You can access any document id type, using the inferred schema types ([read more about schema types](#schema-types)):

```ts
function removeAccount(accountId: Schema["accounts"]["Id"]) {
  return db.accounts.remove(accountId);
}

function publishReport(
  accountId: Schema["accounts"]["Id"],
  reportId: Schema["accounts"]["sub"]["reports"]["Id"],
) {
  return db.accounts(accountId).reports.update(reportId, { published: true });
}
```

Essentially `Id` is an opaque `string` with the path mixed to it so that TypeScript can distinguish those. However, the type system will complain if you try to use it as a string, so you'll need to cast it using `.toString` first:

```ts
function logId(id: string) {
  console.log(`The id is ${id}`);
}

logId(accountId.toString());
```

### Shared ids

If your collections share ids, i.e. you use the organization id to store subscription document, you can define custom id and make collections share id with help of [`Typesaurus.Id`](/docs/api/type/id):

```ts
import { schema, Typesaurus } from 'typesaurus'

const db = schema(($) => {
  organizations: $.collection<Organization>(),
  subscriptions: $.collection<Subscription, Typesaurus.Id<'organizations'>>()
})
```

Now, you'll be able to use the organization id to operate on subscription document:

```ts
function removeOrganization(organizationId: Schema["organizations"]["Id"]) {
  return Promise.all([
    db.organizations.remove(organizationId),
    db.subscriptions.remove(organizationId),
  ]);
}
```

- [Read more about `Id` type](/docs/api/type/id).
- [When to use shared ids](/docs/guides/designing-schema#sharing-ids).

### Static ids

Some collections have a finite number of documents, i.e., global application stats. For those cases, you can define custom string ids:

```ts
import { schema } from "typesaurus";

const db = schema(($) => {
  regionStats: $.collection<RegionStats, "us" | "europe" | "asia">();
});

db.regionStats.update("us", ($) => {
  online: $.increment(1);
});
```

[When to use static ids](/docs/guides/designing-schema#single-document-collection).

---

## Server dates

You can define server dates by using the following syntax:

````ts
interface Organization {
  name: string;
  createdAt: Typesaurus.ServerDate;
}

...and when creating a doc

```ts
await db.organizations.add(($) => ({
  name: "Typesaurus",
  createdAt: $.serverDate(),
}));
````

---

## Safe paths

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

[`strict`]: https://www.typescriptlang.org/tsconfig#strict
[`exactOptionalPropertyTypes`]: https://www.typescriptlang.org/tsconfig#exactOptionalPropertyTypes
