import { z } from "zod";

export const contentIntentSchema = z.enum(["problem", "comparison", "question"]);

export const citationSchema = z.object({
  title: z.string().min(2),
  url: z.string().url(),
  publisher: z.string().min(2).optional(),
  publishedAt: z.string().optional(),
  author: z.string().optional(),
});

export const keyStatSchema = z.object({
  label: z.string().min(2),
  value: z.string().min(1),
  sourceUrl: z.string().url(),
  sourceLabel: z.string().min(2).optional(),
});

export const alternativeSchema = z.object({
  name: z.string().min(2),
  href: z.string().min(1),
  summary: z.string().min(10),
});

export const contentFrontmatterSchema = z.object({
  title: z.string().min(5),
  description: z.string().min(30),
  slug: z.string().optional(),
  primaryKeyword: z.string().min(2),
  secondaryKeywords: z.array(z.string().min(2)).default([]),
  intent: contentIntentSchema,
  cluster: z.string().min(2),
  hubSlug: z.string().min(1),
  lastUpdated: z.string().min(8),
  reviewedBy: z.string().min(2),
  citations: z.array(citationSchema).default([]),
  question: z.string().min(8).optional(),
  shortAnswer: z.string().optional(),
  tldr: z.array(z.string().min(8)).default([]),
  keyStats: z.array(keyStatSchema).default([]),
  alternatives: z.array(alternativeSchema).default([]),
  minWordCount: z.number().int().positive().default(450),
  uniqueValue: z.array(z.string().min(5)).default([]),
});

export const parseFrontmatter = (input) => contentFrontmatterSchema.parse(input);

export const safeParseFrontmatter = (input) =>
  contentFrontmatterSchema.safeParse(input);
