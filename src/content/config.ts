import { defineCollection, z } from "astro:content";
import { docsSchema, i18nSchema } from "@astrojs/starlight/schema";

export const collections = {
  docs: defineCollection({ schema: docsSchema() }),
  i18n: defineCollection({ type: "data", schema: i18nSchema() }),
  blog: defineCollection({
    type: "content",
    schema: z.object({
      title: z.string(),
      description: z.string(),
      pubDate: z.coerce.date(),
      updatedDate: z.coerce.date().optional(),
      heroImage: z.string().optional(),
    }),
  }),
};
