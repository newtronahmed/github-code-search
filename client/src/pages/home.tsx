import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { SearchBar } from "@/components/search-bar";
import { CodeResults } from "@/components/code-results";
import { Card } from "@/components/ui/card";
import { Search, Code2, Github, Cpu } from "lucide-react";
import type { SearchResult } from "@shared/schema";

export default function Home() {
  const [query, setQuery] = useState("");

  const { data, isLoading, error } = useQuery<SearchResult[]>({
    queryKey: [`/api/search?q=${encodeURIComponent(query)}`, query],
    enabled: query.length > 0,
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-background/95">
      <div className="max-w-6xl mx-auto px-4 py-12">
        {!query && (
          <div className="text-center space-y-6 mb-12">
            <h1 className="text-6xl font-bold tracking-tight">
              <span className="bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                AI-Powered Code Search
              </span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Find the perfect code samples using natural language search powered by AI
            </p>
            
            {/* Feature highlights */}
            <div className="grid md:grid-cols-3 gap-8 mt-16 max-w-4xl mx-auto">
              <div className="space-y-3 p-6 rounded-lg bg-card/50 backdrop-blur">
                <Code2 className="w-8 h-8 text-primary" />
                <h3 className="font-semibold text-lg">Intelligent Search</h3>
                <p className="text-sm text-muted-foreground">
                  Search code using natural language and get accurate results
                </p>
              </div>
              <div className="space-y-3 p-6 rounded-lg bg-card/50 backdrop-blur">
                <Github className="w-8 h-8 text-primary" />
                <h3 className="font-semibold text-lg">GitHub Integration</h3>
                <p className="text-sm text-muted-foreground">
                  Direct access to millions of open-source repositories
                </p>
              </div>
              <div className="space-y-3 p-6 rounded-lg bg-card/50 backdrop-blur">
                <Cpu className="w-8 h-8 text-primary" />
                <h3 className="font-semibold text-lg">AI Analysis</h3>
                <p className="text-sm text-muted-foreground">
                  Get detailed explanations and insights for any code sample
                </p>
              </div>
            </div>
          </div>
        )}

        <Card className="p-8 shadow-lg backdrop-blur bg-card/50">
          <SearchBar onSearch={setQuery} />

          {!query && (
            <div className="text-center py-12">
              <Search className="w-12 h-12 mx-auto text-muted-foreground/30" />
              <p className="text-muted-foreground mt-4 text-lg">
                Try searching for "implement authentication with JWT" or "React infinite scroll"
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