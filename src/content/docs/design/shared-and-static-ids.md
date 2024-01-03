---
title: Shared & static ids
sidebar:
  order: 6
---

## Sharing ids

Sometimes, having the same ids for 1:1 relations between collections is a good idea. Say you have a document with Twitter account data (username, avatar, etc.). Storing the API credentials with it will be a security breach, so you must create a separate collection. In this case, using the same id for the account and the credentials makes sense:

```ts
import { schema, Typesaurus } from "typesaurus";

const db = schema(($) => ({
  accounts: $.collection<Account>(),
  credentials: $.collection<Credentials, Typesaurus.Id<"accounts">>(),
}));
```

We defined the credentials collection in the example with `Typesaurus.Id<'accounts'>` id. Both collection ids can now be interchangeable.

→ [Learn more about typed ids](/type-safety/typed-ids/).

### Don't abuse shared ids!

It might seem to be a good idea to decouple data, utilize shared ids, and store, say, user profiles and user settings separately, but in the end, it will degrade the user experience as you have to read and wait for two documents before the application UI is fully loaded.

If you read documents together, make them a single document.

## Static ids

It's okay to create a dedicated collection to store a single document. For example, you might need to store global app stats:

```ts
import { schema } from "typesaurus";

interface AppStats {
  users?: number;
  online?: number;
}

const db = schema(($) => ({
  appStats: $.collection<AppStats, "stats">(),
}));

await db.appStats.update("stats", ($) => {
  users: $.increment(1);
});
```

We created `appStats` collection with static id `stats`. This will let Typesaurus know you can write and read only a single document in the collection.

You might have more than one document id, that you can define as a union type:

```ts
const db = schema(($) => ({
  appStats: $.collection<AppStats, "global" | "us" | "europe" | "sea">(),
}));
```

In this example, we store global and regional stats separately.

→ [Learn more about typed ids](/type-safety/typed-ids/).
