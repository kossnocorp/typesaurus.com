---
title: "ADR-1: Handling undefined"
---

This decision record describes how Typesaurus handles `undefined` values.

## Background

In Firestore, like in many languages, including JSON, there's no `undefined` (but there's `null`). By default, it would throw an error on any attempt to write a document with an `undefined` property. That is a problem because one of the central core values of Typesaurus is the lack of runtime errors.

The problem becomes even bigger when you consider that without [`exactOptionalPropertyTypes`](/type-safety/tsconfig/#exactoptionalpropertytypes) TypeScript unions optional properties with `undefined` ([see playground](https://www.typescriptlang.org/play?#code/JYOwLgpgTgZghgYwgAgKoGdrIN4ChnIzBTpgBycAthAFzKlSgDm+yANnKRdQPx0PNcAX1y4YAVxAIwwAPYhk4gA4ATOJAzQAFGrBw6ABThQZcNgB5NUAHwBKHKwDyAIwBWEaQDpO6YExBa4phQADTIunC2ANzCogD0cchkssjQULJQAIS4yroQVlrYhMRcVLSKICoQRCAQKshC0aJgAJ5KKACS6KiV1aB1yAC8aMEA2gDkHKXU4wC6uAmD1vRgjCBMyAA+FVU1daII8qSKwUM4xSTkZXTjAMqcABZw4w1AA)):

```ts
interface User {
  firstName: string;
  lastName?: string;
}

type LastName = User["lastName"];
//=> string | undefined
```

This behavior makes safety checks such as [safe-path updates](/type-safety/safe-paths/) impossible.

But more importantly, Typesaurus could not warn a user trying to specify a collection model with `undefined` property, as any optional property would be considered `undefined`.

## Goals

The main goal of this decision is to prevent runtime errors regardless of the TypeScript configuration.

Another goal is to preserve the type safety and data consistency without compromising the developer experience.

Finally, the solution must be predictable and consistent.

## Considered solutions

### Firestore behavior

One of the obvious options was to follow the Firestore's behavior.

By default, Firestore would throw an error on any attempt to write a document with an `undefined` property. Unfortunately, this behavior is not compatible with the main goal of this decision.

The exception can be prevented by setting the `ignoreUndefinedProperties` option ([Web SDK](https://firebase.google.com/docs/reference/js/firestore_.firestoresettings.md#firestoresettingsignoreundefinedproperties) and [Firebase Admin](https://firebase.google.com/docs/reference/node/firebase.firestore.Settings#optional-ignoreundefinedproperties).) It makes Firestore strip `undefined` values. However, this causes unexpected behavior when updating values with `undefined` values, expecting them to be removed.

Additionally, `undefined` in arrays are not stripped, but replaced with `null`, making the behavior inconsistent and unpredictable.

Neither throwing exceptions nor stripping `undefined`` from objects and replacing them with `null` in arrays are compatible with the goals of this decision, making it a non-viable solution.

### Preserving `undefined`

In the prelease versions of Typesaurus 10, the `undefined` values were preserved by replacing them with a special string `"%%undefined%%`. That allowed us to keep the original model types, making the behavior predictable and consistent on the surface.

However, the solution breaks when you try to consume the data where the Typesaurus is unavailable, like mobile or non-JS backends. It also introduces another inconsistent and unpredictable behavior besides Firestore's, making it a non-viable solution.

### Disallowing `undefined`

Another option was to disallow `undefined` values in the models when defining a collection. It would warn the developer before they got to set `undefined` values.

Unfortunately, it would only work with an unpopular `exactOptionalPropertyTypes` TypeScript option set to `true`, requiring us to fallback to one of the possible solutions.

This discrepancy and the fact that users could eventually adopt said TypeScript option, which completely change the behavior of Typesaurus, making it a non-viable solution.

## The solution

After trying to preserve `undefined` values on real-world projects and dealing with `undefined` values being a string `"%%undefined%%`, I decided to expand the Firestore's `ignoreUndefinedProperties` arrays behavior and replace `undefined` with `null` everywhere, including objects.

That made the behavior consistent and predictable, as it can be expressed with types.

It is compatible with the default Firestore behavior, making it more predictable than other solutions.

The solution utilizes [`Typesaurus.Nullify`](/types/typesaurus/#nullify) helper to convert the passed models to structures with `null` values unioned with `undefined`.

The downside of this solution is that developers sometimes have to use [`Typesaurus.Nullify`](/types/typesaurus/#nullify) helper to accept the data from Typesaurus.

```ts
interface User {
  name: string;
  email?: string | undefined;
}

function sendEmail(user: User) {
  // ...
}

function sendEmailNullified(user: Typesaurus.Nullify<User>) {
  // ...
}

// Without Nullify it would show a type error.
const user = await db.users.get(userId);
if (user) {
  // Type error!
  sendEmail(user.data);
  //=> Type 'null' is not assignable to type 'string | undefined'

  // Ok!
  sendEmailNullified(user.data);
}
```

As a remedy, I [thoroughly](/type-safety/undefined-null/) [documented](/design/null-over-undefined/) the problem with recommendations to avoid using `undefined` and setting the `ignoreUndefinedProperties` option.

---

→ [Read about it in the type-safety guide](/type-safety/undefined-null/)

→ [Read about it in the schema designing guide](/design/null-over-undefined/)

→ [Read more about `Nullify`](/types/typesaurus/#nullify)
