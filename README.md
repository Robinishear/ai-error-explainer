


# 🤖 AI Error Explainer

**AI-powered error explanations, right inside VS Code.**

Hover over any error or warning to get a clear, plain-language diagnosis of what went wrong, why it happened, and how to fix it — powered by the AI of *your* choice.

![Version](https://img.shields.io/badge/version-1.3.0-5eead4)
![License](https://img.shields.io/badge/license-MIT-blue)
![Languages](https://img.shields.io/badge/languages-41-orange)
![Providers](https://img.shields.io/badge/AI%20providers-9-purple)

---

## 📑 Table of Contents

- [Demo](#-demo)
- [Why This Extension?](#-why-this-extension)
- [Features](#-features)
- [Supported AI Providers](#-supported-ai-providers)
- [Example](#-example)
- [Setup](#-setup)
- [How It Works](#-how-it-works)
- [Settings Reference](#-settings-reference)
- [Privacy & Security](#-privacy--security)
- [FAQ](#-faq)
- [Known Limitations](#-known-limitations)
- [License](#-license)
- [Author](#-author)

---

## 🎬 Demo


> 📹 *Demo video coming soon — showing the extension in action from error to explanation.*

---

## 💡 Why This Extension?

Cryptic error messages waste time. Instead of copy-pasting errors into a browser tab and searching through forum posts, get an instant, plain-language diagnosis without ever leaving your editor.

This extension follows one core principle: **bring your own key**. There's no subscription, no server in the middle, and no vendor lock-in — you choose the AI provider you already trust, and every request goes directly from your machine to theirs.

---

## ✨ Features

| | |
|---|---|
| 🔍 **Automatic error detection** | Works with any language VS Code already understands — TypeScript, JavaScript, Python, Go, and more |
| 🤖 **AI-powered explanations** | Plain-language breakdown: what happened, why, and how to fix it |
| 🩺 **Detailed diagnosis panel** | Click "View Details" for a clean, dedicated breakdown of the full diagnosis |
| ⚡ **Response caching** | Repeated errors are answered instantly from memory — no repeated AI calls |
| 🌍 **41 languages supported** | English, বাংলা, Hindi, Urdu, Arabic, Chinese, Japanese, Spanish, and many more |
| 🔑 **Bring Your Own Key (BYOK)** | Use any provider's API key — you're never dependent on ours, and you never pay us |
| 🔌 **Universal provider support** | Works with Gemini, Claude, and any OpenAI-compatible provider — no code changes needed for new providers |
| 🔒 **Zero data collection** | Nothing is logged, stored, or sent anywhere except the AI provider you configure |

---

## 🔌 Supported AI Providers

This extension works with **any AI provider** — bring the key you already have. Choose your setup path below based on which provider you're using.

<table>
<tr>
<td width="50%" valign="top">

### ⚡ Quick Setup
**Gemini & Claude**

These providers use their own request format — the extension already knows how to talk to them. You only need to paste your API key.

```
Api Format: gemini
   or
Api Format: anthropic

Api Key: <your key>
```

That's it — no Base URL or Model needed.

</td>
<td width="50%" valign="top">

### 🔧 Advanced Setup
**Everything Else**

Most other providers speak the same "OpenAI-compatible" language. You tell the extension where to send the request and which model to ask for.

```
Api Format: openai-compatible

Base URL: <provider's endpoint>
Model:    <provider's model name>
Api Key:  <your key>
```

</td>
</tr>
</table>

---

### Provider Directory

<details>
<summary><b>🟦 Google Gemini</b> — Quick Setup</summary>

<br>

| | |
|---|---|
| **Api Format** | `gemini` |
| **Get a free key** | [aistudio.google.com/apikey](https://aistudio.google.com/apikey) |
| **Base URL / Model** | Not needed — handled automatically |

**Steps:**
1. Set `Api Format` to `gemini`
2. Paste your Gemini key into `Api Key`
3. Done

</details>

<details>
<summary><b>🟧 Anthropic (Claude)</b> — Quick Setup</summary>

<br>

| | |
|---|---|
| **Api Format** | `anthropic` |
| **Get a free key** | [platform.claude.com/settings/keys](https://platform.claude.com/settings/workspaces/default/keys) |
| **Base URL / Model** | Not needed — handled automatically |

**Steps:**
1. Set `Api Format` to `anthropic`
2. Paste your Claude key into `Api Key`
3. Done

</details>

<details>
<summary><b>🟢 OpenAI</b> — Advanced Setup</summary>

<br>

| | |
|---|---|
| **Api Format** | `openai-compatible` |
| **Get a key** | [platform.openai.com/api-keys](https://platform.openai.com/api-keys) |
| **Documentation** | [Models reference](https://developers.openai.com/api/docs/models) |
| **Base URL** | `https://api.openai.com/v1/chat/completions` |
| **Example Model** | `gpt-4o-mini` |

> ⚠️ OpenAI requires a funded billing account — there is no free tier for API usage.

</details>

<details>
<summary><b>🐋 DeepSeek</b> — Advanced Setup</summary>

<br>

| | |
|---|---|
| **Api Format** | `openai-compatible` |
| **Get a key** | [platform.deepseek.com/api_keys](https://platform.deepseek.com/api_keys) |
| **Documentation** | [Pricing & quick start](https://api-docs.deepseek.com/quick_start/pricing/) |
| **Base URL** | `https://api.deepseek.com/chat/completions` |
| **Example Model** | `deepseek-chat` |

</details>

<details>
<summary><b>⚡ Groq</b> — Advanced Setup <i>(fast, generous free tier)</i></summary>

<br>

| | |
|---|---|
| **Api Format** | `openai-compatible` |
| **Get a key** | [console.groq.com/keys](https://console.groq.com/keys) |
| **Documentation** | [Model list](https://console.groq.com/docs/models) |
| **Base URL** | `https://api.groq.com/openai/v1/chat/completions` |
| **Example Model** | `openai/gpt-oss-120b` |

> ✅ Verified fastest response time among tested providers, with a free tier that doesn't require billing setup.

</details>

<details>
<summary><b>🌬️ Mistral</b> — Advanced Setup</summary>

<br>

| | |
|---|---|
| **Api Format** | `openai-compatible` |
| **Get a key** | [console.mistral.ai/api-keys](https://console.mistral.ai/api-keys) |
| **Documentation** | [Model list](https://docs.mistral.ai/models) |
| **Base URL** | `https://api.mistral.ai/v1/chat/completions` |
| **Example Model** | `mistral-small-latest` |

</details>

<details>
<summary><b>🔀 OpenRouter</b> — Advanced Setup <i>(access hundreds of models, free & paid)</i></summary>

<br>

| | |
|---|---|
| **Api Format** | `openai-compatible` |
| **Get a key** | [openrouter.ai/keys](https://openrouter.ai/settings/keys) |
| **Documentation** | [Quickstart guide](https://openrouter.ai/docs/quickstart) |
| **Base URL** | `https://openrouter.ai/api/v1/chat/completions` |
| **Example Model** | `nvidia/nemotron-3.5-lightning:free` |

> 💡 OpenRouter acts as a gateway to many providers at once — change the Model field to switch between GPT, Claude, Llama, and more, all with one key.

</details>

<details>
<summary><b>🤝 Together AI</b> — Advanced Setup</summary>

<br>

| | |
|---|---|
| **Api Format** | `openai-compatible` |
| **Get a key** | [api.together.xyz/settings/api-keys](https://api.together.xyz/settings/api-keys) |
| **Documentation** | [Model list](https://docs.together.ai/docs/inference-models) |
| **Base URL** | `https://api.together.xyz/v1/chat/completions` |
| **Example Model** | `meta-llama/Llama-3.3-70B-Instruct-Turbo` |

</details>

<details>
<summary><b>🚀 xAI (Grok)</b> — Advanced Setup</summary>

<br>

| | |
|---|---|
| **Api Format** | `openai-compatible` |
| **Get a key** | [console.x.ai](https://console.x.ai/) |
| **Documentation** | [Model list](https://docs.x.ai/docs/models) |
| **Base URL** | `https://api.x.ai/v1/chat/completions` |
| **Example Model** | `grok-2-latest` |

</details>

<br>

> 💡 **Not seeing your provider?** Any service offering an OpenAI-compatible chat completions endpoint will likely work — just fill in its Base URL and Model name the same way as above.

---

### How It Works Internally

```
┌─────────────────────────────────────────────┐
│  Api Format: gemini / anthropic              │
│  → Extension already knows the correct URL   │
│  → You only provide: API Key                 │
├─────────────────────────────────────────────┤
│  Api Format: openai-compatible               │
│  → Hundreds of providers share this format   │
│  → You provide: Base URL + Model + API Key   │
└─────────────────────────────────────────────┘
```

---

## 📸 Example

**Before** — you hit a confusing error:

    const users = getUsers();
    users.map(user => console.log(user.name));

    TypeError: Cannot read properties of undefined (reading 'map')

**Hover over the red underline**, and AI Error Explainer instantly shows:

> 🤖 **AI Error Assistant**
>
> **What happened?** The `users` variable is undefined.
> **Why?** `getUsers()` did not return an array.
> **Fix:** Make sure `getUsers()` returns an array, or add a fallback like `getUsers() || []`.
>
> 🔍 **View Details**

Click **View Details** to open a dedicated side panel with a clean, full breakdown — no squinting at a tiny tooltip.

---

## ⚙️ Setup

1. **Install** the extension from the VS Code Marketplace
2. **Pick a provider** from the [Supported AI Providers](#-supported-ai-providers) section above and grab a free API key
3. Open **VS Code Settings** (`Ctrl+,`) and search for **"AI Error Explainer"**
4. Follow either the **Quick Setup** (Gemini/Claude) or **Advanced Setup** (everything else) instructions
5. *(Optional)* Set your preferred **Language**
6. That's it — hover over any error or warning in your code

---

## 🔄 How It Works

    Your code
       ↓
    VS Code detects an error
       ↓
    You hover over it
       ↓
    Extension checks its cache — if this exact error was seen before,
    the cached answer is shown instantly
       ↓
    Otherwise: sends the error message + a few nearby lines to your chosen AI
       ↓
    AI explains what happened, why, and how to fix it
       ↓
    Click "View Details" for the full diagnosis

Only a small snippet — the error message and a few surrounding lines — is ever shared. Never your whole file, never your whole project.

---

## 🛠️ Settings Reference

| Setting | Description | Default |
|---|---|---|
| `aiErrorExplainer.apiFormat` | Which API format your provider uses: `openai-compatible`, `gemini`, or `anthropic` | `openai-compatible` |
| `aiErrorExplainer.apiKey` | Your API key for the configured provider | *(empty)* |
| `aiErrorExplainer.baseUrl` | Only used when Api Format is `openai-compatible`. The full endpoint URL for your provider | `https://openrouter.ai/api/v1/chat/completions` |
| `aiErrorExplainer.model` | The model name your provider expects (ignored for Gemini/Anthropic, which use sensible defaults automatically) | *(empty — falls back to a free OpenRouter model)* |
| `aiErrorExplainer.language` | Language for AI explanations (41 supported) | `English` |

---

## 🔐 Privacy & Security

- ✅ **No data is collected or stored by this extension.** Nothing is sent to any server we control — there is no "we" in the data path at all.
- ✅ **Your API key never leaves your machine** except to talk directly to the provider you chose. It's stored in VS Code's local settings, same as any other extension setting.
- ✅ **Only a small snippet is shared** — the error message and a few nearby lines, never your whole file.
- ✅ **This extension never modifies your code.** It only explains errors — it does not apply or suggest automatic changes to your files.
- ✅ **Caching is local and temporary.** Cached responses live only in memory for your current VS Code session and are cleared on restart — nothing is written to disk.
- ✅ **No telemetry, no analytics, no tracking.**

---

## ❓ FAQ

**Is this free to use?**
The extension itself is completely free. Whether *using it* is free depends on your chosen AI provider — Gemini, OpenRouter, and Groq all offer generous free tiers with no billing setup required.

**Do I need to pay you anything?**
No. There is no subscription, no license key, and no payment to us at all. You pay (or don't pay) your AI provider directly.

**Which provider should I pick if I have no key yet?**
Start with **Google Gemini** (Quick Setup, generous free tier) or **Groq** (Advanced Setup, extremely fast and free) — both take under a minute to set up.

**What's the difference between "Quick Setup" and "Advanced Setup"?**
Gemini and Claude use their own unique request format, so the extension already knows how to talk to them — you just paste a key. Every other provider (OpenAI, DeepSeek, Groq, Mistral, OpenRouter, Together AI, xAI) shares a common "OpenAI-compatible" format, so you tell the extension the provider's Base URL and Model name once.

**Why isn't there an "Apply Fix" button that edits my code?**
Early versions had one, but auto-replacing multiple lines of code carries real risk of breaking working code — especially in larger files. We'd rather give you a clear, trustworthy explanation than a risky auto-edit.

**My AI provider says "rate limit exceeded" or asks for billing — is this extension broken?**
No — that message comes directly from your provider's account status, not from a bug in the extension. Wait for a free-tier limit to reset, add billing on that provider's dashboard, or switch to a different provider in Settings.

---

## ⚠️ Known Limitations

- Free-tier AI models may respond more slowly or hit rate limits depending on the provider and time of day
- Very large code blocks are truncated before being sent to the AI to keep requests fast and affordable
- This extension only **explains** errors — it does not automatically modify your code
- Some providers change their model names over time; if a model stops working, check that provider's documentation for the current name

---

## 📄 License

MIT — free to use, modify, and share. See the LICENSE file included with this extension for details.

---

## 👤 Author

Built by **Robin Ryan**, a full-stack developer from Bangladesh.

If you run into an issue or have a feature request, feel free to leave a review or rating on the Marketplace listing — feedback helps shape future updates.
