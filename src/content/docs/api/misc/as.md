---
title: as
sidebar:
  order: 2
---

**⚠️ Available starting with v10.3.0**

The method checks that the entity's method is compatible with the provided type and casts `this` to shared entity type. It's available on [`Ref`](/classes/ref/#as) and [`Doc`](/classes/doc/#as).

```ts
export interface NameFields {
  firstName: string;
  lastName: string;
}

function rename(entity: Typesaurus.SharedEntity<NameFields>, name: string) {
  const [firstName = "", lastName = ""] = name.split(" ");
  return entity.update({ firstName, lastName });
}

// Check that the user model is compatible with `NameFields`
rename(userDoc.as<NameFields>());
```

The method returns `this` casted to [`Typesaurus.SharedRef`](/types/typesaurus/#sharedref) or [`Typesaurus.SharedDoc`](/types/typesaurus/#shareddoc).

:::caution[It always returns this]
The method always returns `this` regardless of the compatibility with the provided type. Running this method with type errors might result in inconsistent document data
:::

→ [Read more about sharing functionality](/type-safety/sharing/)
