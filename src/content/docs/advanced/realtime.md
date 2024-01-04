---
title: Real-time
sidebar:
  order: 1
---

Typesaurus provides seamless API to work with Firestore's real-time updates. Each reading method can work in two modes: promise and subscription:

```ts
// Get user once
const user = await db.users.get(userId);

// Subscribe to user updates
db.users.get(userId).on((user) => {
  // Do something with user
});
```

As you can see, calling the `on` methid will subscribe you to updates, and awaiting or calling `then` will get you the result once.

It's possible, thanks to [`SubscriptionPromise`](/classes/subscription-promise/), that doesn't trigger the request until you do something with it.

As a side effect, such a code will not trigger the request:

```ts
// Nothing happens
db.users.get(userId);
```

The method is available for:

- [`get`](/api/reading/get/#subscription)
- [`all`](/api/reading/all/#subscription)
- [`query`](/api/reading/query/#subscription)
- [`many`](/api/reading/many/#subscription)

## Unsubscribing

To unsubscribe from the updates, call the function returned from `on` method:

```ts
// Subscribe to user updates
const off = db.users.get(userId).on((user) => {
  // ...
});

// Unsubscribe after 5 seconds
setTimeout(off, 5000);
```

Calling `off` will immediately unsubscribe you from the updates.

## Handling errors

Just like with promise API, you can listen to errors by calling `catch`:

```ts
db.users
  .get(userId)
  .on((user) => {
    // ...
  })
  .catch((error) => {
    // Process the error
  });
```

## Waiting for result

Calling `on` for a document that doesn't exist will trigger a permission error and stop listening to updates. This Firestore behavior might be very confusing or break your app.

Sometimes, it's helpful to retry the request until the document is created, for example, for waiting for the user document to get created by [`onCreate`](https://firebase.google.com/docs/functions/auth-events#trigger_a_function_on_user_creation) trigger. For that, you can combine the subscription with [the `retry` helper](/helpers/retry/):

```ts
import { retry } from "typesaurus";

// Wait for user to be created
retry(db.users.get(userId).on)((user) => {
  // Do something with user
}).catch((error) => {
  // Process the error
});
```

The helper will retry the request using the backoff pattern seven times by default and then throw the error. You can customize this behavior using [the `pattern` option](/helpers/retry/#pattern)
