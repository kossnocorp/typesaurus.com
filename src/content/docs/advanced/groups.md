---
title: Collection groups
sidebar:
  order: 3
---

Firestore allows to query documents across different collections as long as they have the same name.

To use this feature with Typesaurus, import `groups` function that wraps the database instance:

```ts
import { groups } from "typesaurus";

interface Post {
  text: string;
  rating: number;
}

interface UserPost extends Post {
  highlight: boolean;
}

interface User {
  name: string;
}

const db = schema(($) => ({
  users: $.collection<User>().sub({
    posts: $.collection<UserPost>(),
  }),
  posts: $.collection<Post>(),
}));

// Access both users/posts and posts collections
await groups(db).posts.query(($) => $.field("rating").gt(3));
```

The database wrapper recursively extracts all collections, giving you access to them on the root level even if they are deeply nested:

```ts
interface Comment {
  text: string;
}

const db = schema(($) => ({
  users: $.collection<User>().sub({
    posts: $.collection<UserPost>().sub({
      comments: $.collection<Comment>(),
    }),
  }),
  posts: $.collection<Post>().sub({
    comments: $.collection<Comment>(),
  }),
}));

const allComments = await groups(db).comments.all();
```

And just like anything else in Typesaurus, collection groups are 100% type-safe. When you query a group that has a variable model shape, the return data type will consider that:

```ts
interface Post {
  text: string;
  rating: number;
}

interface UserPost extends Post {
  highlight: boolean;
}

const goodPosts = await groups(db).posts.query(($) => $.field("rating").gt(3));

goodPosts.forEach((post) => {
  // Can be both Post and UserPost, so it will fail:
  post.data.highlight;
  //=>      ^^^^^^^^^
  //=> Property 'highlight' does not exist on type 'DataNullified<{ text: string; rating: number; }, "missing">'.ts(2339)

  // Ok: text is shared!
  post.data.text;

  // Narrow down to UserPost:
  const userPost = post.narrow((p) => "highlight" in p && p);
  if (userPost) {
    // It's UserPost!
    userPost.data.highlight;
  }
});
```

If this example querying `posts` collection got us both `Post` and `UserPost` documents, we must narrow down the type to access the unique `highlight` field. All the shared fields are accessible without narrowing down.

→ [Read more about `groups`](/api/extensions/groups/)
