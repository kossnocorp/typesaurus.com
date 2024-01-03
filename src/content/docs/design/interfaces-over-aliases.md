---
title: Interfaces over aliases
sidebar:
  order: 2
---

Interfaces and type aliases in TypeScript are very similar, and you can use them interchangeably. However, some differences tip the scales in favor of interfaces.

## Why prefer interfaces

First of all, errors in interfaces produce better error messages, [for example](https://www.typescriptlang.org/play?#code/PTAEBUAsFMCdtAQ3qALgdwPagLaIJYB2ammANgM4mgAm0AxmcgqjKBZIgA4KYBmSQgCgQoTACMAVg1QAuUEVRw+ietCqJCNNAE8eSMvkQV1AOhHALEGDqQoAbnFsV8OfE1gAaQdr6ZYaGw4mBSooPSYOMHE9MbqVqphrAgUiDjQ5kKoeggAQviwNOA5oAC8oADeQqCg6EQA5hTyAEwA3EIAvu1CisqqeQU0AJKESrAqapXVtQ1NoG2dQkIRhKGg4oMAjPL5hcX65RUzhI0toF3LmKthG4XNO4MjYxMIh8en8+fdorkMiACuJggOQAyvRYPguGF8Bp2KhYP96Kh-rBEGRdPoKDpQtAcJ4rPhUAByKhcEIucRkFjYXqwNwAD0C0AKoEB1MwmRWa1uNAAzA9Ck8+pNyjzNt8wFBoLZxJhWOx-lwybAwtB6UotA0xMkArSXhotBizFZ9gg0UYTFQaNhWDDQPYjApRnATEj8FcjRRvOhIO5oATneN+lROI4kKAANbSrCFTLZfQAeXQ6LehEwSJRhDR8nh-wQHVAADJQLsijl2vGEAAlCREMqVUBpjOwLNkeQqSj5oslx6Bl7dPX9UAABWgqnTEdAao1NCopdNUxqETImBRfH+bbQCOg7RqfEM6nbaJM7Q6PT7Q4Awr76FHiNPoFo573nkOqkvyKvxhuj53d6B93wQ8AOPHdFiEKkwkwZN5CTFMGzqE45mabwm2RFtsy3PMvgg6AwnoG873ka98FvR96yORCPhQ8JPzXH8QM7bxAOAjsgQuE1ODCVJ8Bob0EHgCIokfbQdFXVkgUHNQqEwRwAkrBJDDiChTFAEEeHofA+FItEyB0bxxD+NlQDE-4ZjIdF6jw9Y8LGKdYFgfwrHSChUislTQCGARTNASBZLgMQ5KZADyBXKj7Mc2AvRM8TYmEUQTAQPz0GBHgwQhKFwk0UAuEch06DQF0As0bRghQPx6DZGhnPUNz1FqGBiBjCMtTqeUpPqwwo1AEiyMITJoPggjSLvdphr6+tBolUAE0IBA8EkfxaC0vg4EfSZDIwaByMrAwLXq+wqA6igEhQVhEGhC9pLsXgeGIEqjT25SbvCFcTBocxRCgO10k0KgfLiqd1REwQnVfDbbDoRhkC1QkEnYBgrm0VBXAyJYOtAABpQkNUXHKUSi+RZXIMdCFPdGroQbHUFx99aJXFF5FCCETnJqwRmCuUYACWIgUQR64rTG4EAIzQrO0VdUBcAr+AJKXaAYDwLvdfqll24dFS4WxDmmZd-CZ+EGlPbp1c17W8dQTBsXkQh-hwQzYGNpZRAAEWgO6aC1D1TICepMGPbxbStFa1sISYIg3bRDKQKwyRcFGwyW-m5vqZXHFUgAJaDoCCvwAi4f5KVIvSgbj6BqtEStosJElw02uzYgs6g8G65IcFBjrMlEWbeAEZIbLWeAKC-a684R5kTgMdF+GC8urKsXn6uQVdDSr+0jsp6Kg7hVRJ388YwqsVh4EQbQ7X5v3MG0LgmEmS2d5VWRnbASAaa4JoQFCXf9-3aDTCE4AABHPMoQVYUGALyAA7M0XkUDeQAFZgBV3BJCVAABaY6aDDpoKrsAeBzQABsAAOZopCAAMABifBxDSHNDIUIIAA):

```ts
// Owl is a type alias (see example link)
const owl: Owl = { wings: 2, nocturnal: true };

// Chicken is an interface
const chicken: Chicken = { wings: 2, colourful: false, flies: false };

// Alias error:
owl = chicken;
//=> Type 'Chicken' is not assignable to type 'Owl'.
//=>   Property 'nocturnal' is missing in type 'Chicken' but required in type '{ nocturnal: true; }'.

// Interface error:
chicken = owl;
//=> Type 'Owl' is missing the following properties from type 'Chicken': colourful, flies
```

Another one is [extending interfaces has better performance than intersecting aliases](https://github.com/microsoft/TypeScript/wiki/Performance#preferring-interfaces-over-intersections).

Finally, while type aliases give more flexibility, it's a bad thing when it comes to designing a database schema. Interfaces will make your code easier to read and maintain.

They will even force you to use best practices, as [with the field groups](/design/field-groups/):

For example, this would be the most intuitive way to define a post with a soft delete when using type aliases:

```ts
type Post = {
  text: string;
} & (
  | {}
  | {
      deletedAt: Date;
      deletedBy: string;
    }
);
```

However, interfaces don't support intersections, so you'll have to use [field groups](/design/field-groups/) that are ultimately better readability and type-safety-wise:

```ts
interface Post {
  text: string;
  deleted?: SoftDeleted;
}

interface SoftDeleted {
  at: Date;
  by: string;
}
```

→ [Read more about field groups](/design/field-groups/)

## When to use type aliases

While interfaces are preferable, type aliases are still viable when defining a database schema, for example:

```ts
interface Post {
  text: string;
  state: PostState;
}

// We use type alias to define a union type
type PostState = PostStateActive | PostStateDeleted;

interface PostStateActive {
  type: "active";
}

interface PostStateDeleted {
  type: "deleted";
  at: Date;
}
```

In the example above, we use a type alias to define a union type `PostState`, which helps us define variable post state.

:::tip[It's not only about the database schema!]
Those things apply to any TypeScript code, not only to the database schema. Unless you have conflicting code style that you don't want to change, prefer interfaces over type aliases unless you need a union type or a generic-heavy intersection type.
:::

→ [Read about the differences between aliases and interfaces](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#differences-between-type-aliases-and-interfaces)
