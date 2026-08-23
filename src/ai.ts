import * as vscode from "vscode";

export interface AIExplanation {
  summary: string;
  why: string;
  fix: string;
}

interface AIResponse {
  choices: {
    message: {
      content: string;
    };
  }[];
}

export async function explainError(
  errorMessage: string,
  codeSnippet: string,
  language: string,
): Promise<AIExplanation> {
  const config = vscode.workspace.getConfiguration("aiErrorExplainer");
  const apiKey = config.get<string>("apiKey");

  if (!apiKey) {
   return {
     summary: "API key not set.",
     why: 'Go to Settings and set "AI Error Explainer: Api Key".',
     fix: "Get the free key from openrouter.ai and paste it into VS Code Settings.",
   };
  }

  const prompt = `You are a programming error explainer.
Respond ONLY with valid JSON, no markdown fences, no extra text.

Error: ${errorMessage}

Code:
${codeSnippet}

Return JSON with exactly these keys: summary, why, fix.
Respond in ${language}.`;

  try {
    const response = await fetch(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          //   model: "google/gemini-2.0-flash-exp:free",
          model: "nvidia/nemotron-3.5-lightning:free",
          messages: [{ role: "user", content: prompt }],
        }),
      },
    );

    // const data = await response.json();
    const data = (await response.json()) as AIResponse;
    const text = data.choices[0].message.content;
    const cleaned = text.replace(/```json|```/g, "").trim();

    return JSON.parse(cleaned);
  } catch (error) {
    return {
      summary: "AI “No response was received.” ",
      why: String(error),
      fix: "API key “Please check whether it is correct and make sure your internet connection is working properly.” ",
    };
  }
}
