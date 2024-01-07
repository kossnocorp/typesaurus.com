---
title: count
sidebar:
  order: 5
---

To count documents in a collection or a query, use the `count` method. It's available on [`Collection`](/classes/collection/#count) and [`query`](/api/reading/query/#counting).

```ts
await db.posts.count();
//=> 420
```

The method returns `Promise<number>`.
