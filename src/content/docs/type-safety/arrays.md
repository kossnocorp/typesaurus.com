---
title: Arrays
sidebar:
  order: 6
  badge: TODO
---

There are several limitations on how you can use arrays with Firestore. To prevent runtime errors, Typesaurus incorporates those limitations into its type system.

### Write helpers

You can't use the write helpers (i.e., `$.remove()`) with server dates. Such a code will result in a type error:

```ts

```

### Server dates in arrays

As `$.` You can't [server dates](#serverdates)

### Arrays in arrays
