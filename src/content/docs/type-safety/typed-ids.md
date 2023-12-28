---
title: Typed ids
sidebar:
  order: 3
  badge: TODO
---

Often databases have similarly sounding entities, e.g., user and account. To prevent developers from mixing those and introducing stealthy bugs, Typesaurus makes all ids typed.

By default, a collection id is linked to its path.

```ts
import { schema } from 'typesaurus'

const db = schema(($) => {
  users: $.collection<User>(),
  accounts: $.collection<Account>().sub({
    reports: $.collection<Report>()
  })
})
```

In the given example, the user document id is `Id<"users">`, and the account's reports subcollection document id is `Id<"users/reports">`.

Mixing types or trying to use a `string` will cause TypeScript to complain about it:

```ts
db.users.update(accountId, { name: "Sasha" });
//=> Argument of type 'Id<"accounts">' is not assignable to parameter of type 'Id<"users">'.
```

### Creating id

If you need to convert a string to an id or create a new random id, you can use a collection method `id`:

```ts
// Convert string to an id:
const userId = db.users.id("sasha");

// Create a new random id:
const newUserId = await db.users.id();
```

→ [Read more about the `id` method](/api/constructors/id/).

### Id type

If you need to use an id type in a function or a type, you can utilize the inferred schema type:

<!-- ```ts
You can access any document id type, using the inferred schema types ([read more about schema types](#schema-types)): -->

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
