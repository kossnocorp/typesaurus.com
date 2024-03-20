---
title: Sharing functionality
sidebar:
  order: 10
---

**⚠️ Available starting with v10.3.0**

Often, multiple documents have a shared shape, and it's convenient to share functionality across them. For example, you might want a function that renames a user or a profile. For that purpose, Typesaurus provides a set of types and methods that enable sharing of functionality across the refs and docs in a type-safe way.

```ts
export interface NameFields {
  firstName: string;
  lastName: string;
}

function rename(entity: Typesaurus.Entity<NameFields>, name: string) {
  const [firstName = "", lastName = ""] = name.split(" ");
  return entity.update({ firstName, lastName });
}

rename(user.as<NameFields>());
```

In this example, [the `as` method](/api/misc/as/) checks that the user extends `NameField`. It would resolve `unknown` if the user model weren't compatible with `NameFields`, triggering a type error:

```ts
rename(post.as<NameFields>());
// Argument of type 'unknown' is not assignable to parameter of type 'SharedEntity<NameFields>'.ts(2345)
```

On the function side, we use [`Typesaurus.Entity`](/types/typesaurus/#sharedentity) type that unions [`Typesaurus.Ref`](/types/typesaurus/#sharedref) and [`Typesaurus.Doc`](/types/typesaurus/#shareddoc). These shared types narrow the data type to the given shape (i.e. `NameFields`) and limit the available methods to the ones that don't depend on the full type of the model. The `set`, `upset`, and `as` methods are stripped to prevent data inconsistencies.

---

→ [Read more about the `as` method](/api/misc/as/)

→ [Read more about the `Typesaurus.Entity` type](/types/typesaurus/#sharedentity)

→ [Read more about the `Typesaurus.Ref` type](/types/typesaurus/#sharedref)

→ [Read more about the `Typesaurus.Doc` type](types/typesaurus/#shareddoc)

→ [Read the architecture decision record (ADR-2)](/decisions/adr-2-sharing/)
