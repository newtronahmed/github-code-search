import { SearchResult } from "@shared/schema";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertCircle, Github, Search, Microscope } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import SyntaxHighlighter from "react-syntax-highlighter";
import { vs } from "react-syntax-highlighter/dist/esm/styles/hljs";
import { useState } from "react";
import { CodeAnalysis } from "./code-analysis";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

interface CodeResultsProps {
  results?: SearchResult[];
  isLoading: boolean;
  error: Error | null;
}

export function CodeResults({ results, isLoading, error }: CodeResultsProps) {
  const [selectedResult, setSelectedResult] = useState<number | null>(null);

  const analyzeCodeMutation = useMutation({
    mutationFn: async (params: { code: string; language: string }) => {
      const response = await apiRequest("POST", "/api/analyze", params);
      return response.json();
    },
  });

  const handleAnalyze = async (code: string, language: string, index: number) => {
    setSelectedResult(index);
    await analyzeCodeMutation.mutate({ code, language });
  };

  if (error) {
    return (
      <div className="text-center py-8 text-destructive">
        <AlertCircle className="w-8 h-8 mx-auto mb-2" />
        <p>Failed to fetch results. Please try again.</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="space-y-4 mt-6">
        {[...Array(3)].map((_, i) => (
          <Card key={i} className="p-4">
            <Skeleton className="h-4 w-3/4 mb-4" />
            <Skeleton className="h-20" />
          </Card>
        ))}
      </div>
    );
  }

  if (!results?.length) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <Search className="w-8 h-8 mx-auto mb-2" />
        No results found. Try a different search.
      </div>
    );
  }

  return (
    <div className="space-y-6 mt-6">
      {results.map((result, index) => (
        <div key={index}>
          <Card className="p-4">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="font-semibold">{result.name}</h3>
                <p className="text-sm text-muted-foreground">{result.path}</p>
              </div>
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => handleAnalyze(
                    result.content,
                    result.path.split('.').pop() || 'text',
                    index
                  )}
                  disabled={analyzeCodeMutation.isPending && selectedResult === index}
                >
                  <Microscope className="w-4 h-4 mr-2" />
                  Analyze
                </Button>
                <Button variant="outline" size="sm" asChild>
                  <a 
                    href={result.html_url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center gap-2"
                  >
                    <Github className="w-4 h-4" />
                    View on GitHub
                  </a>
                </Button>
              </div>
            </div>

            <Separator className="my-4" />

            <div className="max-h-96 overflow-auto rounded">
              <SyntaxHighlighter 
                language={result.path.split('.').pop() || 'text'}
                style={vs}
                customStyle={{
                  margin: 0,
                  borderRadius: '0.5rem',
                }}
              >
                {result.content}
              </SyntaxHighlighter>
            </div>

            {selectedResult === index && (
              <CodeAnalysis
                analysis={analyzeCodeMutation.data?.analysis}
                isLoading={analyzeCodeMutation.isPending}
                error={analyzeCodeMutation.error as Error}
              />
            )}
          </Card>
        </div>
      ))}
    </div>
  );
}