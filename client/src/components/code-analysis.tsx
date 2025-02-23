import { AlertCircle } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

interface CodeAnalysisProps {
  analysis?: string;
  isLoading: boolean;
  error: Error | null;
}

export function CodeAnalysis({ analysis, isLoading, error }: CodeAnalysisProps) {
  if (error) {
    return (
      <Card className="mt-4">
        <CardContent className="pt-6">
          <div className="flex items-center gap-2 text-destructive">
            <AlertCircle className="h-5 w-5" />
            <p>Failed to analyze code. Please try again.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (isLoading) {
    return (
      <Card className="mt-4">
        <CardHeader>
          <Skeleton className="h-6 w-1/3" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-4 w-full mb-2" />
          <Skeleton className="h-4 w-2/3" />
        </CardContent>
      </Card>
    );
  }

  if (!analysis) {
    return null;
  }

  return (
    <Card className="mt-4">
      <CardHeader>
        <CardTitle>Code Analysis</CardTitle>
        <CardDescription>AI-powered analysis of the code sample</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="prose prose-sm max-w-none">
          {analysis.split('\n').map((line, index) => (
            <p key={index} className="my-2">{line}</p>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
