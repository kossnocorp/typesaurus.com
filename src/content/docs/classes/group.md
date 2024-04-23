---
title: Group
sidebar:
  order: 4
---

The `Group` class represents a [collection group](/advanced/groups) in the database.

You access the groups using the groups.

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

groups(db).comments;
//=> Group<Comment>
```

→ [Read more about the collection groups](/advanced/groups/)

→ [Read more about the `groups` function](/extensions/groups/)

→ [Collection group on the Firebase Docs website](https://firebase.google.com/docs/firestore/query-data/queries#collection-group-query)

## `type`

The entity type.

```ts
groups(db).comments;
//=> "group"
```

## `name`

The group name.

```ts
groups(db).comments;
//=> "comments"
```

## `all`

The method allows to get all documents in the collection:

```ts
await groups(db).comments.all();
//=> Doc<Comment>[]
```

→ [Read more about the `all` method](/api/reading/all/)

## `query`

The method allows to query documents in the collection:

```ts
await groups(db).comments.query(($) => $.field("text").eq("Hello"));
//=> Doc<Comment>[]
```

→ [Read more about the `query` method](/api/reading/query/)

## `count`

The method allows counting documents in the collection:

```ts
await groups(db).comments.count();
//=> 420
```

→ [Read more about the `count` method](/api/reading/count/)

## `sum`

:::tip[Change log]
The method first appeared in `v10.1.0` and requires at least `firebase-admin@^12.0.0` and `firebase@^10.5.0`
:::

The method enables summing the collection field values:

```ts
await groups(db).comments.sum("age");
//=> 42069
```

→ [Read more about the `sum` method](/api/reading/sum/)

## `average`

:::tip[Change log]
The method first appeared in `v10.1.0` and requires at least `firebase-admin@^12.0.0` and `firebase@^10.5.0`
:::

The method allows to calculate the average of collection field values:

```ts
await groups(db).comments.average("age");
//=> 42
```

→ [Read more about the `sum` method](/api/reading/sum/)

## `as`

**⚠️ Available starting with v10.7.0**

The method resolves [`Typesaurus.SharedGroup`](/types/typesaurus/#sharedgroup) if the model extends the given type. Otherwise, it resolves `unknown` preventing the usage of incompatible models:

```ts
rename(groups(db).comments.as<TextFields>());
```

It allows sharing functionality across the db entities in a type-safe way.

→ [Read more about sharing functionality](/type-safety/sharing/)

→ [Read more about the `as` method](/api/misc/as/)
