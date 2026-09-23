import { defineCollection, z } from "astro:content";

const projects = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string(),
    subtitle: z.string().optional(),
    date: z.coerce.date(),
    hero: z.string().optional(),
    heroPoster: z.string().optional(),
    category: z.string().optional(),
    team: z.string().optional(),
    instructors: z.string().optional(),
    year: z.number().optional(),
    related: z.string().optional(),
    legacy: z.boolean().default(false),
  }),
});

export const collections = { projects };
