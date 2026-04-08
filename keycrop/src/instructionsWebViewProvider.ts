import * as vscode from 'vscode';
import { KEY_MAP } from './keyMap';

export class InstructionsWebViewProvider implements vscode.WebviewViewProvider {

  public static readonly viewType = 'instructions';
  private _view?: vscode.WebviewView;

  constructor(private readonly context: vscode.ExtensionContext) {}

  public resolveWebviewView(webviewView: vscode.WebviewView, _context: vscode.WebviewViewResolveContext, _token: vscode.CancellationToken): Thenable<void> | void {
    this._view = webviewView;

    const webview = webviewView.webview;

    webview.options = {
      enableScripts: true
    };

    webview.html = this.getHtmlContent(webview);
  }

  private getHtmlContent(webview: vscode.Webview): string {

    const style = webview.asWebviewUri(vscode.Uri.joinPath(this.context.extensionUri, 'src/media', 'style.css'));
    const webviewJS = webview.asWebviewUri(vscode.Uri.joinPath(this.context.extensionUri, 'dist/media', 'webview.js'));

    const categories = [...new Set(KEY_MAP.map(k => k.category))];

    const categoryButtons = categories.map(cat =>
      `<button class="category-btn" data-category="${cat}">${cat}</button>`
    ).join('\n        ');

    const tableRows = KEY_MAP.map(k =>
      `<tr data-category="${k.category}"><td>${k.capital_key}</td><td>${k.description}</td></tr>`
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
        <script src="${webviewJS}"></script>
      </body>
      </html>
    `;
  }
}
