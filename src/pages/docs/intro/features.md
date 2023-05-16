---
layout: "../../../layouts/Docs.astro"
---

# Key features

This document lists key Typesaurus features that make it the best way to use Firestore.

There're two main feature groups - type-safety, which enables data consistency, and developer experience that elevates Firestore to another level and makes it safe and fun to use.

Skip to [Philosophy & architecture](/docs/intro/architecture) to learn about underling principles behind these features.

## General features

### Universal package

Typesaurus provides a unified API for both Web and Admin SDKs enabling seamless code sharing between server and client.

It wraps both [`firebase-admin`] and [`firebase`] and provides single interface that redirects API calls to respective providers.

### JavaScript-native

Typesaurus converts Firestore timestamps to native `Date` instances and preserves document references and `undefined`'s.

### Build size-efficiency

The package is heavily optimized and adds just 4 Kb to the build size.

## Type-safety

### Advanced type-safety

Typesaurus not only provides type-safe access to Firestore, but also ensures that Firestore nuances like [server dates](/docs/advanced/serverdates), undefined→null, etc. are considered and you never step in a pit-hole, and use all advantages of distributed, schema-less database to the fullest.

### Typed ids

Typesaurus makes all document ids typed, not only preventing bugs but also enabling self-documentation of static and shared ids.

## Developer experience

### Centralized schema

You define your database schema in single place allowing you easier understand the structure.

### Single-import principle

We designed Typeusurus so that you'll, most of the time, need only one import to define the schema or use the database.

It makes the API easier to learn and eliminates import hordes even on most busy modules.

---

[Philosophy & architecture →](/docs/intro/architecture)

[`firebase-admin`]: https://github.com/firebase/firebase-admin-node
[`firebase`]: https://github.com/firebase/firebase-js-sdk
