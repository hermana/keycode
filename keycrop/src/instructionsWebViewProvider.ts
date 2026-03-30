import * as vscode from 'vscode';

export class InstructionsWebViewProvider implements vscode.WebviewViewProvider {

  public static readonly viewType = 'instructions';
  private view?: vscode.WebviewView;

  constructor(private readonly context: vscode.ExtensionContext) {}

  public resolveWebviewView(webviewView: vscode.WebviewView, _context: vscode.WebviewViewResolveContext, _token: vscode.CancellationToken): Thenable<void> | void {
    this.view = webviewView;

    const webview = webviewView.webview;

    webview.options = {
      enableScripts: true
    };

    webview.html = this.getHtmlContent(webview);
  }

  private getHtmlContent(webview: vscode.Webview): string {

    const style = webview.asWebviewUri(vscode.Uri.joinPath(this.context.extensionUri, 'src/media', 'style.css'));
    const webviewJS = webview.asWebviewUri(vscode.Uri.joinPath(this.context.extensionUri, 'dist/media', 'webview.js'));
    const iconsPath = webview.asWebviewUri(vscode.Uri.joinPath(this.context.extensionUri, 'src/media/vegetables'));

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
          <!-- how many plants to make it to the next level -->
          <div class="table-scroll">
            <table class="key-table">
              <thead>
                <tr>
                  <th>Hotkey</th>
                  <th>Description</th>
                </tr>
              </thead>
              <tbody>
                <tr><td>CTRL+SHIFT+SPACE</td><td>See function parameter hints.</td></tr>
                <tr><td>CTRL+SHIFT+M</td><td>See warnings and errors in the Problems view.</td></tr>
                <tr><td>CTRL+SHIFT+L</td><td>Multicursor-select all instances of a specific word.</td></tr>
                <tr><td>CTRL+\\</td><td>Split editor.</td></tr>
                <tr><td>CTRL+[</td><td>Outdent a line.</td></tr>
                <tr><td>CTRL+SHIFT+P</td><td>Open command palette.</td></tr>
                <tr><td>CTRL+SHIFT+K</td><td>Delete current line.</td></tr>
                <tr><td>CTRL+SHIFT+\\</td><td>Jump to bracket.</td></tr>
                <tr><td>CTRL+T</td><td>Show all symbols.</td></tr>
                <tr><td>CTRL+SHIFT+O</td><td>Go to symbol in workspace.</td></tr>
                <tr><td>CTRL+SHIFT+TAB</td><td>Open the last used editor.</td></tr>
                <tr><td>CTRL+\`</td><td>Toggle terminal.</td></tr>
                <tr><td>CTRL+SHIFT+\`</td><td>Create new terminal.</td></tr>
              </tbody>
            </table>
          </div>
        </div>
        <script src="${webviewJS}"></script>
      </body>
      </html>
    `;
  }
}
