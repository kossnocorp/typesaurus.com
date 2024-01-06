---
title: remove
sidebar:
  order: 5
---

The method allows removing a document. It's available on [`Collection`](/classes/collection/#remove), [`Ref`](/classes/ref/#remove), and [`Doc`](/classes/doc/#remove).

The method returns [`Ref`](/docs/classes/ref) instance:

```ts
const ref = await db.users.remove(userId);
//=> Ref<User>
```

:::caution[It won't remove subcollections!]
Removing a document won't remove its subcollections. You need to remove them manually.
:::
