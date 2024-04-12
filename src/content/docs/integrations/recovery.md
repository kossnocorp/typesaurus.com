---
title: Point-in-Time Recovery
sidebar:
  order: 4
---

**⚠️ Available starting with v10.6.0**

Firestore allows you to recover document versions from the past. The feature is called [point-in-time recovery](https://firebase.google.com/docs/firestore/pitr). It's useful when you accidentally delete or modify a document and want to restore it to the previous state.

Typesaurus provides an adapter that allows you to use this feature with your Typesaurus database without losing type-information. To start using it, install `@typesaurus/recovery` package:

```bash
npm install --save @typesaurus/recovery
```

:::tip[Server-only]
Point-in-time recovery works only with firebase-admin, so there's no web support.
:::

The package exposes a single method — `recover`. It accepts `Date`, timestamp `number`, or ISO `string` and requests to recover for the given time:

```ts
import { recover } from "@typesaurus/recovery";
import { subDays } from "date-fns";

// Get the user doc from 1 day ago:
await recover(subDays(new Date(), 1), db.users.get(userId));
// => Doc<User> | null
```

The `recover` function accepts all reading methods:

```ts
// Get user with their comments and posts:
const [user, comments, posts] = await recover(yesterday, [
  db.users.get(userId),
  db.users(userId).comments.all(),
  db.posts.query(($) => $.field("author").eq(userId)),
]);
```

The method returns values from the corresponding reading methods.

Available reading methods:

- [`get`](/api/reading/get/)
- [`all`](/api/reading/all/)
- [`query`](/api/reading/query/)
- [`many`](/api/reading/many/)

---

It also supports collection groups:

```ts
import { groups } from "typesaurus/groups";

// Get all user comments
await recover(
  yesterday,
  groups(db).comments.query(($) => $.field("author").eq(userId)),
);
```

→ [Read more about `groups`](/extensions/groups/)
:::caution[Beware of migrations!]
Be careful when using point-in-time recovery with migrations. Typesaurus can't ensure the exact document types, so you may get a runtime error if the document structure has changed since the recovery point.
:::
