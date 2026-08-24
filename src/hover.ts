import * as vscode from "vscode";
import { explainError } from "./ai";

export function registerHoverProvider(): vscode.Disposable {
  return vscode.languages.registerHoverProvider("*", {
    async provideHover(document, position) {
      const diagnostics = vscode.languages.getDiagnostics(document.uri);
      const diagnostic = diagnostics.find((d) => d.range.contains(position));

      if (!diagnostic) {
        return;
      }

      // আশেপাশের কয়েক লাইন কোড নেওয়া (Security-এর জন্য পুরো ফাইল না)
      const startLine = Math.max(0, diagnostic.range.start.line - 3);
      const endLine = Math.min(
        document.lineCount - 1,
        diagnostic.range.end.line + 3,
      );
      const codeSnippet = document.getText(
        new vscode.Range(
          startLine,
          0,
          endLine,
          document.lineAt(endLine).text.length,
        ),
      );

      const config = vscode.workspace.getConfiguration("aiErrorExplainer");
      const language = config.get<string>("language") || "English";

      const markdown = new vscode.MarkdownString();
      markdown.appendMarkdown(`### 🤖 AI Error Assistant\n\n`);
      markdown.appendMarkdown(`⏳ *AI explanation লোড হচ্ছে...*`);

      // AI-কে কল করা (এটা একটু সময় নিতে পারে)
      const explanation = await explainError(
        diagnostic.message,
        codeSnippet,
        language,
      );

      const finalMarkdown = new vscode.MarkdownString();
      finalMarkdown.appendMarkdown(`### 🤖 AI Error Assistant\n\n`);
      finalMarkdown.appendMarkdown(
        `**কী হয়েছে?**\n${explanation.summary}\n\n`,
      );
      finalMarkdown.appendMarkdown(`**কেন হয়েছে?**\n${explanation.why}\n\n`);
      finalMarkdown.appendMarkdown(`**সমাধান:**\n${explanation.fix}`);

      return new vscode.Hover(finalMarkdown, diagnostic.range);
    },
  });
}
