---
title: Limited collections
sidebar:
  order: 7
  badge: TODO
---

It's ok to create a dedicated collection to store a single document in it. For example, you might need store global app stats:

```ts
import { schema } from "typesaurus";

interface AppStats {
  users?: number;
  online?: number;
}

const db = schema(($) => ({
  appStats: $.collection<AppStats, "stats">(),
}));

// ...later:
await db.appStats.update("stats", ($) => {
  users: $.increment(1);
});
```

We created `appStats` collection with static id `stats`. This will let Typesaurus know that you can write and read only a single document in the collection.

[Learn more about static ids](/docs/guides/type-safety#static-ids).
