---
title: Using arrays
sidebar:
  order: 5
---

Arrays in Firestore have some limitations that you should know to design your database schema efficiently:

1. Arrays can't contain array items, but you can put an array into an object item.
2. No write helpers (e.g., `$.serverDate()`, `$.increment()`, etc.) are available for array items and nested objects.
3. You can't use field paths to update array items. Doing so will replace the whole array and turn it into an object.

Given those limitations, it's recommended to use arrays only for primitive values and objects for more complex data.

For example, a good example of using arrays would be a list of tags:

```ts
interface Post {
  text: string;
  tags: string[];
}

const db = schema(($) => ({
  posts: $.collection<Post>(),
}));

// Get JS & TS posts
await db.posts.query(($) => $.field("tags").containsAny(["js", "ts"]));
```

On the other hand, if you want to store more complex data, it's better to use an object:

```ts
interface Organization {
  team: Record<Schema["users"]["Id"], Membership>;
}

interface Membership {
  member: boolean;
  role: Role;
}

type Role = "admin" | "member";

// Get all organizations where the user is a member
await db.organizaton.query(($) => $.field("team", userId, "member").eq(true));
```

→ [Learn more about how Typesaurus helps to make arrays type-safe](/type-safety/arrays/)
