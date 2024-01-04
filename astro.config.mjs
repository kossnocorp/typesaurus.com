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
          label: "Guides",
          items: [
            {
              label: "Get started",
              autogenerate: {
                directory: "get-started",
              },
            },
            {
              label: "Type safety",
              autogenerate: {
                directory: "type-safety",
              },
            },
            {
              label: "Designing schema",
              autogenerate: {
                directory: "design",
              },
            },

            {
              label: "Advanced",
              autogenerate: {
                directory: "advanced",
              },
            },
            {
              label: "Integrations",
              autogenerate: {
                directory: "integrations",
              },
            },
          ],
        },
        {
          label: "About",
          autogenerate: {
            directory: "about",
          },
        },
        {
          label: "Reference",
          items: [
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
            {
              label: "Helpers",
              autogenerate: {
                directory: "helpers",
              },
            },
          ],
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
