import { defineCollection, z } from 'astro:content';

const postsCollection = defineCollection({
  // Type-check del frontmatter con Zod
  schema: ({ image }) => z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.coerce.date(), // Convierte string a objeto Date
    author: z.string(),
    image: z.object({
        url: image(),
        alt: z.string()
    }).optional(), // La imagen es opcional
    tags: z.array(z.string()),
  }),
});

export const collections = {
  'posts': postsCollection,
};