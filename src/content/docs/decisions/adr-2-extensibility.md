---
title: "ADR-2: Extensibility"
---

This decision record describes how Typesaurus handles adding and sharing functionality to the refs, docs and collections.

## Background

The most basic way to add functionality to a Typesaurus entity is to accept it as an argument, i.e.:

```ts
function renameUser(
  user: Schema["users"]["Doc"] | Schema["users"]["Ref"],
  name: string,
) {
  const [firstName, lastName] = name.split(" ");
  return user.update({ firstName, lastName });
}
```

This approach is simple and works well for small projects. However, a big database sharing the same functionality across multiple entities would require a lot of code duplication as trying to work with entities of different shapes will result in a type error:

```ts
function rename(
  user:
    | Schema["users"]["Doc"]
    | Schema["users"]["Ref"]
    | Schema["profiles"]["Doc"]
    | Schema["profiles"]["Ref"],
  name: string,
) {
  const [firstName, lastName] = name.split(" ");
  return user.update({ firstName, lastName });
  //=> This expression is not callable.
  //=> Each member of the union type 'DocFunction<CollectionDef<"users", User, false, false, false>> | DocFunction<CollectionDef<"profiles", Profile, false, false, false>>' has signatures, but none of those signatures are compatible with each other.ts(2349)
}
```

Even though the collections extend the same interface, for TypeScript the `update` signatures aren't compatible with each other:

```ts
interface NameFields {
  firstName: string;
  lastName: string;
}

interface User extends NameFields {
  age: number;
  email: string;
}

interface Profile extends NameFields {
  userId: string;
  bio: string;
  avatar: string;
}
```

While it's possible to use generics to accept a shared shape instead (`NameFields` in our example), because the entity types are very complex it doesn't work well in practice.

It will break either when passing entities to such a function:

```ts
function rename(
  entity: Typesaurus.Doc<NameFields> | Typesaurus.Ref<NameFields>,
  name: string,
) {
  const [firstName = "", lastName = ""] = name.split(" ");
  return entity.update({ firstName, lastName });
}

rename(user, "Sasha Koss");
//=> Argument of type 'Doc<CollectionDef<"users", User, false, false, false>, DocProps & { environment: RuntimeEnvironment; }>' is not assignable to parameter of type 'Doc<NameFields, any, any, NameFields, DocDefFlags> | Ref<NameFields, any, any, NameFields, DocDefFlags>'.
//=>   ...
//=>     Type '{ firstName: string; lastName: string; }' is not assignable to type '{ age: number; email: string; firstName: string; lastName: string; }'.ts(2345)
rename(profile, "Sasha Koss");
//=> Argument of type 'Doc<CollectionDef<"profiles", Profile, false, false, false>, DocProps & { environment: RuntimeEnvironment; }>' is not assignable to parameter of type 'Doc<NameFields, any, any, NameFields, DocDefFlags> | Ref<NameFields, any, any, NameFields, DocDefFlags>'.
//=>   ...
//=>     Type '{ firstName: string; lastName: string; }' is not assignable to type '{ userId: string; bio: string; avatar: string; firstName: string; lastName: string; }'.ts(2345)
```

...or the function itself:

```ts
function rename<Model extends NameFields>(
  entity: Typesaurus.Doc<Model> | Typesaurus.Ref<Model>,
  name: string,
) {
  const [firstName = "", lastName = ""] = name.split(" ");
  return entity.update({ firstName, lastName });
  //=> Argument of type '{ firstName: string; lastName: string; }' is not assignable to parameter of type 'Arg<Def<Model, any, any, Model, DocDefFlags>, DocProps & { environment: RuntimeEnvironment; }>'.
  //=>   Types of property 'firstName' are incompatible.
  //=>     Type 'string' is not assignable to type 'WriteField<UnionVariableModelType<NullifyModel<Model>>, "firstName", UnionVariableModelType<NullifyModel<Model>>["firstName"], DocProps & { ...; }> | WriteField<...> | undefined'.ts(2345)
}

rename(user, "Sasha Koss");
rename(profile, "Sasha Koss");
```

Even if it worked, it would open the door to data inconsistencies as the collections wouldn't know about the actual shape:

```ts
function add(
  entity: Typesaurus.Doc<NameFields> | Typesaurus.Ref<NameFields>,
  name: string,
) {
  const [firstName = "", lastName = ""] = name.split(" ");
  const colleciton =
    "collection" in entity ? entity.collection : entity.ref.collection;
  // Data inconsistency as both User and Profile have more required fields:
  return colleciton.add({ firstName, lastName });
}
```

## Goals

The goal is to allow extending the entities with shared functionality without code duplication and data inconsistencies.

The solution must preserve the full type safety and be tree-shakable so the unused functionality doesn't end up in the production bundle.

Finally, the solution should be easy to use and understand.

## Considered options

### Mixing into `schema`

The most straightforward way to add functionality to the entities would be to mix in the functionality while defining the collections:

```ts
const db = schema(($) => ({
  users: $.collection<User>([NameMixin, EmailMixin]),
  profiles: $.collection<Profile>([NameMixin, AvatarMixin]),
}));
```

So when you get a document or a reference from the collection, it would have the mixed-in functionality:

```ts
const user = await db.users.get(userId);
await user?.rename("Sasha Koss");
```

Then, the `$.collection` method will check the compatibility of the mixins and the collection's schema, thus providing the type safety.

Without narrowing down the type, the data inconsistency won't be an issue.

However, with this approach, the mixing-in happens at the schema level, pulling all the necessary functionality into the production bundle, even if it's not used. Furthermore, the server code might leak into the client code, opening a security hole.

A solution to this problem could be separate schema definition and mixing-in by creating enriched versions of the database instance separately for the client and server. Three database versions will make code more complex and reduce reusability as the server and client code must be written independently, essentially defeating the purpose.

## The solution

TODO
