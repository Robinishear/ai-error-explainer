import * as vscode from "vscode";

export interface AIExplanation {
  summary: string;
  why: string;
  fix: string;
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

const responseCache = new Map<string, AIExplanation>();

function generateCacheKey(
  errorMessage: string,
  codeSnippet: string,
  language: string,
  provider: string,
): string {
  return provider + "::" + language + "::" + errorMessage + "::" + codeSnippet;
}

function buildPrompt(
  errorMessage: string,
  codeSnippet: string,
  language: string,
): string {
  return `You are a programming error explainer.
Respond ONLY with valid JSON, no markdown fences, no extra text.
Keep each field to 1-2 short sentences maximum.

Error: ${errorMessage}

Code:
${codeSnippet}

Return JSON with exactly these keys: summary, why, fix.
Respond in ${language}.`;
}

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

function isErrorResponse(data: unknown): data is ErrorResponse {
  return typeof data === "object" && data !== null && "error" in data;
}

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
        Authorization: "Bearer " + apiKey,
      },
      body: JSON.stringify({
        model: model,
        messages: [{ role: "user", content: prompt }],
      }),
    },
  );

  const data: unknown = await response.json();
  if (isErrorResponse(data)) {
    throw new Error(data.error.message);
  }
  const result = data as OpenAIStyleResponse;
  return parseAIText(result.choices[0].message.content);
}

async function callOpenAI(
  apiKey: string,
  prompt: string,
): Promise<AIExplanation> {
  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + apiKey,
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
    }),
  });

  const data: unknown = await response.json();
  if (isErrorResponse(data)) {
    throw new Error(data.error.message);
  }
  const result = data as OpenAIStyleResponse;
  return parseAIText(result.choices[0].message.content);
}

async function callGemini(
  apiKey: string,
  prompt: string,
): Promise<AIExplanation> {
  const url =
    "https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent?key=" +
    apiKey;

  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] }),
  });

  const data: unknown = await response.json();
  if (isErrorResponse(data)) {
    throw new Error(data.error.message);
  }
  const result = data as GeminiResponse;
  return parseAIText(result.candidates[0].content.parts[0].text);
}

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
    throw new Error(data.error.message);
  }
  const result = data as AnthropicResponse;
  return parseAIText(result.content[0].text);
}

async function callDeepSeek(
  apiKey: string,
  prompt: string,
): Promise<AIExplanation> {
  const response = await fetch("https://api.deepseek.com/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + apiKey,
    },
    body: JSON.stringify({
      model: "deepseek-chat",
      messages: [{ role: "user", content: prompt }],
    }),
  });

  const data: unknown = await response.json();
  if (isErrorResponse(data)) {
    throw new Error(data.error.message);
  }
  const result = data as OpenAIStyleResponse;
  return parseAIText(result.choices[0].message.content);
}

const providerFunctions: Record<
  string,
  (apiKey: string, prompt: string) => Promise<AIExplanation>
> = {
  openrouter: callOpenRouter,
  openai: callOpenAI,
  gemini: callGemini,
  anthropic: callAnthropic,
  deepseek: callDeepSeek,
};

interface ProviderAttempt {
  name: string;
  apiKey: string;
}

function buildProviderList(): ProviderAttempt[] {
  const config = vscode.workspace.getConfiguration("aiErrorExplainer");
  const primaryProvider = config.get<string>("provider") || "openrouter";
  const primaryKey = config.get<string>("apiKey") || "";

  const fallbackKeys: Record<string, string> = {
    openrouter: config.get<string>("openrouterApiKey") || "",
    openai: config.get<string>("openaiApiKey") || "",
    gemini: config.get<string>("geminiApiKey") || "",
    anthropic: config.get<string>("anthropicApiKey") || "",
    deepseek: config.get<string>("deepseekApiKey") || "",
  };

  const attempts: ProviderAttempt[] = [];

  if (primaryKey) {
    attempts.push({ name: primaryProvider, apiKey: primaryKey });
  }

  for (const key in fallbackKeys) {
    if (fallbackKeys[key] && key !== primaryProvider) {
      attempts.push({ name: key, apiKey: fallbackKeys[key] });
    }
  }

  return attempts;
}

export async function explainError(
  errorMessage: string,
  codeSnippet: string,
  language: string,
): Promise<AIExplanation> {
  const config = vscode.workspace.getConfiguration("aiErrorExplainer");
  const primaryProvider = config.get<string>("provider") || "openrouter";
  const enableFallback = config.get<boolean>("enableFallback");

  const cacheKey = generateCacheKey(
    errorMessage,
    codeSnippet,
    language,
    primaryProvider,
  );

  const cached = responseCache.get(cacheKey);
  if (cached) {
    return cached;
  }

  const attempts = buildProviderList();

  if (attempts.length === 0) {
    return {
      summary: "API key not set.",
      why:
        'Go to Settings and set "AI Error Explainer: Api Key" for your chosen provider (' +
        primaryProvider +
        ").",
      fix: "Get a key from openrouter.ai, platform.openai.com, aistudio.google.com, console.anthropic.com, or platform.deepseek.com.",
    };
  }

  const prompt = buildPrompt(errorMessage, codeSnippet, language);
  const attemptsToTry =
    enableFallback === false ? [attempts[0]] : attempts;

  let lastError = "";

  for (const attempt of attemptsToTry) {
    const fn = providerFunctions[attempt.name];
    if (!fn) {
      continue;
    }

    try {
      const result = await fn(attempt.apiKey, prompt);
      responseCache.set(cacheKey, result);
      return result;
    } catch (error) {
      lastError = "[" + attempt.name + "] " + String(error);
    }
  }

  return {
    summary: "All configured AI providers failed.",
    why: lastError || "Unknown error.",
    fix: "Check your API keys, or wait for rate limits to reset.",
  };
}