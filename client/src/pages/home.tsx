import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { SearchBar } from "@/components/search-bar";
import { CodeResults } from "@/components/code-results";
import { Card } from "@/components/ui/card";
import { Search } from "lucide-react";
import type { SearchResult } from "@shared/schema";

export default function Home() {
  const [query, setQuery] = useState("");

  const { data, isLoading, error } = useQuery<SearchResult[]>({
    queryKey: [`/api/search?q=${encodeURIComponent(query)}`, query],
    enabled: query.length > 0,
  });

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
            GitHub Code Search
          </h1>
          <p className="text-muted-foreground text-lg">
            Search for code samples using natural language
          </p>
        </div>

        <Card className="p-6">
          <SearchBar onSearch={setQuery} />

          {!query && (
            <div className="text-center py-12">
              <Search className="w-12 h-12 mx-auto text-muted-foreground/50" />
              <p className="text-muted-foreground mt-4">
                Enter a description of the code you're looking for
              </p>
            </div>
          )}

          {query && (
            <CodeResults 
              results={data} 
              isLoading={isLoading}
              error={error as Error}
            />
          )}
        </Card>
      </div>
    </div>
  );
}