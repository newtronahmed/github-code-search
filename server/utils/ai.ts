import { HfInference } from "@huggingface/inference";

if (!process.env.HUGGINGFACE_API_KEY) {
  throw new Error("HUGGINGFACE_API_KEY environment variable is required");
}

const hf = new HfInference(process.env.HUGGINGFACE_API_KEY);

export async function enhanceSearchQuery(userQuery: string): Promise<string> {
  try {
    const prompt = `Create a GitHub code search query for: "${userQuery}"
Format: [keywords] language:[lang] filename:*.[ext]
Examples:
- "merge sort implementation" language:python filename:*.py
- "binary tree traversal" language:javascript filename:*.js
Response:`;

    const response = await hf.textGeneration({
      model: "codellama/CodeLlama-34b-Instruct-hf",
      inputs: prompt,
      parameters: {
        max_new_tokens: 30,
        temperature: 0.1,
        top_p: 0.9,
      },
    });

    // Extract only the search query, removing any explanatory text
    let enhancedQuery = response.generated_text
      .trim()
      .split('\n')[0]                // Take only the first line
      .replace(/^["']|["']$/g, '')   // Remove quotes
      .replace(/Response:?\s*/i, '') // Remove any "Response:" prefix
      .trim();

    // Fallback if the query doesn't contain language specification
    if (!enhancedQuery.includes('language:')) {
      const languageMatch = userQuery.match(/\b(python|javascript|java|cpp|typescript)\b/i);
      const language = languageMatch ? languageMatch[1].toLowerCase() : 'python';
      enhancedQuery = `${userQuery} language:${language}`;
    }

    console.log('Original query:', userQuery);
    console.log('Enhanced query:', enhancedQuery);

    return enhancedQuery;
  } catch (error) {
    console.error("Error enhancing search query:", error);
    // Create a basic search query as fallback
    return `${userQuery} language:python filename:*.py`;
  }
}

export async function analyzeCode(code: string, language: string): Promise<string> {
  try {
    const prompt = `Analyze this ${language} code and provide a concise explanation of:
1. What the code does
2. Key algorithms or patterns used
3. Potential improvements or best practices

Code to analyze:
\`\`\`${language}
${code}
\`\`\`

Provide the analysis in a clear, concise format.`;

    const response = await hf.textGeneration({
      model: "codellama/CodeLlama-34b-Instruct-hf",
      inputs: prompt,
      parameters: {
        max_new_tokens: 200,
        temperature: 0.2,
        top_p: 0.9,
      },
    });

    return response.generated_text.trim();
  } catch (error) {
    console.error("Error analyzing code:", error);
    return "Failed to analyze code. Please try again later.";
  }
}