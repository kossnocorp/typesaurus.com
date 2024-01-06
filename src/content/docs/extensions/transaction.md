---
title: transaction
sidebar:
  order: 1
  badge: TODO
---

The method allows to run a transaction on the database. It's available as an extension that you import separately:

```ts
import { transaction } from "typesaurus";

transaction(db)
  .read(($) => $.db.users.get(userId))
  .write(($) => {
    const user = $.result;
    if (!user) return;
    user.update({ rating: user.data.rating + 1 });
  });
```
