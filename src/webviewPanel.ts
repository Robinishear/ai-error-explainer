import * as vscode from "vscode";
import type { AIExplanation } from "./ai";

let currentPanel: vscode.WebviewPanel | undefined;
let extensionUri: vscode.Uri;

export function initWebview(uri: vscode.Uri) {
  extensionUri = uri;
}

export function showDiagnosisPanel(explanation: AIExplanation) {
  if (currentPanel) {
    currentPanel.reveal(vscode.ViewColumn.Beside);
  } else {
    currentPanel = vscode.window.createWebviewPanel(
      "aiErrorDiagnosis",
      "AI Diagnosis",
      vscode.ViewColumn.Beside,
      {
        enableScripts: false,
        localResourceRoots: [vscode.Uri.joinPath(extensionUri, "media")],
      },
    );

    currentPanel.onDidDispose(() => {
      currentPanel = undefined;
    });
  }

  currentPanel.webview.html = buildHtml(explanation, currentPanel.webview);
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function buildHtml(
  explanation: AIExplanation,
  webview: vscode.Webview,
): string {
  const codiconsUri = webview.asWebviewUri(
    vscode.Uri.joinPath(extensionUri, "media", "codicon.css"),
  );

  return `<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<link href="${codiconsUri}" rel="stylesheet">
<style>
  body {
    font-family: var(--vscode-font-family);
    background: #1a1d23;
    color: #e5e7eb;
    padding: 1.5rem;
  }
  .badges { display: flex; gap: 8px; margin-bottom: 1.25rem; }
  .badge {
    font-size: 11px;
    padding: 3px 10px;
    border-radius: 20px;
    display: inline-flex;
    align-items: center;
    gap: 4px;
  }
  .badge.detected { background: #501313; color: #f7c1c1; }
  .badge.diagnosed { background: #412402; color: #fac775; }
  .section { margin-bottom: 1.25rem; }
  .label {
    font-size: 12px;
    color: #9ca3af;
    margin-bottom: 6px;
    display: flex;
    align-items: center;
    gap: 6px;
  }
  .value { font-size: 14px; color: #e5e7eb; line-height: 1.6; }
</style>
</head>
<body>
  <div class="badges">
    <span class="badge detected"><i class="codicon codicon-bug"></i> detected</span>
    <span class="badge diagnosed"><i class="codicon codicon-lightbulb"></i> diagnosed</span>
  </div>

  <div class="section">
    <div class="label"><i class="codicon codicon-search"></i> symptom</div>
    <div class="value">${escapeHtml(explanation.summary)}</div>
  </div>

  <div class="section">
    <div class="label"><i class="codicon codicon-question"></i> cause</div>
    <div class="value">${escapeHtml(explanation.why)}</div>
  </div>

  <div class="section">
    <div class="label"><i class="codicon codicon-tools"></i> prescription</div>
    <div class="value">${escapeHtml(explanation.fix)}</div>
  </div>
</body>
</html>`;
}
