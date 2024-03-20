---
title: narrow
sidebar:
  order: 1
---

The method narrows the [variable model](/type-safety/variable/) doc type. It's available on [`Doc`](/classes/doc/#narrow).

```ts
const ghAccount = account.narrow<GitHubAccount>(
  (data) => data.type === "github" && data,
);
//=> Doc<GitHubAccount> | undefined
```

The method accepts a function that has to return the data of the target type or `undefined`.

It allows checking the data structure on the runtime and also asserts the type. If the data structure checks aren't sufficient, it will result in a type error.

:::caution[Beware of data inconsistency]
Failing to write a proper check will result in a type error, however it won't prevent the code from running, which might lead to data inconsistency.
:::

→ [Read more about variable models](/type-safety/variable/).
