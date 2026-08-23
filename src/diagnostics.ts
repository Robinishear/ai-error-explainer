import * as vscode from "vscode";

export function watchDiagnostics(context: vscode.ExtensionContext) {
  const disposable = vscode.languages.onDidChangeDiagnostics((event) => {
    for (const uri of event.uris) {
      const diagnostics = vscode.languages.getDiagnostics(uri);
      if (diagnostics.length > 0) {
        console.log(
          `Found ${diagnostics.length} diagnostic(s) in ${uri.fsPath}`,
        );
        diagnostics.forEach((d) => {
          console.log(`- ${d.message} (line ${d.range.start.line + 1})`);
        });
      }
    }
  });

  context.subscriptions.push(disposable);
}
