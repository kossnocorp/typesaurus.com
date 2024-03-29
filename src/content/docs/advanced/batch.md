---
title: Batch writes
sidebar:
  order: 4
---

Batch operations allow you to perform multiple (up to 500) write operations as a single atomic operation, speeding up the process.

To use batch writes, you need to import `batch` function from Typesaurus:

```ts
interface Report {
  text: string;
}

const db = schema(($) => ({
  reports: $.collection<Report>(),
}));

// Create the batch wrapper
const $ = batch(db);

// Add all CSV rows to the database
csv.forEach(([id, text]) => $.reports.upset(db.reports.id(id), { text }));

// Commit the operation
await $();
```

`batch` creates a db wrapper that allows you to add write operations to the batch and commit them all at once using `await $()`.

The batch allows you to perform all write operations but `add`, because it requires the document id to be generated by Firestore, which is impossible to do in a batch.

Just like everything, all batch operations are type-safe.

→ [Read more about `batch`](/extensions/batch/)
