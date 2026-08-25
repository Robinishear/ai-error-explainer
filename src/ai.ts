import * as vscode from "vscode";

export interface AIExplanation {
  summary: string;
  why: string;
  fix: string;
  fixedCode?: string;
}

interface OpenAIStyleResponse {
  choices: { message: { content: string } }[];
}

interface GeminiResponse {
  candidates: { content: { parts: { text: string }[] } }[];
}

interface AnthropicResponse {
  content: { text: string }[];
}

interface ErrorResponse {
  error: { message: string; code?: number };
}

function buildPrompt(
  errorMessage: string,
  codeSnippet: string,
  language: string,
): string {
  return `You are a programming error explainer.
Respond ONLY with valid JSON, no markdown fences, no extra text.

Error: ${errorMessage}

Code:
${codeSnippet}

Return JSON with exactly these keys: summary, why, fix, fixedCode.
"fixedCode" must be the COMPLETE corrected version of the ENTIRE code block shown above (all lines, not just the error line), preserving all surrounding code exactly as-is except for the fix. It must have the same number of lines as the original snippet unless the fix requires adding/removing a line.Respond in ${language}.`;
}

// ---------- AI Response Parsing ----------
function parseAIText(text: string): AIExplanation {
  const cleaned = text.replace(/```json|```/g, "").trim();

  try {
    const parsed = JSON.parse(cleaned);

    if (parsed.summary && parsed.why && parsed.fix) {
      return parsed;
    }

    throw new Error("AI response is missing required fields");
  } catch {
    return {
      summary: text.length > 300 ? text.slice(0, 300) + "..." : text,
      why: "The AI didn't return properly formatted data, so the raw response is shown above.",
      fix: "Try hovering again, or switch to a different model/provider in Settings.",
    };
  }
}

// ---------- Type Guards ----------
function isErrorResponse(data: unknown): data is ErrorResponse {
  return typeof data === "object" && data !== null && "error" in data;
}

// ---------- OpenRouter ----------
async function callOpenRouter(
  apiKey: string,
  prompt: string,
): Promise<AIExplanation> {
  const config = vscode.workspace.getConfiguration("aiErrorExplainer");
  const model =
    config.get<string>("openrouterModel") ||
    "nvidia/nemotron-3.5-lightning:free";

  const response = await fetch(
    "https://openrouter.ai/api/v1/chat/completions",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        messages: [{ role: "user", content: prompt }],
      }),
    },
  );

  const data: unknown = await response.json();

  if (isErrorResponse(data)) {
    return {
      summary:
        data.error.code === 429
          ? "Daily free request limit reached."
          : "AI request failed.",
      why: data.error.message,
      fix: "Wait for the limit to reset, or switch provider/model in Settings.",
    };
  }

  const result = data as OpenAIStyleResponse;
  return parseAIText(result.choices[0].message.content);
}

// ---------- OpenAI ----------
async function callOpenAI(
  apiKey: string,
  prompt: string,
): Promise<AIExplanation> {
  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
    }),
  });

  const data: unknown = await response.json();

  if (isErrorResponse(data)) {
    return {
      summary: "AI request failed.",
      why: data.error.message,
      fix: "Check your OpenAI API key and billing status.",
    };
  }

  const result = data as OpenAIStyleResponse;
  return parseAIText(result.choices[0].message.content);
}

// ---------- Google Gemini ----------
async function callGemini(
  apiKey: string,
  prompt: string,
): Promise<AIExplanation> {
  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent?key=${apiKey}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] }),
    },
  );

  const data: unknown = await response.json();

  if (isErrorResponse(data)) {
    return {
      summary: "AI request failed.",
      why: data.error.message,
      fix: "Check your Gemini API key.",
    };
  }

  const result = data as GeminiResponse;
  return parseAIText(result.candidates[0].content.parts[0].text);
}

// ---------- Anthropic (Claude) ----------
async function callAnthropic(
  apiKey: string,
  prompt: string,
): Promise<AIExplanation> {
  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: "claude-3-5-sonnet-20241022",
      max_tokens: 1024,
      messages: [{ role: "user", content: prompt }],
    }),
  });

  const data: unknown = await response.json();

  if (isErrorResponse(data)) {
    return {
      summary: "AI request failed.",
      why: data.error.message,
      fix: "Check your Anthropic API key.",
    };
  }

  const result = data as AnthropicResponse;
  return parseAIText(result.content[0].text);
}

// ---------- DeepSeek ----------
async function callDeepSeek(
  apiKey: string,
  prompt: string,
): Promise<AIExplanation> {
  const response = await fetch("https://api.deepseek.com/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "deepseek-chat",
      messages: [{ role: "user", content: prompt }],
    }),
  });

  const data: unknown = await response.json();

  if (isErrorResponse(data)) {
    return {
      summary: "AI request failed.",
      why: data.error.message,
      fix: "Check your DeepSeek API key.",
    };
  }

  const result = data as OpenAIStyleResponse;
  return parseAIText(result.choices[0].message.content);
}

// ---------- Main entry point ----------
export async function explainError(
  errorMessage: string,
  codeSnippet: string,
  language: string,
): Promise<AIExplanation> {
  const config = vscode.workspace.getConfiguration("aiErrorExplainer");
  const apiKey = config.get<string>("apiKey");
  const provider = config.get<string>("provider") || "openrouter";

  if (!apiKey) {
    return {
      summary: "API key not set.",
      why: `Go to Settings and set "AI Error Explainer: Api Key" for your chosen provider (${provider}).`,
      fix: "Get a key from openrouter.ai, platform.openai.com, aistudio.google.com, console.anthropic.com, or platform.deepseek.com.",
    };
  }

  const prompt = buildPrompt(errorMessage, codeSnippet, language);

  try {
    switch (provider) {
      case "openai":
        return await callOpenAI(apiKey, prompt);
      case "gemini":
        return await callGemini(apiKey, prompt);
      case "anthropic":
        return await callAnthropic(apiKey, prompt);
      case "deepseek":
        return await callDeepSeek(apiKey, prompt);
      default:
        return await callOpenRouter(apiKey, prompt);
    }
  } catch (error) {
    return {
      summary: "No response was received from the AI.",
      why: String(error),
      fix: "Check your API key and internet connection.",
    };
  }
}
