---
title: Writing data
sidebar:
  order: 3
---

In this document, you'll learn how to write data to your database with Typesaurus.

There are several methods that allow writing documents:

- [`add`](#add) - adds a document with a random id
- [`set`](#set) - sets specific document
- [`update`](#update) - updates specific document
- [`upset`](#upset) - updates or sets specific document
- [`remove`](#remove) - removes a document

## `add`

To add a document with random id:

```ts
const userRef = await db.users.add({ name: "Sasha" });

userRef.id;
//=> "04orIWcrs1F8bw8CcDUM"
```

→ [Read more about `add`](/api/writing/add/)

## `set`

To set a document:

```ts
await db.users.set(userId, { name: "Sasha" });
```

`set` is also available on [`Ref`](/classes/ref/) and [`Doc`](/classes/doc/):

```ts
const userRef = await db.users.add({ name: "Sasha" });

// Later:
await userRef.set({ name: "Alexander" });
```

→ [Read more about `set`](/api/writing/set/)

## `update`

To update a document with a specific id:

```ts
await db.users.update(userId, { name: "Alex" });
```

If the document doesn't exist, it will throw an error.

---

`update` is also available on [`Ref`](/classes/ref/) and [`Doc`](/classes/doc/):

```ts
const userRef = await db.users.add({ name: "Sasha" });

// Later:
await userRef.update({ name: "Alexander" });
```

→ [Read more about `update`](/api/writing/update/)

## `upset`

To update or set a document:

```ts
await db.users.upset(userId, { name: "Alex" });
```

If the document doesn't exist, it will be set.

---

`upset` is also available on [`Ref`](/classes/ref/) and [`Doc`](/classes/doc/):

```ts
const userRef = await db.users.add({ name: "Sasha" });

// Later:
await userRef.upset({ name: "Alexander" });
```

→ [Read more about `upset`](/api/writing/upset/)

## `remove`

To remove a document:

```ts
await db.users.remove(userId);
```

`remove` is also available on [`Ref`](/classes/ref/) and [`Doc`](/classes/doc/):

```ts
const userRef = await db.users.add({ name: "Sasha" });

// Later:
await userRef.remove();
```

→ [Read more about `remove`](/api/writing/remove/)
