---
title: Field groups
sidebar:
  order: 3
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

There's another problem: since it's a union, we can't access `deletedAt` without the property check:

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

:::tip[Do you need variable models?]
Most of the time, you can add variability to documents by using field groups. However, if your documents differ too much, consider using [variable models](/type-safety/variable/).
:::

Fields groups allow you to define relations between fields, which leads to better type safety and readability. Since there's no penalty for nesting objects in Firestore, whenever you feel you might need group fields - go for it!

Furthermore, it enables you to share such groups with other models, making your database more consistent and easier to maintain:

```ts
interface Post {
  text: string;
  deleted?: SoftDeleted;
}

interface Project {
  title: string;
  deleted?: SoftDeleted;
}

// You share the doc comments too!
interface SoftDeleted {
  /** When the document was deleted */
  at: Date;
  /** Who deleted the document */
  by: string;
}
```

:::tip[Learn about query flags]
The field groups work the best with query flags, so make sure to [learn about them](/design/query-flags/) too!
:::
