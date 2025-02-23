import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { Octokit } from "@octokit/rest";
import { searchResultSchema } from "@shared/schema";
import { z } from "zod";
import { enhanceSearchQuery, analyzeCode } from "./utils/ai";

if (!process.env.GITHUB_TOKEN) {
  throw new Error("GITHUB_TOKEN environment variable is required");
}

const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN
});

export async function registerRoutes(app: Express): Promise<Server> {
  app.get("/api/search", async (req, res) => {
    try {
      const userQuery = z.string().min(1).parse(req.query.q);

      // Enhance the search query using AI
      console.log(`Original search query: ${userQuery}`);
      const enhancedQuery = await enhanceSearchQuery(userQuery);
      console.log(`Enhanced search query: ${enhancedQuery}`);

      const searchResponse = await octokit.rest.search.code({
        q: enhancedQuery,
        per_page: 10,
      });

      console.log(`Found ${searchResponse.data.items.length} results`);
      const results = await Promise.all(
        searchResponse.data.items.map(async (item) => {
          try {
            const blob = await octokit.rest.repos.getContent({
              owner: item.repository.owner.login,
              repo: item.repository.name,
              path: item.path,
            });

            const content = 'content' in blob.data ? 
              Buffer.from(blob.data.content, 'base64').toString() :
              '';

            return searchResultSchema.parse({
              name: item.name,
              path: item.path,
              repository: {
                full_name: item.repository.full_name,
                html_url: item.repository.html_url,
              },
              html_url: item.html_url,
              content: content,
            });
          } catch (error) {
            console.error(`Failed to fetch content for ${item.path}:`, error);
            return null;
          }
        })
      );

      // Filter out any failed fetches
      const validResults = results.filter((r): r is NonNullable<typeof r> => r !== null);

      // Save search and results to database
      await storage.saveSearch({
        query: userQuery,
        results: JSON.stringify(validResults)
      });

      res.json(validResults);
    } catch (error) {
      console.error("Search error:", error);
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid search query" });
      } else if ('status' in (error as any) && (error as any).status === 403) {
        res.status(403).json({ message: "GitHub API rate limit exceeded" });
      } else if ('status' in (error as any)) {
        res.status((error as any).status).json({ message: "GitHub API error" });
      } else {
        res.status(500).json({ message: "Failed to search GitHub" });
      }
    }
  });

  app.post("/api/analyze", async (req, res) => {
    try {
      const { code, language } = z.object({
        code: z.string().min(1),
        language: z.string().min(1),
      }).parse(req.body);

      const analysis = await analyzeCode(code, language);
      res.json({ analysis });
    } catch (error) {
      console.error("Analysis error:", error);
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid request body" });
      } else {
        res.status(500).json({ message: "Failed to analyze code" });
      }
    }
  });

  app.get("/api/recent-searches", async (_req, res) => {
    try {
      const searches = await storage.getRecentSearches();
      res.json(searches);
    } catch (error) {
      console.error("Recent searches error:", error);
      res.status(500).json({ message: "Failed to fetch recent searches" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}