---
title: Field groups
sidebar:
  order: 3
  badge: TODO
---

Even though it's intuitive to keep documents as flat as possible, just like you would do in a traditional SQL database, it's not always the best idea with Firestore.

Consider the given example where we have a blog post that can be soft deleted, and we want to know who deleted it:

```ts
interface Post {
  text: string;
  deletedAt?: Date;
  deletedBy?: string;
}
```

Updating such a document with only one of the fields will not cause a type error:

```ts
// OK
await db.posts.update(postId, ($) => $.field("deletedAt").set(new Date()));
```

So, if we would want to make sure these are always set together and keep the structure flat, we would need to intersect the types:

```ts
type Post = {
  text: string;
} & (
  | {}
  | {
      deletedAt: Date;
      deletedBy: string;
    }
);
```

It's already messy, but even though we just have three fields! Imagine how it would look with more conditional fields.

There's another problem: since it's an intersection, we can't access `deletedAt` without a property check:

```ts
// Nope
post.deletedAt;
//=> ^^^^^^^^^
//=> Property 'deletedAt' does not exist on type '{ text: string; }'.ts(2339)

// OK
"deletedAt" in post && post.deletedAt;
```

Having such types will quickly turn your database and codebase into a mess.

The better approach is to group fields into a separate object:

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

Now, we are forced to assign both fields together, and also we can access them without a property check:

```ts
await db.posts.update(postId, {
  deleted: {
    at: new Date(),
    by: username,
  },
});

// OK!
post.deleted;
//=> undefined | SoftDeleted
```

Neat!
