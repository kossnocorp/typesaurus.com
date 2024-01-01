---
title: Query flags
sidebar:
  order: 4
---

Even with the [addition of `!=` to Firestore](https://firebase.google.com/docs/firestore/query-data/queries#not_equal_), the approach familiar to all SQL developers, where you check for a `null` value, is still impossible.

To make such a query possible:

```sql
SELECT * FROM posts WHERE deleted_at IS NOT NULL
```

You would have to add query flags that denote the state. Consider this example where you have a soft deletion feature implemented using [field groups](/design/field-groups/):

```ts
interface Post {
  text: string;
  deleted?: SoftDeleted;
}

interface SoftDeleted {
  at: Date;
  by: string;
}
```

To make it work, in addition to the `at` and `by` fields, you would need to add a `deleted` flag solely to make the query possible:

```ts
interface SoftDeleted {
  flag: true;
  at: Date;
  by: string;
}

await db.posts.query(($) => $.field("deleted", "flag").eq(true));
```

:::tip[It's just a trade-off!]
Looking through SQL eyes, it might look hacky, but it's the price you pay for the flexibility and linear query time.
:::

It is even trickier to select all non-deleted posts, [as Firestore's `!=` operator excludes documents where the field does not exist](https://firebase.google.com/docs/firestore/query-data/queries#not_equal_), so you have a couple of options.

The first option is to make the `deleted` field required and union with `false`, allowing you to query for non-deleted posts:

```ts
interface Post {
  text: string;
  // We made it required and added false
  deleted: false | SoftDeleted;
}

interface SoftDeleted {
  // Note that we still need the flag to query for deleted posts
  flag: true;
  at: Date;
  by: string;
}

// Get deleted posts
await db.posts.query(($) => $.field("deleted", "flag").eq(true));

// Get active posts
await db.posts.query(($) => $.field("deleted").eq(false));
```

Another option is to use a state [field group](/design/field-groups/):

```ts
interface Post {
  text: string;
  state: PostState;
}

type PostState = PostStateActive | PostStateDeleted;

interface PostStateActive {
  type: "active";
}

interface PostStateDeleted {
  type: "deleted";
  at: Date;
}

// Get all deleted posts
await db.posts.query(($) => $.field("state", "type").eq("deleted"));

// Get all active posts
await db.posts.query(($) => $.field("state", "type").eq("active"));
```

Depending on your use case, you might want to use one or another approach. The first one is more flexible and allows for the addition of more state combinations. In contrast, the second one is more uniform and forces one state field, which might be easier to work with.
