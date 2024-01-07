---
title: Server dates
sidebar:
  order: 4
---

Server date is a special type [`Typesaurus.ServerDate`](/types/typesaurus/#serverdate) that denotes that the given field can only be assigned by the database itself.

It extends the built-in behavior of [Firestore server timestamps](https://firebase.google.com/docs/firestore/manage-data/add-data#server_timestamp), resolves to `Date`, and adds type-safety.

If you set a field to a server date, assigning it on the client with anything but the special server date value will show an error:

```ts
import { schema, Typesaurus } from "typesaurus";

const db = schema(($) => ({
  notes: $.collection<Note>(),
}));

interface Note {
  createdAt: Typesaurus.ServerDate;
  updatedAt?: Typesaurus.ServerDate;
}

db.notes.add(($) => ({
  // Good!
  createdAt: $.serverDate(),
  updatedAt: new Date(),
  //         ^^^^^^^^^^ must be ServerDate
}));
```

The `$.serverDate` helper is available in all write methods: [`add`](/api/writing/add/#serverdate), [`set`](/api/writing/set/#serverdate), [`update`](/api/writing/update/#serverdate), and [`upset`](/api/writing/assign/#serverdate).

## Nullable on web

When a client sets a server date, and you're subscribed to the document, the value of the field for a brief moment will be `null`, which can lead to unhandled exceptions.

That's why the document data, by default, will have all server date fields optional so that you can handle this case properly in your UI code.

```ts
db.notes.get(noteId).on((note) => {
  if (!note) return;
  console.log(note.createdAt);
  //          ^^^^^ note might be undefined
});
```

## On server

When working on the server, you can pass `{ as: "server" }` as the operation option to let Typesaurus know that dates are safe to use:

```ts
const noteRef = await db.notes.get(noteId, { as: "server" });

console.log(noteRef.data.createdAt);
// OK! Look, no ?. -----^

noteRef.update({ updatedAt: new Date() });
// OK! Look, new Date() ----^

db.notes.update(noteId, { updatedAt: new Date() }, { as: "server" });
db.notes.update(noteId, { updatedAt: new Date() });
//                                   ^^^^^^^^^^ must be ServerDate
```

:::caution[Be aware!]
Calling `{ as: "server" }` on client will throw an error!
:::

## Normalizing server dates

When working with the database types, you might want to normalize server dates to `Date` so you can use them in your code so that you don't get a type error:

```ts
import type { Typesaurus } from "typesaurus";

interface Log {
  at: Typesaurus.ServerDate;
  message: string;
}

function print(log: Log) {
  console.log(log.at, log.message);
}

print({ at: new Date(), message: "Hello" });
//=> Property '[serverDateBrand]' is missing in type 'Date' but required in type 'ServerDate'
```

To do that, you can use the `Typesaurus.NormalizeServerDates` helper type:

```ts
type NormalizedLog = Typesaurus.NormalizeServerDates<Log>;

function print(log: NormalizedLog) {
  console.log(log.at, log.message);
}

// Ok!
print({ at: new Date(), message: "Hello" });
```

That will allow you to reuse database types in your code and keep the type safety.
