---
title: resolved
sidebar:
  order: 3
---

The function allows to check if the document completed resolving (either defined or `null`):

```tsx
import { useRead } from "@typesaurus/react";
import { resolved } from "typesaurus";

function User({ userId }: Props) {
  const [user] = useRead(db.users, userId);

  // Still loading
  if (!resolved(user)) return <div>Loading...</div>;

  // Not found
  if (!user) return <div>Not found!</div>;

  // Render user
  return <div>User: {user.data.name}</div>;
}
```
