---
title: silence
sidebar:
  order: 2
---

The `silence` helper is used to silence any errors:

```ts
import { silence } from "typesaurus";

// Ignore if postId doesn't exist
silence(
  db.posts.update(postId, ($) => $.field("deletedAt").set($.serverDate())),
);
```
