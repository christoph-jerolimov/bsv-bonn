import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';
import { glob } from 'astro/loaders';

/**
 * All pages of the website are written as markdown files in `src/content/pages`.
 * The file path defines the URL: `wir/vorstand.md` → `/wir/vorstand/`.
 */
const pages = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/pages' }),
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    /** Shorter title for the browser tab / navigation, defaults to `title`. */
    shortTitle: z.string().optional(),
    /** Shows the "Stand: …" note below the heading. */
    updated: z.coerce.date().optional(),
    /** Hides the sidebar with contact information and upcoming events. */
    hideSidebar: z.boolean().default(false),
    /** Renders the links to the sub pages of this section below the content. */
    sectionNav: z.boolean().default(false),
    /** Renders the upcoming or past events (Termine) below the content. */
    events: z.enum(['upcoming', 'past']).optional(),
  }),
});

/**
 * Events (Veranstaltungen) are stored as individual markdown files in `src/content/termine`.
 * Upcoming events are listed on the "Veranstaltungen" page and in the sidebar,
 * past events on the "Rückblick" page.
 */
const termine = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/termine' }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    endDate: z.coerce.date().optional(),
    time: z.string().optional(),
    location: z.string().optional(),
    /** Events marked with `*` are only open to members and their companions. */
    intern: z.boolean().default(false),
    registration: z.string().optional(),
  }),
});

export const collections = { pages, termine };
