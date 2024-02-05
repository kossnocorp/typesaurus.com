---
title: groups
sidebar:
  order: 2
---

The method allows to query collection groups. It's available as an extension that you import separately:

```ts
import { groups } from "typesaurus";

await groups(db).comments.query(($) => $.field("rating").gt(3));
//=> Array<Doc<ProductComment> | Doc<PostComment>>
```

The method accepts the database instance as the argument and returns a collections groups wrapper.

→ [Read the collection group guide](/advanced/groups/)

## API

All collections groups have altered methods available:

- [`all`](/api/reading/all/) - reads all documents in the group
- [`query`](/api/reading/query/) - queries the group
- [`count`](/api/reading/count/) - counts all documents in the group
- [`sum`](/api/reading/sum/) - sums give document field values in the group
- [`average`](/api/reading/average/) - calculates the average of given document field values in the group

Unlike the regular `all` and `query`, reading collection group will return mixed document types.

→ [Read more about collection groups](/advanced/groups/)
