---
title: sum
sidebar:
  order: 6
---

:::tip[Change log]
The method first appeared in `v10.1.0` and requires at least `firebase-admin@^12.0.0` and `firebase@^10.5.0`
:::

To sum document field values, use the `sum` method. It's available on [`Collection`](/classes/collection/#sum), [`query`](/api/reading/query/#sum), or [collection group](/extensions/groups/#api).

```ts
await db.users.sum("age");
//=> 42069
```

The method returns `Promise<number>`.
