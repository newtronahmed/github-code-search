import { pgTable, text, serial, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const searches = pgTable("searches", {
  id: serial("id").primaryKey(),
  query: text("query").notNull(),
  results: text("results").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertSearchSchema = createInsertSchema(searches).pick({
  query: true,
  results: true,
});

export type InsertSearch = z.infer<typeof insertSearchSchema>;
export type Search = typeof searches.$inferSelect;

export const searchResultSchema = z.object({
  name: z.string(),
  path: z.string(),
  repository: z.object({
    full_name: z.string(),
    html_url: z.string(),
  }),
  html_url: z.string(),
  content: z.string(),
});

export type SearchResult = z.infer<typeof searchResultSchema>;