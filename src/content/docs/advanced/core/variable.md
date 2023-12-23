---
title: Variable models
sidebar:
  order: 4
  badge: TODO
---

When [defining schema](/docs/intro/schema), you can assign a variable model to a collection, meaning it will have one of the many given interfaces, allowing you to store mixed data:

```ts
import { schema } from "typesaurus";

const db = schema(($) => ({
  // Variable model
  accounts: $.collection<[GitHubAccount, MicrosoftAccount, GoogleAccount]>(),
}));

interface GitHubAccount {
  type: "github";
  userId: string;
}

interface MicrosoftAccount {
  type: "microsoft";
  accountId: string;
}

interface GoogleAccount {
  type: "google";
  email: string;
}

await db.accounts.add({
  type: "github",
  userId: 123,
  //      ^^^ must be a string
});
```

Variable collections prevents you updating the document without ensuring it's of the right shape using the [`narrow`](/docs/api/narrow)

```ts
const account = await db.accounts.get(accountId);

// Can't update:
account?.update({ userId: "123" });
//                ^^^^^^
// Doesn't exist on MicrosoftAccount and GoogleAccount

// Narrow down to GitHubAccount type or return undefined
const ghAccount = content?.narrow<TextContent>(
  (data) => data.type === "github" && data,
);

if (!ghAccount) throw new Error("Wrong account id");

// Update GitHubAccount
await ghAccount.update({ userId: "123" });
```

It prevents you updating data in the wrong state, i.e. when working on billing.
