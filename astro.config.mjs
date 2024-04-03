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
      favicon: "/logo.png",
      head: [
        // Trying Plausible (trial ends April 16 2024)
        {
          tag: "script",
          attrs: {
            defer: true,
            "data-domain": "typesaurus.com",
            src: "https://plausible.io/js/script.js",
          },
        },
      ],
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
          label: "Reference",
          items: [
            {
              label: "API",
              items: [
                {
                  label: "schema",
                  link: "/api/schema",
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
                  label: "Misc",
                  autogenerate: {
                    directory: "api/misc",
                  },
                },
              ],
            },
            {
              label: "Extensions",
              autogenerate: {
                directory: "extensions",
              },
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
        // TODO: Do it one day
        // {
        //   label: "About",
        //   autogenerate: {
        //     directory: "about",
        //   },
        // },
        {
          label: "Architecture",
          items: [
            {
              label: "Decisions",
              autogenerate: {
                directory: "decisions",
              },
            },
          ],
        },
      ],
      editLink: {
        baseUrl: "https://github.com/kossnocorp/typesaurus.com/edit/main/",
      },
      components: {
        ThemeSelect: "./src/overrides/ThemeSelect.astro",
      },
    }),
    tailwind({
      applyBaseStyles: false,
    }),
  ],
});
