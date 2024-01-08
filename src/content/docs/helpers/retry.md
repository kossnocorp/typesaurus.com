---
title: retry
sidebar:
  order: 1
---

The `retry` helper is used to retry a subscription if it throws an error:

```ts
import { retry } from "typesaurus";

// Wait for user to be created
retry(db.users.get(userId).on)((user) => {
  // Do something with user
});
```

→ [Read more about retrying real-time subscriptions](/advanced/realtime/#waiting-for-result)

## Options

The function accepts a second argument with options:

```ts
retry(db.users.get(userId).on, {
  bypass: true,
  pattern: [250, 500, 1000, 2000, 4000, 8000, 16000],
})((user) => {
  // ...
});
```

## `bypass`

The `bypass` option allows you to conditionally ignore the retry logic and just run the subscription:

```ts
retry(db.users.get(userId).on, { bypass: true })((user) => {
  // ...
}).catch((error) => {
  // Immediately fail without retrying:
  error;
  //=> PERMISSION_DENIED: Missing or insufficient permissions
});
```

### `pattern`

The `pattern` option allows you to specify a custom retry pattern:

```ts
retry(db.users.get(userId).on, {
  // Retry after 1s, 2s, 4s, 8s, 16s, 32s, 64s...
  pattern: [1000, 2000, 4000, 8000, 16000, 32000, 64000],
})((user) => {
  // ...
});
```

When the pattern is exhausted, the subscription will fail with the last error.
