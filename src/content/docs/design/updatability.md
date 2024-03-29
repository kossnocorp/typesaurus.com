---
title: Updatability
sidebar:
  order: 8
---

It might be tempting to make as many fields required as possible to avoid extra null checks. After all, we're trying to achieve type safety, right?

That's right, but we also want to keep our data consistent, and when we update it, we must be sure it never gets into an impossible state, and here the problem lies.

Let's take a look at the given schema:

```ts
import { schema } from "typesaurus";

interface Organization {
  counters?: {
    drafts: number;
    scheduled: number;
    published: number;
  };
}

const db = schema(($) => ({
  organizations: $.collection<Organization>(),
}));
```

We want to keep an organization's number of drafts and scheduled and published posts.

In the example, we've made `counters` optional as we don't want to bootstrap it when we create an organization, but we made `drafts`, `scheduled`, and `published` fields required so when `counters` is set, we can be sure they are all defined.

For example, once a user schedules a post, we want to increment the `scheduled` field:

```ts
db.organizations.update(orgId, ($) =>
  $.field("counters", "scheduled").set($.increment(1)),
);
```

Sounds easy enough, right?

The problem here is that setting `counters` this way for the first time will break data consistently and lead to something like this:

```json
{
  "counters": {
    "scheduled": 1
  }
}
```

You can see that `drafts` and `published` are missing, which don't correspond with our types where those fields are required.

That's why Typesaurus **doesn't allow** updates like this:

```ts
const folderId = "folder-id";

db.organizations.update(
  orgId,
  ($) => $.field("counters", "scheduled").set($.increment(1)),
  //=>                       ^^^^^^^^^^^
  //=> Argument of type 'string' is not assignable to parameter of type 'never'.
);
```

Typesaurus checks if the path is safe to update and won't cause inconsistency. If it's not safe, it shows a type error.

So, to make single field update possible, we should make all fields optional:

```ts
interface Organization {
  counters?: {
    drafts?: number;
    scheduled?: number;
    published?: number;
  };
}
```

It will make the data harder to consume as we'll need to add additional checks before using the counters, but it will make updating it way easier. It's a balancing act.

:::tip[Consider this!]
When designing a schema, always think about how you will update it.

If you want to be able to update a single field, make sure that setting it won't cause data inconsistency.
:::

If you **must** have the fields required, then make sure you always set them together, e.g.:

```ts
db.organizations.update(orgId, ($) => ({
  counters: {
    drafts: $.increment(0),
    scheduled: $.increment(1),
    published: $.increment(0),
  },
}));
```
