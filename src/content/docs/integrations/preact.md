---
title: Preact
sidebar:
  order: 3
---

Typesaurus provides first-class support for React ([as well as React](/integrations/react/)) through [`@typesaurus/preact`](https://www.npmjs.com/package/@typesaurus/preact) package.

To start using it, install the package:

```bash
npm install --save @typesaurus/preact
```

It provides a single hook `useRead` that allows you to fetch once or subscribe to a document or a collection updates:

```tsx
import { useRead } from "@typesaurus/preact";
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

:::tip[Looking for docs?!]
For more documentation, [please see React integration docs](/integrations/react/), as the Preact and React packages are identical except for the internal adapter.
:::
