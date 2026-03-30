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
          <p class="instructions">Congratulations, you've managed to power up the KeyCrop Greenhouse! To unlock more seeds, all of the following plants must be harvested. </p>
          <!-- how many plants to make it to the next level -->
          <p class="key-instruction"><img src="${iconsPath+'/chilli_harvested.png'}" alt="Chili" width="20" height="20"> <span class="instruction-bold"> CTRL+SHIFT+SPACE</span>: See function parameter hints.</p>
          <p class="key-instruction"><img src="${iconsPath+'/bean_harvested.png'}" alt="Bean" width="20" height="20"> <span class="instruction-bold"> CTRL+SHIFT+M</span>: See warnings and errors in the Problems view.</p>
          <p class="key-instruction"><img src="${iconsPath+'/tomato_harvested.png'}" alt="Tomato" width="20" height="20"> <span class="instruction-bold"> CTRL+SHIFT+L</span>: Multicursor-select all instances of a specific word.</p>
          <p class="key-instruction"><img src="${iconsPath+'/lettuce_harvested.png'}" alt="Lettuce" width="20" height="20"> <span class="instruction-bold"> CTRL+/</span>: Comment or un-comment code.</p>
          <p class="key-instruction"><img src="${iconsPath+'/broccoli_harvested.png'}" alt="Broccoli" width="20" height="20"> <span class="instruction-bold"> CTRL+[</span>: Outdent a line.</p>
        </div>
        <script src="${webviewJS}"></script>
      </body>
      </html>
    `;
  }
}
