---
title: Type safe records
sidebar:
  order: 8
  badge: TODO
---

```ts
import { schema } from "typesaurus";

interface Organization {
  folders?: {
    [folderId: string]: {
      drafts: number;
      scheduled: number;
      published: number;
    };
  };
}

const db = schema(($) => ({ organizations: $.collection<Organization>() }));
```

```ts
db.organizations.update(orgId, ($) =>
  $.field("folders", folderId, "scheduled").set($.increment(1)),
);
```

```json
{
  "folders": {
    "01eSWZkN7OSoW61jZBYswQ5Qb0y2": {
      "scheduled": 1
    }
  }
}
```
