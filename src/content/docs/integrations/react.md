---
title: React
sidebar:
  order: 1
---

Typesaurus provides first-class support for React ([as well as Preact](/integrations/preact/)) through [`@typesaurus/react`](https://www.npmjs.com/package/@typesaurus/react) package.

To start using it, install the package:

```bash
npm install --save @typesaurus/react
```

It provides a single hook `useRead` that allows you to fetch once or subscribe to a document or a collection updates:

```tsx
import { useRead } from "@typesaurus/react";
import { schema } from "typesaurus";

const db = schema(($) => ({
  posts: collection<Post>(),
}));

function Posts() {
  const [posts] = useRead(db.posts.query(($) => $.field("published").eq(true)));

  if (!posts) return <div>Loading...</div>;

  return (
    <ul>
      {posts.map((post) => (
        <li key={post.ref.id}>
          <a href={`/posts/${post.ref.slug}`}>
            <h2>{post.data.title}</h2>
            <p>{post.data.summary}</p>
          </a>
        </li>
      ))}
    </ul>
  );
}
```

The `useRead` hook accepts any reading method, both in promise and [subscription mode](/advanced/realtime/). It returns a tuple with the result and the status object:

```tsx
// Subscribe to user updates
const [user] = useRead(db.users.get(userId).on);

// Get user once
const [user] = useRead(db.users.get(userId));
```

When running in subscription mode, the hook returns the latest data state and updates it when the document changes.

When the component is unmounted, the subscription is automatically unsubscribed.

## Postponing requests

If you need to wait for something, i.e., for `userId` to resolve, you can pass a falsy value to the `useRead`:

```tsx
interface Props {
  userId: string | null;
}

function User({ userId }: Props) {
  // Wait for userId to resolve, then fetch the user:
  const [user] = useRead(userId && db.users.get(userId));

  if (!user) return <div>Loading...</div>;

  return <div>{user.data.name}</div>;
}
```

It also works within queries as well:

```tsx
interface Props {
  userId: string | null;
}

function Posts({ userId }: Props) {
  // Wait for userId to resolve, then fetch the user's posts:
  const [posts] = useRead(
    db.posts.query(($) => userId && $.field("author").eq(userId)),
  );

  if (!posts) return <div>Loading...</div>;

  return (
    <ul>
      {posts.map((post) => (
        <li key={post.ref.id}>
          <a href={`/posts/${post.ref.slug}`}>
            <h2>{post.data.title}</h2>
            <p>{post.data.summary}</p>
          </a>
        </li>
      ))}
    </ul>
  );
}
```

## Status

Along with the data, `useRead` returns a status object as the second element of the tuple.

The status object tells if the data is loading or if there was an error:

```tsx
const [user, { error, loading }] = useRead(db.users.get(userId));

loading;
//= false

error;
//=> PERMISSION_DENIED: Missing or insufficient permissions
```

## Return type

The [`all`](/api/reading/all/), [`query`](/api/reading/query/), and [`many`](/api/reading/many/) methods return an array of documents or `undefined` if the query is not ready yet:

```tsx
const [posts, { error, loading }] = useRead(
  db.posts.query(($) => $.field("published").eq(true)),
);

posts;
//=> undefined | Doc<Post>[]
```

The [`get`](/api/reading/get/) method returns a single document, `undefined` if the query is not ready yet, or `null` if the document is not found:

```tsx
const [user, { error, loading }] = useRead(db.users.get(userId));

user;
//=> undefined | null | Doc<User>
```

## `useLazyRead`

The `useLazyRead` hook is similar to `useRead`, but it doesn't perform the request or subscribe to the updates automatically. Instead, it returns a function that you can call to trigger the request:

```tsx
import { useLazyRead } from "@typesaurus/react";

interface UIProps {
  userId: string | null;
}

function UI({ userId }: UIProps) {
  // Create user hook, but don't perform the request yet
  const useUser = useLazyRead(userId && db.users.get(userId));

  if (!user) return <div>Loading...</div>;

  return (
    <UIContext.Provider value={{ useUser }}>
      <Content />
    </UIContext.Provider>
  );
}

function Content() {
  // Get the user hook from the context
  const { useUser } = useContext(UIContext);

  // Trigger the request
  const [user] = useUser();
  if (!user) return <div>Loading...</div>;
  return <div>{user.data.name}</div>;
}
```

Here's an example of how to create the context:

```tsx
import { dummyLazyReadHook, TypesaurusReact } from "@typesaurus/react";

interface UIContextValue {
  // Use TypesaurusReact.HookLazyUse
  useUser: TypesaurusReact.HookLazyUse<Schema["users"]["Result"]>;
}

const UIContext = createContext<UIContextValue>({
  // Use dummy hook that always returns loading state
  useUser: dummyLazyReadHook,
});
```

## `resolved` helper

To know if the document is resolved, you can use [the `resolved` helper](/helpers/resolved/):

```tsx
import { resolved } from "typesaurus";

// Later in the component:

const [user] = useRead(db.users.get(userId));

// resolved(user) will return true if the document finished loading
if (resolved(user) && !user)
  // So we can show "User not found" message
  return <div>User not found</div>;
```
