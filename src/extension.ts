import * as vscode from "vscode";
import { watchDiagnostics } from "./diagnostics";
import { registerHoverProvider } from "./hover";

export function activate(context: vscode.ExtensionContext) {
  console.log(
    'Congratulations, your extension "ai-error-explainer" is now active!',
  );

  watchDiagnostics(context);

  const hoverDisposable = registerHoverProvider();
  context.subscriptions.push(hoverDisposable);

  const helloDisposable = vscode.commands.registerCommand(
    "ai-error-explainer.helloWorld",
    () => {
      vscode.window.showInformationMessage(
        "Hello World from ai-error-explainer!",
      );
    },
  );
  context.subscriptions.push(helloDisposable);

  // ---------- Command to apply the fix ----------
  const applyFixDisposable = vscode.commands.registerCommand(
    "ai-error-explainer.applyFix",
    async (
      uriString: string,
      startLine: number,
      endLine: number,
      fixedCode: string,
    ) => {

      // Convert the URI string back to a vscode.Uri
      const uri = vscode.Uri.parse(uriString);
      const editor = await vscode.window.showTextDocument(uri);
      const document = editor.document;

      // Check if the document has changed since the hover was generated
      if (endLine >= document.lineCount) {
        vscode.window.showErrorMessage(
          "Cannot apply fix: the file has changed since this suggestion was generated. Please hover again.",
        );
        return;
      }

      const range = new vscode.Range(
        startLine,
        0,
        endLine,
        document.lineAt(endLine).text.length,
      );

      await editor.edit((editBuilder) => {
        editBuilder.replace(range, fixedCode);
      });

      vscode.window.showInformationMessage("Fix applied!");
    },
  );
  context.subscriptions.push(applyFixDisposable);
}

export function deactivate() {}
