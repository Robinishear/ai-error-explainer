# AI Error Explainer

**AI-powered error explanations, right inside VS Code.**

Hover over any error or warning to get a clear, plain-language diagnosis of what went wrong, why it happened, and how to fix it — powered by the AI of *your* choice.

![Version](https://img.shields.io/badge/version-1.2.0-5eead4)
![License](https://img.shields.io/badge/license-MIT-blue)
![Languages](https://img.shields.io/badge/languages-18-orange)
![Providers](https://img.shields.io/badge/AI%20providers-5-purple)

---

## Table of Contents

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

## Why This Extension?

Cryptic error messages waste time. Instead of copy-pasting errors into a browser tab and searching through forum posts, get an instant, plain-language diagnosis without ever leaving your editor.

This extension follows one core principle: **bring your own key**. There's no subscription, no server in the middle, and no vendor lock-in — you choose the AI provider you already trust, and every request goes directly from your machine to theirs.

---

## Features

| | |
|---|---|
|  **Automatic error detection** | Works with any language VS Code already understands — TypeScript, JavaScript, Python, Go, and more |
|  **AI-powered explanations** | Plain-language breakdown: what happened, why, and how to fix it |
|  **Detailed diagnosis panel** | Click "View Details" for a clean, dedicated breakdown of the full diagnosis |
|  **42 languages supported** | English, বাংলা, Hindi, Urdu, Arabic, Chinese, Japanese, Spanish, and more |
| **Bring Your Own Key (BYOK)** | Use any provider's API key — you're never dependent on ours, and you never pay us |
| **Zero data collection** | Nothing is logged, stored, or sent anywhere except the AI provider you configure |

---

## Supported AI Providers

Use whichever AI you already have access to — free or paid:

| Provider | Get a free key |
|---|---|
| **OpenRouter** *(access any model, free or paid)* | [openrouter.ai/keys](https://openrouter.ai/keys) |
| **Google Gemini** | [aistudio.google.com/apikey](https://aistudio.google.com/apikey) |
| **OpenAI** | [platform.openai.com/api-keys](https://platform.openai.com/api-keys) |
| **Anthropic (Claude)** | [console.anthropic.com](https://console.anthropic.com) |
| **DeepSeek** | [platform.deepseek.com](https://platform.deepseek.com) |

Already have a subscription to one of these? You can use the same API key here — no extra cost.

---

## Example

**Before** — you hit a confusing error:

    const users = getUsers();
    users.map(user => console.log(user.name));

    TypeError: Cannot read properties of undefined (reading 'map')

**Hover over the red underline**, and AI Error Explainer instantly shows:

> **AI Error Assistant**
>
> **What happened?** The `users` variable is undefined.
> **Why?** `getUsers()` did not return an array.
> **Fix:** Make sure `getUsers()` returns an array, or add a fallback like `getUsers() || []`.
>
>  **View Details**

Click **View Details** to open a dedicated side panel with a clean, full breakdown — no squinting at a tiny tooltip.

---

## Setup

1. **Install** the extension from the VS Code Marketplace
2. **Get a free API key** from any provider in the table above
3. Open **VS Code Settings** (`Ctrl+,`) and search for **"AI Error Explainer"**
4. Set **Provider** to match your key's source
5. Paste your key into **Api Key**
6. *(Optional)* Set your preferred **Language**
7. That's it — hover over any error or warning in your code

---

## How It Works

    Your code
       ↓
    VS Code detects an error
       ↓
    You hover over it
       ↓
    Extension sends the error message + a few nearby lines to your chosen AI
       ↓
    AI explains what happened, why, and how to fix it
       ↓
    Click "View Details" for the full diagnosis

Only a small snippet — the error message and a few surrounding lines — is ever shared. Never your whole file, never your whole project.

---

## Settings Reference

| Setting | Description | Default |
|---|---|---|
| `aiErrorExplainer.provider` | Which AI provider to use: `openrouter`, `openai`, `gemini`, `anthropic`, or `deepseek` | `openrouter` |
| `aiErrorExplainer.apiKey` | Your API key for the selected provider | *(empty)* |
| `aiErrorExplainer.openrouterModel` | Which model to use when provider is `openrouter` | `nvidia/nemotron-3.5-lightning:free` |
| `aiErrorExplainer.language` | Language for AI explanations (42 supported) | `English` |

---

## Privacy & Security

- ✅ **No data is collected or stored by this extension.** Nothing is sent to any server we control — there is no "we" in the data path at all.
- ✅ **Your API key never leaves your machine** except to talk directly to the provider you chose. It's stored in VS Code's local settings, same as any other extension setting.
- ✅ **Only a small snippet is shared** — the error message and a few nearby lines, never your whole file.
- ✅ **This extension never modifies your code.** It only explains errors — it does not apply or suggest automatic changes to your files.
- ✅ **No telemetry, no analytics, no tracking.**

---

## FAQ

**Is this free to use?**
The extension itself is completely free. Whether *using it* is free depends on your chosen AI provider — OpenRouter and Gemini both offer generous free tiers.

**Do I need to pay you anything?**
No. There is no subscription, no license key, and no payment to us at all. You pay (or don't pay) your AI provider directly.

**Which provider should I pick if I have no key yet?**
Start with **Google Gemini** — it has one of the most generous free tiers and takes under a minute to set up.

**Why isn't there an "Apply Fix" button?**
Early versions had one, but auto-replacing multiple lines of code carries real risk of breaking working code — especially in larger files. We'd rather give you a clear, trustworthy explanation than a risky auto-edit.

**My AI provider says "rate limit exceeded" — is this extension broken?**
No — that message comes directly from your provider's free tier limit, not from a bug in the extension. Wait for the limit to reset, or switch providers in Settings.

---

## Known Limitations

- Free-tier AI models may respond more slowly or hit rate limits depending on the provider and time of day
- Very large code blocks are truncated before being sent to the AI to keep requests fast and affordable
- This extension only **explains** errors — it does not automatically modify your code

---

## License

MIT — free to use, modify, and share. See the LICENSE file included with this extension for details.
---

## Author

Built by **Robin Ryan**, a full-stack developer from Bangladesh.

If you run into an issue or have a feature request, feel free to leave a review or rating on the Marketplace listing — feedback helps shape future updates.