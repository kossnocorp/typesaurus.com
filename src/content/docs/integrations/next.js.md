---
title: Next.js
sidebar:
  order: 2
---

Typesaurus works well with Next.js. It can be used both on the client and the server, including [React Server Components](https://nextjs.org/docs/app/building-your-application/rendering/server-components).

## Client-side

For the client and SSR, please see [the React integration docs](/integrations/react/), as everything there applies to Next.js as well.

## Server-side & RSC

It gets a bit trickier for the server-side and React Server Components.

To make it work, initialize and export the Firebase Admin SDK in a separate file. Then, you have to import it from your Next.js pages and API routes.

```ts
import * as admin from "firebase-admin";

// Because of hot-reloading, this file is executed multiple times by Next.js
if (!admin.apps.length)
  admin.initializeApp({
    // If GOOGLE_APPLICATION_CREDENTIALS_JSON is set, use it to initialize the
    // admin SDK.
    ...(process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON && {
      credential: admin.credential.cert(
        JSON.parse(process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON),
      ),
    }),
  });

// Export the admin client, so you can use it
export { admin };
```

You'll need to set `GOOGLE_APPLICATION_CREDENTIALS_JSON` environment variable to the Firebase Admin SDK credentials JSON. You can get it from the Firebase console. Follow instructions from official [Firebase Admin SDK docs](https://firebase.google.com/docs/admin/setup#initialize_the_sdk_in_non-google_environments).

:::caution[Don't use .env!]
Don't commit the credentials to the repo! If you're using Vercel, you can set the environment variable in the project settings. For local enviro
:::

Also note that because of Next.js hot-reloading, the file is executed multiple times. That's why we check if the SDK is already initialized.

---

For example, here we create a post on `POST` request (`app/posts/route.ts`):

```ts
import { NextRequest, NextResponse } from "next/server";
// Always import the SDK initialization
import "YOUR_INIT_LOCATION";
// Import your db
import { db } from "YOUR_DB_LOCATION";

export async function POST(request: NextRequest) {
  // Don't forget to validate the body!
  await db.posts.add(request.body);
  return new NextResponse("OK");
}
```

And here we render the posts in a React Server Component (`app/posts/page.tsx`):

```tsx
import { NextRequest, NextResponse } from "next/server";
// Always import the SDK initialization
import "YOUR_LOCATION";
// Import your db
import { db } from "YOUR_LOCATION";

export default function PostsPage() {
  const posts = await db.posts.query(($) => $.field("published").eq(true));

  return (
    <ul>
      {posts.map((post) => (
        <li key={post.ref.id}>
          <a href={`/posts/${post.ref.slug}`}>
            <h2>{post.data.title}</h2>
            <p>{post.data.summary}</p>
          </a>
        </li>
      ))}
    </ul>
  );
}
```

:::caution[Don't forget about security rules!]
Remember that when reading data in a server component, you have unrestricted access to the database. Make sure you authorize the user access when necessary before rendering the component.
:::

You can use the root layout to import the SDK, so you don't have to do it in every page (`app/layout.tsx`):

```tsx
// Import the SDK initialization
import "YOUR_LOCATION";

export default function RootLayout({ children }: React.PropsWithChildren) {
  return (
    <html>
      <head />
      <body>{children}</body>
    </html>
  );
}
```
