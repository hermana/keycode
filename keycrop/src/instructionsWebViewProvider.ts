import * as vscode from 'vscode';
import { KEY_MAP } from './keyMap';

export class InstructionsWebViewProvider implements vscode.WebviewViewProvider {

  public static readonly viewType = 'instructions';
  private _view?: vscode.WebviewView;

  constructor(
    private readonly context: vscode.ExtensionContext,
    private readonly getHotkeyCounts: () => Record<string, number>,
    private readonly onViewEvent?: (event: 'opened' | 'closed') => void
  ) {}

  public postMessage(message: any): void {
    this._view?.webview.postMessage(message);
  }

  public resolveWebviewView(webviewView: vscode.WebviewView, _context: vscode.WebviewViewResolveContext, _token: vscode.CancellationToken): Thenable<void> | void {
    this._view = webviewView;
    this.onViewEvent?.('opened');
    webviewView.onDidChangeVisibility(() => this.onViewEvent?.(webviewView.visible ? 'opened' : 'closed'));
    webviewView.onDidDispose(() => this.onViewEvent?.('closed'));

    const webview = webviewView.webview;

    webview.options = {
      enableScripts: true
    };

    webview.html = this.getHtmlContent(webview);

    webview.onDidReceiveMessage((message) => {
      if (message.type === 'init') {
        webview.postMessage({ action: 'update_counts', counts: this.getHotkeyCounts() });
      }
    });
  }

  private getHtmlContent(webview: vscode.Webview): string {

    const style = webview.asWebviewUri(vscode.Uri.joinPath(this.context.extensionUri, 'dist/media', 'style.css'));

    const activeKeys = KEY_MAP.filter(k => k.active);

    const categories = [...new Set(activeKeys.map(k => k.category))];

    const categoryButtons = categories.map(cat =>
      `<button class="category-btn" data-category="${cat}">${cat}</button>`
    ).join('\n        ');

    const tableRows = activeKeys.map(k =>
      `<tr data-category="${k.category}" data-command="${k.command}"><td>${k.capital_key}</td><td>${k.description}</td><td class="use-count">0</td></tr>`
    ).join('\n                ');

    return `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <link href="${style}" rel="stylesheet">
        <title>KeyCrop Instructions</title>
      </head>
      <body>
        <div id="generator-instructions">
          <div class="table-scroll">
            <table class="key-table">
              <thead>
                <tr>
                  <th>Hotkey</th>
                  <th>Description</th>
                  <th>Uses</th>
                </tr>
              </thead>
              <tbody>
                ${tableRows}
              </tbody>
            </table>
          </div>
          <div class="category-btn-row">
            ${categoryButtons}
          </div>
        </div>
        <script>
          const vscode = acquireVsCodeApi();
          vscode.postMessage({ type: 'init' });

          window.addEventListener('message', (event) => {
            const message = event.data;
            if (message.action === 'update_counts') {
              Object.entries(message.counts).forEach(([cmd, count]) => {
                const row = document.querySelector('tr[data-command="' + cmd + '"]');
                if (row) { row.querySelector('.use-count').textContent = String(count); }
              });
            }
          });

          const buttons = document.querySelectorAll('.category-btn');
          const rows = document.querySelectorAll('tbody tr');

          let activeCategory = null;

          buttons.forEach(btn => {
            btn.addEventListener('click', () => {
              const cat = btn.dataset.category;
              if (activeCategory === cat) {
                activeCategory = null;
                buttons.forEach(b => b.classList.remove('selected'));
                rows.forEach(r => r.style.display = '');
              } else {
                activeCategory = cat;
                buttons.forEach(b => b.classList.toggle('selected', b.dataset.category === cat));
                rows.forEach(r => {
                  r.style.display = r.dataset.category === cat ? '' : 'none';
                });
              }
            });
          });
        </script>
      </body>
      </html>
    `;
  }
}
