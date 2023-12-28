---
title: undefined & null
sidebar:
  order: 7
---

Just like in JSON, there's no `undefined` in Firestore. If you try to set `undefined`, both [Web SDK](https://firebase.google.com/docs/reference/js/firestore_.firestoresettings.md#firestoresettingsignoreundefinedproperties) and [Firebase Admin](https://firebase.google.com/docs/reference/node/firebase.firestore.Settings#optional-ignoreundefinedproperties) will throw an error unless you set an option to ignore `undefined`.

However, avoiding undefined types is not always possible when working with existing types or types coming from 3rd-party. That's why when you set `undefined` with Typesaurus, it turns into `null`:

```ts
await db.users.set(userId, { lastName: undefined });

const user = await db.users.get(userId);
user.lastName;
//=> null
```

That also enables you to set `null` to a field that can be `undefined`:

```ts
interface User {
  firstName: string;
  lastName?: string | undefined;
}

await db.users.set(userId, { lastName: null });
```

Typesaurus transforms all types and unions `null` with `undefined` both in write arguments and return values.

However, when consuming data from the database, the functions or components that expect original types might start showing errors:

```ts
interface User {
  firstName: string;
  lastName?: string | undefined;
}

function renderUser(user: User) {
  return `${user.firstName} ${user.lastName}`;
}

renderUser(userFromDB);
//=> Type 'null' is not assignable to type 'string | undefined'.(2322)
```

To fix this, you can use the `Nullify` helper type:

```ts
import type { Typesaurus } from "typesaurus";

function renderUser(user: Typesaurus.Nullify<User>) {
  return `${user.firstName} ${user.lastName}`;
}

renderUser(userFromDB);
//=> OK
```

→ [Read more about `Nullify`](/types/nullify/)

Or, when possible, add or use `null` instead of `undefined`:

```ts
interface User {
  firstName: string;
  // Fine
  lastName?: string | undefined | null;
}

interface User {
  firstName: string;
  // Better!
  lastName?: string | null;
}
```

→ [Read more on designing good schemas](/advanced/core/designing/)
