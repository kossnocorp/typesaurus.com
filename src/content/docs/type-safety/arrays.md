---
title: Arrays quirks
sidebar:
  order: 6
---

There are several limitations on how you can use arrays with Firestore. To prevent runtime errors, Typesaurus incorporates those limitations into its type system.

## Nested arrays

Firestore doesn't allow an array as an array item but can be nested in an object.

To prevent runtime errors, Typesaurus doesn't allow to set such a structure:

```ts
interface Data {
  array: (string[] | string)[];
}

await db.data.set(dataId, {
  array: ["a", "b", "c"],
});

await db.data.set(dataId, {
  array: ["a", ["b", "c"]],
  //=>         ^^^^^^^^^^
  //=> Type '[string, string]' is not assignable to type 'string'.
});
```

:::caution[Keep in mind!]
While writing nested arrays is not permitted, [`schema`](/api/schema) will allow you to define a collection with such a type.
:::

### Write helpers

You can't use the write helpers (i.e., `$.remove()` or `$.serverDate()`) inside an array and all nested structures, so such a code will result in a type error:

```ts
interface Post {
  comments: Comment[];
}

interface Comment {
  createdAt: Typesaurus.ServerDate;
  text: string;
}

await db.posts.update(postId, ($) => $.field("comments", 0).set($.remove()));
//=>                                                     ^
//=> Argument of type 'number' is not assignable to parameter of type 'never'.ts(2345)
```

To work around it, update the array manually:

```ts
const post = await db.posts.get(postId);
post?.update(($) => $.field("comments").set(post.data.comments.slice(1)));
```

Or use the `$.arrayUnion` and `$.arrayRemove` helpers:

```ts
await db.posts.update(postId, ($) =>
  $.field("comments").set(
    $.arrayRemove("Join NFT giveaway! https://example.com"),
  ),
);
```

→ [Learn about using arrays when designing schema](/design/using-arrays/)
