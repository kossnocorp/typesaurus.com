---
title: average
sidebar:
  order: 7
---

:::tip[Change log]
The method first appeared in `v10.1.0` and requires at least `firebase-admin@^12.0.0` and `firebase@^10.5.0`
:::

To calculate the document field values average, use the `average` method. It's available on [`Collection`](/classes/collection/#average), [`query`](/api/reading/query/#average), or [collection group](/extensions/groups/#api).

```ts
await db.users.average("age");
//=> 42
```

The method returns `Promise<number>`.
