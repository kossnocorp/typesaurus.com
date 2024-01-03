---
title: Security rules
sidebar:
  order: 9
---

When designing your schema, you should always keep in mind how you will secure the data.

You might think that as you display organization team members as a list, it should be an array in the schema, but that's not the case.

When you try to check if the specific document that belongs to the organization can be read by the current user, you'll find it's not possible. Firestore security rules don't allow such a query.

:::tip[Arrays are tricky!]
Arrays are tricky, and you should use them with caution. Read more about [using arrays](/design/using-arrays/).
:::

A better approach would be to have it as a map:

```ts
interface Organization {
  team: Record<Schema["users"]["Id"], Membership>;
}

interface Membership {
  // Query flag!
  member: boolean;
  role: Role;
}

type Role = "admin" | "member";
```

So the security rule will look like this:

```
match /projects/{resourceId} {
  allow read, write: if get(/databases/$(database)/documents/organizatons/$(resourceId)).data.team[request.auth.uid].member == true;
}
```

Here, we let users read and write the organization projects if they are members.

→ [Learn about query flags](/design/query-flags/)

---

In case when you want to limit write access to parts of a document, grouping writable fields into a [field group](/design/field-groups/) will help you:

```
match /organizatons/{resourceId} {
  allow update: if resource.data.team[request.auth.uid].role == "admin"
    && request.resource.data.diff(resource.data).affectedKeys().hasOnly(["team", "settings"])
}
```

Here, we allow only admins to update the team and settings fields, but not the other fields that can be system-generated or must be updated by the server.

:::tip[Don't split documents!]
You might think splitting documents will eliminate the problem, but fetching two documents instead of one will degrade the user experience and increase the cost. Security rules are the way to go.
:::
