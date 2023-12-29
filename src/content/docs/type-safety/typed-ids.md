---
title: Typed ids
sidebar:
  order: 3
---

Often, databases have similarly sounding entities, e.g., user and account. To prevent developers from mixing those and introducing stealthy bugs, Typesaurus makes all ids typed.

By default, a collection id is linked to its path.

```ts
import { schema } from "typesaurus";

const db = schema(($) => ({
  users: $.collection<User>(),
  accounts: $.collection<Account>().sub({
    reports: $.collection<Report>(),
  }),
}));
```

In the given example, the user document id is `Id<"users">`, and the account's reports subcollection document id is `Id<"users/reports">`.

Mixing types or trying to use a `string` will cause TypeScript to complain about it:

```ts
db.users.update(accountId, { name: "Sasha" });
//=> Argument of type 'Id<"accounts">' is not assignable to parameter of type 'Id<"users">'.
```

## Creating id

If you need to convert a string to an id or create a new random id, you can use a collection method `id`:

```ts
// Convert string to an id:
const userId = db.users.id("sasha");

// Create a new random id:
const newUserId = await db.users.id();
```

→ [Read more about the `id` method](/api/constructors/id/)

---

To access a subcollection id, use the `sub` property:

```ts
const id = await db.users.sub.notes.id();
```

→ [Read more about accessing subcollections](/classes/collection/#sub)

## Id type

If you need to use an id type in a function or another type, you can utilize the inferred schema type:

```ts
import { schema, Typesaurus } from "typesaurus";

export const db = schema(($) => ({
  // ...
}));

export type Schema = Typesaurus.Schema<typeof db>;

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

→ [Read more about inferring schema](/type-safety/inferring-schema/)

## Shared ids

If your collections share ids, i.e., you use the organization id to store subscription documents, you can define a custom id using [`Typesaurus.Id`](/types/id/):

```ts
import { schema, Typesaurus } from "typesaurus";

const db = schema(($) => ({
  organizations: $.collection<Organization>(),
  subscriptions: $.collection<Subscription, Typesaurus.Id<"organizations">>(),
}));
```

Now, you'll be able to use the organization id to operate on the subscription documents:

```ts
function removeOrganization(organizationId: Schema["organizations"]["Id"]) {
  return Promise.all([
    db.organizations.remove(organizationId),
    db.subscriptions.remove(organizationId),
  ]);
}
```

→ [Read more about the `Id` type](/types/id)

→ [When to use shared ids](/design/sharing-ids/)

:::caution[Using inferred schema]
While it's possible to use [inferred schema](/type-safety/inferring-schema/) to access organization id `Schema["organizations"]["Id]` elsewhere else, including the schema models, you can't use it to define the schema collections as it will cause a circular type.
:::

## Static ids

Some collections have a finite number of documents, i.e., global application stats. For those cases, you can define custom string ids:

```ts
import { schema } from "typesaurus";

const db = schema(($) => ({
  regionStats: $.collection<RegionStats, "us" | "europe" | "asia">();
}));

db.regionStats.update("us", ($) => {
  online: $.increment(1);
});
```

→ [When to use static ids](/design/limited-collections/)
