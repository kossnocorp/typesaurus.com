---
title: Best practices
sidebar:
  order: 0
---

This document overviews the designing schema section that will help you design your database schema efficiently.

Most of the topics relate to Typesaurus, but it will still be helpful for you if you use the Firestore SDKs directly.

- [`null` over `undefined`](/design/null-over-undefined/) will help you understand the problems with `undefined` and why you should use `null` instead.

- [Interfaces over aliases](/design/interfaces-over-aliases/) will teach why using interfaces is better than type aliases for designing your schema.

- [Field groups](/design/field-groups/) will show you how to use field groups to make your schema more consistent and easier to maintain.

- [Query flags](/design/query-flags/) will teach you how to use query flags to query your data more efficiently.

- [Using arrays](/design/using-arrays/) will build a case for (not) using arrays in your schema.

- [Shared & static ids](/design/shared-and-static-ids/) will teach you when to share ids between collections and when to use static ids.

- [Updatability](/design/updatability/) will demonstrate how to design nested objects to make them updatable and keep data consistent.

- [Security rules](/design/security-rules/) will show you how to design your schema to simplify your security rules.
