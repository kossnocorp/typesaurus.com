---
title: SubscriptionPromise
sidebar:
  order: 4
---

The `SubscriptionPromise` class is what is returned from all reading operations. It allows to both read documents once or subscribe to updates depending what you do with the instance.

```ts
// At this point, there's no request to the database
const sp = db.users.get(userId);

// Read document once
const doc = await sp;
//=> null | Doc<User>

// Subscribe to updates
sp.on((doc) => {
  //=> Doc<User>
});
```

Alghough the class doesn't extend the builtin `Promise` class, it implements the same interface so that you can use it as a promise.

## Promise mode

If you call `then`, `catch` or `await` on the instance, it will perform the read operation and return the result.

```ts
const sp = db.users.get(userId);

// Use then
sp.then((doc) => {
  //=> null | Doc<User>
}).catch((error) => {
  //=> PERMISSION_DENIED: Missing or insufficient permissions
});

// Use await
const doc = await sp;
//=> null | Doc<User>
```

You can't subscribe to updates in this mode, so if you call `on` it will throw an error:

```ts
const sp = db.users.get(userId);

await sp();

// Throws an error
sp.on((doc) => {
  // ...
});
//=> Can't subscribe after awaiting
```

## Subscription mode

If you call `on` on the instance, it will subscribe to updates and return a function to unsubscribe:

```ts
const sp = db.users.get(userId);

// Subscribe to updates
const off = sp.on((doc) => {
  //=> Doc<User>
});

// Unsubscribe
off();
```

You can handle errors using `catch`:

```ts
const sp = db.users.get(userId);

const off = sp
  .on((doc) => {
    //=> ...
  })
  .catch((error) => {
    //=> PERMISSION_DENIED: Missing or insufficient permissions
  });
```

Just like with the promise, you can't read the document in this mode, so if you call `then`, `catch` or `await` it will throw an error:

```ts
const sp = db.users.get(userId);

sp.on((doc) => {
  // ...
});

// Throws an error
await sp;
//=> Can't await after subscribing
```

## Constructor

Typically you don't need to construct `SubscriptionPromise` manually, but you're working on a new method, or custom wrapper, you can use the constructor like that:

```ts
import { SubscriptionPromise, TypesaurusCore } from "typesaurus";

// Describes what is stored in the subscription promise, allows to identify
// the request
interface FirstRequest extends TypesaurusCore.Request<"first"> {}

// Meta information to attach to the subscription promise
interface FirstMeta {
  // ...
}

async function first<Def extends TypesaurusCore.DocDef>(
  path: string,
): TypesaurusCore.SubscriptionPromise<
  // The request type
  FirstRequest,
  // What is returned
  Doc<Def, Props> | null,
  // Optional meta information
  FirstMeta
> {
  // ...

  return new SubscriptionPromise({
    request: request({ type: "request", kind: "many", path }),

    // Implementation of the promise method
    get: () => {
      // I.e. query the database, return the first document
    },

    // Implementation of the subscribe method
    subscribe: (onResult, onError) => {
      // I.e. subscribe to the database, call onResult on each update,
      // call onError on error.

      // You must return a function to unsubscribe
      return off;
    },
  });
}
```

## `request`

The property holds the request object that describes the request. It's useful for integrations, debugging, and logging.

```ts
const sp = db.users.get(userId);

sp.request;
//=> GetRequest
```

## `on`

The method that triggers the subscription. See [the Subscription mode section](#subscription-mode) for more details.
