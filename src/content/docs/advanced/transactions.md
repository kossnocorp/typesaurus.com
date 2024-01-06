---
title: Transactions
sidebar:
  order: 2
---

Transactions allow you to safely perform operations on document data without worrying about simultaneous document updates.

Typesaurus improves the Firestore's transaction API by splitting the transaction into two parts: `get` and `set`:

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

In this example, we fetch the user document and increment its rating. If the rating changes during the transaction, Firestore will retry the transaction.

In the `read` part, you `get` any number of documents. Whatever you return, will be accessible in the `write` part as `$.result`:

```ts
transaction(db)
  .read(($) =>
    Promise.all([$.db.users.get(userId), $.db.subscriptions.get(userId)]),
  )
  .write(($) => {
    const [user, subscription] = $.result;
    if (!user || !subscription) return;
    // Do something with user and subscription
  });
```

The `write` part allows you to perform any write operations on any collections and the documents from the result:

```ts
transaction(db)
  .read(($) =>
    Promise.all([$.db.users.get(userId), $.db.subscriptions.get(userId)]),
  )
  .write(($) => {
    const [user, subscription] = $.result;
    if (!user || !subscription) return;

    const rating = user.data.rating + 1;

    // Update user rating
    user.update({ rating });

    // Level up user subscription
    if (rating > 10)
      subscription.update({ level: subscription.data.level + 1 });

    // Update leaderboard
    $.db.leaderboard.update("global", {
      [userId]: rating,
    });
  });
```

In this example, we update the user rating, level up the subscription if the rating exceeds ten, and update the leaderboard. We'll always get up-to-date stats even if the user documents get updated.

:::caution[Take a note!]
Read operations are asynchronous, so you need to `await` them or return a promise. On the other hand, write operations are synchronous, so you shouldn't `await` them. They will perform on the exit from the function.
:::

→ [Read more about `transaction`](/extensions/transaction/)
