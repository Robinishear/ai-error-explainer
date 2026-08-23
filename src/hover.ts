import * as vscode from "vscode";

export function registerHoverProvider(): vscode.Disposable {
  return vscode.languages.registerHoverProvider("*", {
    provideHover(document, position) {
      const diagnostics = vscode.languages.getDiagnostics(document.uri);
      const diagnostic = diagnostics.find((d) => d.range.contains(position));

      if (!diagnostic) {
        return;
      }

      const markdown = new vscode.MarkdownString();
      markdown.appendMarkdown(`### 🤖 AI Error Assistant\n\n`);
      markdown.appendMarkdown(`**Error:** ${diagnostic.message}\n\n`);
      markdown.appendMarkdown(`*(AI explanation coming in the next phase)*`);

      return new vscode.Hover(markdown, diagnostic.range);
    },
  });
}

