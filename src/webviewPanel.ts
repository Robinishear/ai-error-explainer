import * as vscode from "vscode";
import type { AIExplanation } from "./ai";

let currentPanel: vscode.WebviewPanel | undefined;
let extensionUri: vscode.Uri;

export function initWebview(uri: vscode.Uri) {
  extensionUri = uri;
}

export function showDiagnosisPanel(
  explanation: AIExplanation,
  uriString: string,
  startLine: number,
  endLine: number,
) {
  if (currentPanel) {
    currentPanel.reveal(vscode.ViewColumn.Beside);
  } else {
    currentPanel = vscode.window.createWebviewPanel(
      "aiErrorDiagnosis",
      "AI Diagnosis",
      vscode.ViewColumn.Beside,
      {
        enableScripts: true,
        localResourceRoots: [
          vscode.Uri.joinPath(
            extensionUri,
            "node_modules",
            "@vscode/codicons",
            "dist",
          ),
        ],
      },
    );

    currentPanel.onDidDispose(() => {
      currentPanel = undefined;
    });

    currentPanel.webview.onDidReceiveMessage((message) => {
      if (message.command === "applyFix") {
        vscode.commands.executeCommand(
          "ai-error-explainer.applyFix",
          uriString,
          startLine,
          endLine,
          message.fixedCode,
        );
        currentPanel?.dispose();
      }
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
    vscode.Uri.joinPath(
      extensionUri,
      "node_modules",
      "@vscode/codicons",
      "dist",
      "codicon.css",
    ),
  );

  const hasFix =
    explanation.fixedCode && explanation.fixedCode.trim().length > 0;

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
  .badge.fixready { background: #04342c; color: #5dcaa5; }
  .section { margin-bottom: 1rem; }
  .label {
    font-size: 11px;
    color: #9ca3af;
    margin-bottom: 4px;
    display: flex;
    align-items: center;
    gap: 6px;
  }
  .value { font-size: 14px; color: #e5e7eb; line-height: 1.5; }
  .code-box {
    background: #232730;
    border-radius: 8px;
    padding: 10px 12px;
    margin-bottom: 1rem;
    font-family: var(--vscode-editor-font-family);
    font-size: 13px;
    color: #5eead4;
    white-space: pre-wrap;
  }
  button {
    width: 100%;
    background: #5eead4;
    color: #04342c;
    border: none;
    border-radius: 8px;
    padding: 10px;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
  }
  button:disabled { opacity: 0.5; cursor: not-allowed; }
</style>
</head>
<body>
  <div class="badges">
    <span class="badge detected"><i class="codicon codicon-bug"></i> detected</span>
    <span class="badge diagnosed"><i class="codicon codicon-lightbulb"></i> diagnosed</span>
    ${hasFix ? '<span class="badge fixready"><i class="codicon codicon-check"></i> fix ready</span>' : ""}
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

  ${hasFix ? `<div class="code-box">${escapeHtml(explanation.fixedCode!)}</div>` : ""}

  <button id="applyBtn" ${hasFix ? "" : "disabled"}>
    <i class="codicon codicon-check"></i> apply fix
  </button>

  <script>
    const vscode = acquireVsCodeApi();
    document.getElementById('applyBtn').addEventListener('click', () => {
      vscode.postMessage({
        command: 'applyFix',
        fixedCode: ${hasFix ? JSON.stringify(explanation.fixedCode) : "''"}
      });
    });
  </script>
</body>
</html>`;
}
