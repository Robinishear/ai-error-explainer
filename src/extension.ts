import * as vscode from "vscode";
import { watchDiagnostics } from "./diagnostics";

export function activate(context: vscode.ExtensionContext) {
  console.log(
    'Congratulations, your extension "ai-error-explainer" is now active!',
  );

  watchDiagnostics(context); 

  const disposable = vscode.commands.registerCommand(
    "ai-error-explainer.helloWorld",
    () => {
      vscode.window.showInformationMessage(
        "Hello World from ai-error-explainer!",
      );
    },
  );

  context.subscriptions.push(disposable);
}

export function deactivate() {}
