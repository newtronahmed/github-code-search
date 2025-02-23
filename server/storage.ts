import { searches, type Search, type InsertSearch } from "@shared/schema";
import { db } from "./db";

export interface IStorage {
  saveSearch(search: InsertSearch): Promise<Search>;
  getRecentSearches(): Promise<Search[]>;
}

export class DatabaseStorage implements IStorage {
  async saveSearch(search: InsertSearch): Promise<Search> {
    const [result] = await db
      .insert(searches)
      .values(search)
      .returning();
    return result;
  }

  async getRecentSearches(): Promise<Search[]> {
    return await db
      .select()
      .from(searches)
      .orderBy(searches.createdAt)
      .limit(10);
  }
}

export const storage = new DatabaseStorage();