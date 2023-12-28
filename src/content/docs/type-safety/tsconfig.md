---
title: TypeScript config
sidebar:
  order: 1
---

While Typesaurus will work with any TypeScript config, it's recommended to use the following `tsconfig.json`:

```json
{
  "compilerOptions": {
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "exactOptionalPropertyTypes": true
  }
}
```

:::caution[Keep in mind!]
Enabling those options in existing projects might cause a lot of type errors. However, starting using them as soon as possible is recommended to prevent runtime errors and make your code more robust.

To enable them gradually, you can use the [`@ts-expect-error`](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-3-9.html#-ts-expect-error-comments) comment.
:::

:::danger[Prevent runtime errors!]
The [`exactOptionalPropertyTypes`] option is not widely used but is extremely important as it prevents corrupting the data consistency by preventing setting `undefined` to required fields.

Read more about it down below.
:::

## [`exactOptionalPropertyTypes`]

One recommended option [`exactOptionalPropertyTypes`] is not well known, especially to TypeScript beginners, because [`strict`] does not include it. However, it's crucial and will cause runtime errors where you don't expect them.

This option makes such a code invalid and shows a type error:

```ts
interface User {
  firstName: string;
  lastName?: string;
}

const user: User = {
  firstName: "Sasha",
  lastName: undefined,
};
//=> Type '{ firstName: string; lastName: undefined; }' is not assignable to type 'User' with 'exactOptionalPropertyTypes: true'. Consider adding 'undefined' to the types of the target's properties.
//=>    Types of property 'lastName' are incompatible.
//=>      Type 'undefined' is not assignable to type 'string'.(2375)
```

With this option, to allow setting undefined to an optional field, you have to specify it explicitly:

```ts
interface User {
  firstName: string;
  lastName?: string | undefined;
}
```

At first glance, it might seem like a nuisance, but consider the following example:

```ts
function updateUser(data: Partial<User>) {
  Object.assign(user, data);
}

updateUser({ firstName: undefined });
```

The code above would be valid without the option, but it would set the user into an impossible state and ultimately cause runtime errors.

:::tip[Bite the bullet!]
While inconvenient at first, the [`exactOptionalPropertyTypes`] option is worth the effort and will teach you to write better TypeScript. So bite the bullet and enable it!
:::

[`strict`]: https://www.typescriptlang.org/tsconfig#strict
[`exactOptionalPropertyTypes`]: https://www.typescriptlang.org/tsconfig#exactOptionalPropertyTypes
