---
title: Sharing ids
sidebar:
  order: 6
  badge: TODO
---

Sometimes it's a good idea to have the same ids for 1:1 relations between collections. Say you have a document with a Twitter account data (username, avatar, etc.), storing the API credentials along with it will be a security breach, so you need to create a separate collection for that. In this case, using the same id for the account and the credentials absolutely makes sense:

```ts
import { schema, Typesaurus } from "typesaurus";

const db = schema(($) => ({
  accounts: $.collection<Account>(),
  credentials: $.collection<Credentials, Typesaurus.Id<"accounts">>(),
}));
```

We defined the credentials collection in the example with `Typesaurus.Id<'accounts'>` id. Both collection ids can now be interchangeable.

[Learn more about shared ids](/docs/guides/type-safety#shared-ids).

> #### Don't abuse shared ids!
>
> If two related documents have the same permissions and you need to download them together, they should be one document.
>
> It might be tempting to separate user profiles and settings, but in most cases, it will be beneficial for the end user to keep them as a single document as they both needed to display an app. Also, it's twice as less reads that you pay for
