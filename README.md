## 🔌 Supported AI Providers

This extension works with **any AI provider** — bring the key you already have. There are two setups depending on which provider you use.

---

### ⚡ Quick Setup (Gemini & Claude)

These two providers have a simplified setup — you only need to paste your API key. No other configuration required.

| Provider | Api Format | Get a Free Key |
|---|---|---|
| **Google Gemini** | `gemini` | [aistudio.google.com/apikey](https://aistudio.google.com/apikey) |
| **Anthropic (Claude)** | `anthropic` | [platform.claude.com/settings/keys](https://platform.claude.com/settings/workspaces/default/keys) |

**Setup:**
1. Open VS Code Settings (`Ctrl+,`) and search **"AI Error Explainer"**
2. Set **Api Format** to `gemini` or `anthropic`
3. Paste your key into **Api Key**
4. Done — hover over any error

---

### 🔧 Advanced Setup (Any OpenAI-Compatible Provider)

Most other AI providers — including all of the ones below — use the same request format as OpenAI. For these, set **Api Format** to `openai-compatible`, then fill in **Base URL**, **Model**, and **Api Key** for your chosen provider.

| Provider | Get API Key | Documentation | Base URL | Example Model |
|---|---|---|---|---|
| **OpenAI** | [platform.openai.com/api-keys](https://platform.openai.com/api-keys) | [Models](https://developers.openai.com/api/docs/models) | `https://api.openai.com/v1/chat/completions` | `gpt-4o-mini` |
| **DeepSeek** | [platform.deepseek.com/api_keys](https://platform.deepseek.com/api_keys) | [Pricing & Docs](https://api-docs.deepseek.com/quick_start/pricing/) | `https://api.deepseek.com/chat/completions` | `deepseek-chat` |
| **Groq** *(very fast, generous free tier)* | [console.groq.com/keys](https://console.groq.com/keys) | [Models](https://console.groq.com/docs/models) | `https://api.groq.com/openai/v1/chat/completions` | `openai/gpt-oss-120b` |
| **Mistral** | [console.mistral.ai/api-keys](https://console.mistral.ai/api-keys) | [Models](https://docs.mistral.ai/models) | `https://api.mistral.ai/v1/chat/completions` | `mistral-small-latest` |
| **OpenRouter** *(access hundreds of models, free & paid)* | [openrouter.ai/keys](https://openrouter.ai/settings/keys) | [Quickstart](https://openrouter.ai/docs/quickstart) | `https://openrouter.ai/api/v1/chat/completions` | `nvidia/nemotron-3.5-lightning:free` |
| **Together AI** | [api.together.xyz/settings/api-keys](https://api.together.xyz/settings/api-keys) | [Models](https://docs.together.ai/docs/inference-models) | `https://api.together.xyz/v1/chat/completions` | `meta-llama/Llama-3.3-70B-Instruct-Turbo` |
| **xAI (Grok)** | [console.x.ai](https://console.x.ai/) | [Models](https://docs.x.ai/docs/models) | `https://api.x.ai/v1/chat/completions` | `grok-2-latest` |

**Setup:**
1. Open VS Code Settings (`Ctrl+,`) and search **"AI Error Explainer"**
2. Set **Api Format** to `openai-compatible`
3. Copy the **Base URL** for your chosen provider from the table above into **Base Url**
4. Copy an **Example Model** into **Model** (or check that provider's docs for other options — model names change over time)
5. Paste your key into **Api Key**
6. Done — hover over any error

> 💡 **Tip:** Any provider not listed here will likely still work, as long as it offers an OpenAI-compatible chat completions endpoint — just fill in its Base URL and Model name the same way.

---

### How Provider Selection Works

```
Api Format: gemini / anthropic
    → Extension already knows the correct URL internally.
    → You only provide the API Key.

Api Format: openai-compatible
    → Extension needs to know WHERE to send the request (Base URL)
      and WHICH model to ask for (Model), because there are
      hundreds of providers using this same format.
    → You provide: Base URL + Model + API Key.
```