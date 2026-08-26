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

      const MAX_SNIPPET_LENGTH = 1000;
      const trimmedSnippet =
        codeSnippet.length > MAX_SNIPPET_LENGTH
          ? codeSnippet.slice(0, MAX_SNIPPET_LENGTH) + "\n... (truncated)"
          : codeSnippet;

      const config = vscode.workspace.getConfiguration("aiErrorExplainer");
      const language = config.get<string>("language") || "English";

      const markdown = new vscode.MarkdownString();
      markdown.appendMarkdown(`### 🤖 AI Error Assistant\n\n`);
      markdown.appendMarkdown(`⏳ *AI explanation is loading...*`);

      const explanation = await explainError(
        diagnostic.message,
        trimmedSnippet,
        language,
      );

      const finalMarkdown = new vscode.MarkdownString();
      finalMarkdown.isTrusted = true;
      finalMarkdown.appendMarkdown(`### 🤖 AI Error Assistant\n\n`);
      finalMarkdown.appendMarkdown(
        `**What happened?**\n${explanation.summary}\n\n`,
      );
      finalMarkdown.appendMarkdown(`**Why?**\n${explanation.why}\n\n`);
      finalMarkdown.appendMarkdown(`**Fix:**\n${explanation.fix}`);

      // Add the "View Details" link to open the diagnosis panel
      const showPanelArgs = encodeURIComponent(
        JSON.stringify([
          JSON.stringify(explanation),
          document.uri.toString(),
          startLine,
          endLine,
        ]),
      );
      finalMarkdown.appendMarkdown(
        `\n\n[🔍 View Details](command:ai-error-explainer.showPanel?${showPanelArgs})`,
      );

      // Add the "Apply Fix" link if a fixedCode is provided
      if (explanation.fixedCode && explanation.fixedCode.trim().length > 0) {
        const args = encodeURIComponent(
          JSON.stringify([
            document.uri.toString(),
            startLine,
            endLine,
            explanation.fixedCode,
          ]),
        );
        finalMarkdown.appendMarkdown(
          ` &nbsp; [✅ Apply Fix](command:ai-error-explainer.applyFix?${args})`,
        );
      }

      return new vscode.Hover(finalMarkdown, diagnostic.range);
    },
  });
}
