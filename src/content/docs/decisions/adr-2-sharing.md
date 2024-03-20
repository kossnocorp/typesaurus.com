---
title: "ADR-2: Sharing functionality across entities"
---

This decision record describes how Typesaurus enables sharing functionality across the refs and docs.

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

This approach is simple and works well for small projects. However, a big database sharing the same functionality across multiple entities would require a lot of code duplication, as trying to work with entities of different shapes will result in a type error:

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

Even though the collections extend the same interface, for TypeScript, the `update` signatures aren't compatible with each other:

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

While it's possible to use generics to accept a shared shape instead (`NameFields` in our example), it opens the door to data inconsistencies as the entities don't know about the actual shape:

```ts
function add(
  entity: Typesaurus.Doc<NameFields> | Typesaurus.Ref<NameFields>,
  name: string,
) {
  const [firstName = "", lastName = ""] = name.split(" ");
  // Data inconsistency as both User and Profile have more required fields:
  return entity.set({ firstName, lastName });
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

The data inconsistency won't be an issue without narrowing down the type.

However, with this approach, the mixing-in happens at the schema level, pulling all the necessary functionality into the production bundle, even if it's not used. Furthermore, the server code might leak into the client code, opening a security hole.

A solution to this problem could be separate schema definition and mixing-in by creating enriched versions of the database instance separately for the client and server. However, three database versions will make code more complex and reduce reusability, forcing developers to write the server and client code independently and defeating the purpose.

### Stripping the type

Before v10, Typesaurus entities used to be simple objects without any methods and, hence, a smaller type surface. Because of that, it was easier to ensure the compatibility of the shared functions:

```ts
function rename(
  entity: Typesaurus.Doc<NameFields> | Typesaurus.Ref<NameFields>,
  name: string,
) {
  const [firstName = "", lastName = ""] = name.split(" ");
  return update(entity, { firstName, lastName });
}
```

Without rewriting the whole library back to this architecture (and creating many other problems), a way to approach this would be to create a set of methods emulating this behavior:

```ts
rename(user.strip(), "Sasha");
```

With the `strip` method and set of functions like `update` that now accept the stripped entities, it would be possible to share the functionality across the entities without breaking the types.

Data inconsistency would be impossible without the `add`, `set`, and `upset` methods.

However, this approach would introduce an additional API style, increasing the API surface and adding complexity and friction by forcing developers to choose between the two styles.

## The solution

The solution to the problem that addresses all the goals is to provide a function that resolves a narrowed version of the entity as long as the passed shape is compatible with the entity's shape:

```ts
function rename(entity: Typesaurus.SharedEntity<NameFields>, name: string) {
  const [firstName = "", lastName = ""] = name.split(" ");
  return entity.update({ firstName, lastName });
}

const user = await db.users.get(userId);
user && (await rename(user.as<NameFields>(), "Sasha Koss"));
```

If the entity's shape is incompatible with the passed shape, the `as` method will resolve `unknown`, triggering a type error:

```ts
const post = await db.posts.get(postId);
post && (await rename(post.as<NameFields>(), "Sasha Koss"));
// Argument of type 'unknown' is not assignable to parameter of type 'SharedEntity<NameFields>'.ts(2345)
```

The methods that cause data inconsistencies don't exist on the narrowed entity solving the problem:

```ts
function rename(entity: Typesaurus.SharedEntity<NameFields>, name: string) {
  const [firstName = "", lastName = ""] = name.split(" ");
  return entity.set({ firstName, lastName });
  //=> Property 'set' does not exist on type 'SharedDoc<NameFields>'.ts(2339)
}
```
