---
title: Server dates
sidebar:
  order: 4
  badge: TODO
---

Server date is a special type `Typesaurus.ServerDate` that denotes that the given field can be assigned only on server.

It extendes built-in behavior of [Firestore server timestamps](https://firebase.google.com/docs/firestore/manage-data/add-data#server_timestamp) and adds type-safety.

If you set that a field is a server date, assigning it on client with anything but server date will show an error:

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
  createdAt: $.serverDate(),
  updatedAt: new Date(),
  //         ^^^^^^^^^^ must be ServerDate
}));
```

## Nullable on web

When web sets a server date, if you subscribe to the document, the value of the field for a brief moment will be `null`, which can lead to unhandled exceptions.

That's why, the document data by default will have all server date fields optional, so can handle this case properly in your views.

```ts
db.notes.get(noteId).on((note) => {
  if (!note) return;
  console.log(note.createdAt);
  //          ^^^^^ note might be undefined
});
```

## On server

When working on server, you can pass `{ as: "server" }` as the operation option to let Typesaurus know that dates are safe to use:

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

> Calling `{ as: "server" }` on web will throw an error!
