---
title: Gradual adoption
sidebar:
  order: 10
---

In this doc, we'll cover adopting Typesaurus in existing projects. We'll look at how to describe existing database schema with Typesaurus types.

## Strategy

If you already have a project you want to migrate to Typesaurus, you can do it gradually. You can start by describing your existing schema with Typesaurus types and then migrate the codebase to use Typesaurus.

In the best-case scenario, you'll first type your schema entirely before changing any Firestore operations. If the schema is too big or complex, you can also migrate collections one by one: adding types for a collection, migrating the operations using it, and then moving to the next collection.

## Migrating

Here's an example of a simple real-life database. The top-level properties are the collections, `{fooId}` are the dynamic ids.

```json
{
  "users": {
    "{userId}": {
      "discordId": "123",
      "id": "456"
    }
  },

  "servers": {
    "{serverId}": {
      "logChannelID": "123",
      "logWebhookID": "456",
      "serverID": "789"
    }
  },

  "express-sessions": {
    "{sessionId}": {
      "key": "qwe"
    }
  }
}
```

To convert it to Typesaurus, we'll start by describing the collection types:

```ts
interface User {
  id: string;
  discordId: string;
}

interface Server {
  id: string;
  logChannelID: string;
  logWebhookID: string;
}

interface Session {
  key: string;
}
```

Now, let's describe the schema:

```ts
import { schema } from "typesaurus";

const db = schema(($) => ({
  users: $<User>(),
  servers: $<Server>(),
  "express-sessions": $<Session>(),
}));
```

Now, we can use the `db` object to access the collections:

```ts
const user = await db.users.get(userId);
```

If might noticed that we had to wrap the `express-sessions` collection name in quotes. That's because it's not a valid JavaScript identifier, and the property name is the collection path segment, so we have to use the string literal syntax.

It's not very convenient, especially when accessing the collection:

```ts
const session = await db["express-sessions"].get(sessionId);
```

However, we can use [`$.collection(...).name`](/api/schema#collectionname) to give the collection a valid JavaScript identifier:

```ts
const db = schema(($) => ({
  users: $<User>(),
  servers: $<Server>(),
  sessions: $<Session>().name("express-sessions"),
}));
```

It allows us to have a simple collection name while preserving the original collection path segment:

```ts
const session = await db.sessions.get(sessionId);
```
