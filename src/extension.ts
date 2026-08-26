import * as vscode from "vscode";
import { watchDiagnostics } from "./diagnostics";
import { registerHoverProvider } from "./hover";
import { showDiagnosisPanel, initWebview } from "./webviewPanel";

export function activate(context: vscode.ExtensionContext) {
  console.log(
    'Congratulations, your extension "ai-error-explainer" is now active!',
  );

  initWebview(context.extensionUri);

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

  // ---------- Command to open the diagnosis panel ----------
  const showPanelDisposable = vscode.commands.registerCommand(
    "ai-error-explainer.showPanel",
    (explanationJson: string) => {
      const explanation = JSON.parse(explanationJson);
      showDiagnosisPanel(explanation);
    },
  );
  context.subscriptions.push(showPanelDisposable);
}

export function deactivate() {}
