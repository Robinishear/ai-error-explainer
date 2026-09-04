import * as vscode from "vscode";
import { AIExplanation } from "./interface/AIExplanation";
import { OpenAIStyleResponse } from "./interface/OpenAIStyleResponse";
import { GeminiResponse } from "./interface/GeminiResponse";
import { AnthropicResponse } from "./interface/AnthropicResponse";
import { ErrorResponse } from "./interface/ErrorResponse";

// ---------- Caching ----------
// Session-only cache: cleared when VS Code restarts, never written to disk.
const responseCache = new Map<string, AIExplanation>();

function generateCacheKey(
  errorMessage: string,
  codeSnippet: string,
  language: string,
  baseUrl: string,
  model: string,
): string {
  return (
    baseUrl +
    "::" +
    model +
    "::" +
    language +
    "::" +
    errorMessage +
    "::" +
    codeSnippet
  );
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
      fix: "Try hovering again, or check your Base URL and Model settings.",
    };
  }
}

function isErrorResponse(data: unknown): data is ErrorResponse {
  return typeof data === "object" && data !== null && "error" in data;
}

//  Universal caller for any OpenAI-compatible provider 
// Works with: OpenAI, DeepSeek, Groq, Mistral, OpenRouter, Together, xAI,
// Fireworks, Cerebras, Perplexity, Ollama (local), and most others.
async function callOpenAICompatible(
  baseUrl: string,
  apiKey: string,
  model: string,
  prompt: string,
): Promise<AIExplanation> {
  const effectiveModel = model || "nvidia/nemotron-3.5-lightning:free";

  const response = await fetch(baseUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + apiKey,
    },
    body: JSON.stringify({
      model: effectiveModel,
      messages: [{ role: "user", content: prompt }],
    }),
  });

  const data: unknown = await response.json();

  if (isErrorResponse(data)) {
    return {
      summary:
        data.error.code === 429 ? "Rate limit reached." : "AI request failed.",
      why: data.error.message,
      fix: "Check your API key, Base URL, and Model name in Settings.",
    };
  }

  const result = data as OpenAIStyleResponse;
  return parseAIText(result.choices[0].message.content);
}

//  Google Gemini (different format, needs its own function) 

// Fix — callGemini
async function callGemini(
  apiKey: string,
  model: string,
  prompt: string,
): Promise<AIExplanation> {
  const geminiModel = model || "gemini-3.6-flash";
  const url =
    "https://generativelanguage.googleapis.com/v1beta/models/" +
    geminiModel +
    ":generateContent?key=" +
    encodeURIComponent(apiKey);

  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] }),
  });

  const rawText = await response.text();
  console.log("Gemini response status:", response.status);
  console.log("Gemini raw response:", rawText);

  let data: unknown;
  try {
    data = JSON.parse(rawText);
  } catch {
    return {
      summary: "Gemini returned an unreadable response.",
      why: "HTTP " + response.status + ": " + (rawText || "(empty response)"),
      fix: "Check your Gemini API key and internet connection.",
    };
  }

  if (isErrorResponse(data)) {
    return {
      summary: "AI request failed.",
      why: data.error.message,
      fix: "Check your Gemini API key and Model name in Settings.",
    };
  }

  const result = data as GeminiResponse;
  return parseAIText(result.candidates[0].content.parts[0].text);
}

// Fix — callAnthropic
async function callAnthropic(
  apiKey: string,
  model: string,
  prompt: string,
): Promise<AIExplanation> {
  // const claudeModel = model || "claude-3-5-sonnet-20241022";
  const claudeModel = model || "claude-haiku-4-5-20251001";

  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: claudeModel,
      max_tokens: 1024,
      messages: [{ role: "user", content: prompt }],
    }),
  });

  const data: unknown = await response.json();

  if (isErrorResponse(data)) {
    return {
      summary: "AI request failed.",
      why: data.error.message,
      fix: "Check your Anthropic API key and Model name in Settings.",
    };
  }

  const result = data as AnthropicResponse;
  return parseAIText(result.content[0].text);
}

//fix  Main entry point explainError
export async function explainError(
  errorMessage: string,
  codeSnippet: string,
  language: string,
): Promise<AIExplanation> {
  const config = vscode.workspace.getConfiguration("aiErrorExplainer");
  // const apiKey = config.get<string>("apiKey");
  const apiKey = (config.get<string>("apiKey") || "").trim();
  const apiFormat = config.get<string>("apiFormat") || "openai-compatible";
  const baseUrl =
    config.get<string>("baseUrl") ||
    "https://openrouter.ai/api/v1/chat/completions";

  // const model =
  //   config.get<string>("model") || "nvidia/nemotron-3.5-lightning:free";

  //  fix  new code
const model = config.get<string>("model") || "";

  if (!apiKey) {
    return {
      summary: "API key not set.",
      why: 'Go to Settings and set "AI Error Explainer: Api Key" for your provider.',
      fix: "Also make sure Base URL / Model (or API Format) match your provider.",
    };
  }

  const cacheKey = generateCacheKey(
    errorMessage,
    codeSnippet,
    language,
    apiFormat === "openai-compatible" ? baseUrl : apiFormat,
    model,
  );
  const cached = responseCache.get(cacheKey);
  if (cached) {
    return cached;
  }

  const prompt = buildPrompt(errorMessage, codeSnippet, language);

  try {
    let result: AIExplanation;

    switch (apiFormat) {
      case "gemini":
        result = await callGemini(apiKey, model, prompt);
        break;
      case "anthropic":
        result = await callAnthropic(apiKey, model, prompt);
        break;
      default:
        result = await callOpenAICompatible(baseUrl, apiKey, model, prompt);
    }

    responseCache.set(cacheKey, result);
    return result;
  } catch (error) {
    return {
      summary: "No response was received from the AI.",
      why: String(error),
      fix: "Check your API key, Base URL, and internet connection.",
    };
  }
}
