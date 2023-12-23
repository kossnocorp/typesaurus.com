import { defineConfig } from "astro/config";
import starlight from "@astrojs/starlight";

import tailwind from "@astrojs/tailwind";

// https://astro.build/config
export default defineConfig({
  site: "https://typesaurus.com",
  integrations: [
    starlight({
      title: "Typesaurus",
      logo: {
        src: "./src/assets/logo.png",
      },
      customCss: [
        // Tailwind globals
        "./src/global.css",
        // Fonts
        "@fontsource-variable/inter",
        "@fontsource-variable/martian-mono",
      ],
      social: {
        github: "https://github.com/kossnocorp/typesaurus",
      },
      sidebar: [
        {
          label: "Get started",
          items: [
            {
              label: "Quickstart",
              link: "/get-started",
              badge: "TODO",
            },
            {
              label: "Basics",
              autogenerate: {
                directory: "get-started/basics",
              },
            },
            {
              label: "Further reading",
              autogenerate: {
                directory: "get-started/further-reading",
              },
            },
          ],
        },
        {
          label: "Advanced",
          items: [
            {
              label: "Core",
              autogenerate: {
                directory: "advanced/core",
              },
            },
            {
              label: "Extensions",
              autogenerate: {
                directory: "advanced/extensions",
              },
            },
          ],
        },
        {
          label: "Integrations",
          autogenerate: {
            directory: "integrations",
          },
        },
        {
          label: "API",
          items: [
            {
              label: "schema",
              link: "/api/schema",
              badge: "TODO",
            },
            {
              label: "Reading data",
              autogenerate: {
                directory: "api/reading",
              },
            },
            {
              label: "Writing data",
              autogenerate: {
                directory: "api/writing",
              },
            },
            {
              label: "Extensions",
              autogenerate: {
                directory: "api/extensions",
              },
            },
            {
              label: "Constructors",
              autogenerate: {
                directory: "api/constructors",
              },
            },
          ],
        },
        {
          label: "Classes",
          autogenerate: {
            directory: "classes",
          },
        },
        {
          label: "Types",
          autogenerate: {
            directory: "types",
          },
        },
      ],
      editLink: {
        baseUrl: "https://github.com/kossnocorp/typesaurus.com/edit/main/",
      },
    }),
    tailwind({
      applyBaseStyles: false,
    }),
  ],
});
