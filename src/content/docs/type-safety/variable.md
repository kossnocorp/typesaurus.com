---
title: Variable models
sidebar:
  order: 9
---

Variable models are a Typesaurus feature that allows defining a collection with a few different types instead of a single one.

:::tip[Consider using field groups!]
Even though variable models are a powerful feature, it's not always the best solution. If your documents have an overlap, consider using [field groups](/design/field-groups/) instead.
:::

Let's say you have a collection of accounts of different types, e.g., GitHub, Microsoft, and Google. You can define a variable model like this:

```ts
import { schema } from "typesaurus";

const db = schema(($) => ({
  // Variable model
  accounts: $.collection<[GitHubAccount, MicrosoftAccount, GoogleAccount]>(),
}));

interface GitHubAccount {
  type: "github";
  active: boolean;
  userId: string;
}

interface MicrosoftAccount {
  type: "microsoft";
  active: boolean;
  accountId: string;
}

interface GoogleAccount {
  type: "google";
  active: boolean;
  email: string;
}

await db.accounts.add({
  type: "github",
  active: true,
  userId: 123,
  //      ^^^ must be a string
});
```

Typesaurus recognized that you're trying to set a GitHub account and type-checked the `userId` field.

## Reading

When you read a variable document, you'll have access to all fields, but unique fields will be optional until you check for the type:

```ts
const account = await db.accounts.get(accountId);

if (account) {
  account.data.email;
  //=> string | null | undefined

  if (account.data.type === "google") {
    account.data.email;
    //=> string
  }
}
```

It differs from union behavior, where you would have to check for the property existence before accessing it:

```ts
type Account = GitHubAccount | MicrosoftAccount | GoogleAccount;

account;
//=> Account

account.email;
//=>    ^^^^^
//=> Property 'email' does not exist on type 'Acc'.
//=>   Property 'email' does not exist on type 'GitHubAccount'.ts(2339)
```

## Updating

Setting and reading variable documents is pretty straightforward. However, it gets trickier when you want to update it.

Variable collections prevent you from updating the document without ensuring it's of the right shape using the [`narrow`](/api/misc/narrow), so you can't accidentally update the wrong type:

```ts
const account = await db.accounts.get(accountId);

// Can't update:
await account?.update({ userId: "123" });
//=>              ^^^^^^
//=> Object literal may only specify known properties, and 'userId' does not exist in type 'Getter<never, DocProps & { environment: RuntimeEnvironment; }>'.ts(2353)

// Narrow down to GitHubAccount type or return undefined
const ghAccount = account?.narrow<GitHubAccount>(
  (data) => data.type === "github" && data,
);

// Update GitHubAccount
await ghAccount?.update({ userId: "123" });
```

However, you still can update fields that are shared between types:

```ts
await db.accounts.update(accountId, { active: false });
```

That forces you to always read variable documents before updating them, but it is the only way to ensure you don't accidentally update the wrong kind and cause runtime errors.

## Why not unions?

You might ask, why not to use union instead:

```ts
type Account = GitHubAccount | MicrosoftAccount | GoogleAccount;
```

The main problem is that it's not possible to get shared shape where the field types are compatible, opening the door for bugs:

```ts
const db = schema(($) => ({
  // Variable model
  union: $.collection<GitHubAccount | MicrosoftAccount | GoogleAccount>(),
  varibale: $.collection<[GitHubAccount, MicrosoftAccount, GoogleAccount]>(),
}));

// Will pass but result in runtime errors:
await db.union.update(accountId, { type: "github" });

// Nope!
await db.varibale.update(accountId, { type: "github" });
//=>                                  ^^^^
//=> Object literal may only specify known properties, and 'type' does not exist in type 'Getter<never, DocProps & { environment: RuntimeEnvironment; }>'.ts(2353)
```

Another inconvenience is that you must check for the property's existence before accessing it, making the rendering logic more complex.

All in all, variable models are a more robust solution for modeling documents with different shapes and allow Typesaurus have to better control over the schema
