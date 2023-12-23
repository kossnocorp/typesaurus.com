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
            // Each item here is one entry in the navigation menu.
            {
              label: "Example Guide",
              link: "/guides/example/",
            },
          ],
        },
        {
          label: "Reference",
          autogenerate: {
            directory: "reference",
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
