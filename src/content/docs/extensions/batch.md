---
title: batch
sidebar:
  order: 3
---

The method allows to perform batch operations. It's available as an extension that you import separately:

```ts
import { batch } from "typesaurus";

interface Post {
  title: string;
  text: string;
}

const db = schema(($) => ({
  posts: $.collection<Post>(),
}));

const $ = batch(db);

// Import posts from RSS
rss.forEach(({ slug, title, text }) =>
  // Set the post with the given slug
  $.posts.set(db.posts.id(slug), { title, text }),
);

// Commit the operation
await $();
```

The method accepts the database instance as the argument and returns a batch wrapper.

→ [Read the batch writes guide](/advanced/batch/)

## API

All batch wrapper collections have altered methods available:

- [`set`](/api/writing/set/) - sets a document
- [`update`](/api/writing/update/) - updates a document
- [`upset`](/api/writing/upset/) - sets or updates a document if it exists
- [`remove`](/api/writing/remove/) - removes a document

Unlike the regular methods, batch methods are synchronous and return `void`:

```ts
const $ = batch(db);

// Set a document
$.users.set(userId, ($) => ({
  name: "Sasha",
  createdAt: $.serverDate(),
}));

// Update a document
$.posts.update(postId, {
  title: "Hello",
});

// Set or update a document
$.posts(postId).comments.upset(commentId, {
  text: "Hello",
});

// Remove a document
$.subscriptions.remove(subscriptionId);

await $();
```

### `$()`

The returned batch wrapper also acts as a function that commits the batch operation:

```ts
const $ = batch(db);

// ...add operations

// Commit all write operations
await $();
```

It returns `Promise<void>`.
