import * as vscode from 'vscode'
//import { WebViewProvider} from './providers/webviewprovider';

let webview: WebViewProvider;
let config = vscode.workspace.getConfiguration('keycrop');


export function activate(context: vscode.ExtensionContext) {


	webview = new WebViewProvider(context);
	context.subscriptions.push(vscode.window.registerWebviewViewProvider(WebViewProvider.viewType, webview));
  
	vscode.workspace.onDidChangeConfiguration(event => {
		  
	  console.log("configuration change registered!");
	  //Update config
	  config = vscode.workspace.getConfiguration('keycrop');



	  //Background changed
	  if (event.affectsConfiguration("keycrop.background")) {
		webview.postMessage({
		  type: 'background',
		  value: config.get('background')
		})
	  }
  
    if (event.affectsConfiguration("keycrop-view.scale")) {
      webview.postMessage({
        type: 'scale',
        value: config.get('scale')
      })
    }
})

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	const disposable = vscode.commands.registerCommand('keycrop.helloWorld', () => {
		vscode.window.showInformationMessage('Hello World from keycrop!');
	});
	context.subscriptions.push(disposable);

}

// This method is called when your extension is deactivated
export function deactivate() {}


export class WebViewProvider implements vscode.WebviewViewProvider {

    public static readonly viewType = 'keycrop'; //TODO: may be able to switch views later
  
    private view ?: vscode.WebviewView;
  
    constructor(private readonly context: vscode.ExtensionContext) {}
  
    public postMessage(message: any) {
      this.view?.webview.postMessage(message);
    }
  
    public resolveWebviewView(webviewView: vscode.WebviewView, context: vscode.WebviewViewResolveContext, _token: vscode.CancellationToken) {
      this.view = webviewView; //Needed so we can use it in postMessageToWebview
  
      const webview = webviewView.webview;
  
      //Allow scripts in the webview
      webview.options = {
        enableScripts: true 
      };
  
      //Set the HTML content for the webview
      webview.html = this.getHtmlContent(
        webviewView.webview,
      );
  
      //Handle messages
      webview.onDidReceiveMessage((message) => {
        switch (message.type) {
          //Error message
          case 'error':
            vscode.window.showErrorMessage(message.text);
            break;
  
          //Info message
          case 'info':
            vscode.window.showInformationMessage(message.text);
            break;
  
          case 'init':
            //Send background
            webview.postMessage({
              type: 'background',
              value: config.get('background')
            })
  
            //Send scale
            // webview.postMessage({
            //   type: 'scale',
            //   value: config.get('scale')
            // })
  
            //Load plants eventually
            // plant.forEach(plant => { loadPet(plant); });
            break;
        }
      });
    }
  
    private getHtmlContent(webview: vscode.Webview): string {
      //You can reference local files (like CSS or JS) via vscode-resource URIs
	  const style = webview.asWebviewUri(vscode.Uri.joinPath(this.context.extensionUri, 'src/media', 'style.css'));
    const mainJS = webview.asWebviewUri(vscode.Uri.joinPath(this.context.extensionUri, 'media', 'main.js'));
 		//   I may add this content policy back: <meta http-equiv="Content-Security-Policy" content="default-src 'none';"> 

      return ` 
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <link href="${style}" rel="stylesheet">

          <title>KeyCrop</title>
        </head>
        <body>
          <div id="keycrop" background="${config.get('background')}">
          </div>
          <script src="${mainJS}"></script>
        </body>
        </html>
      `;
    }
  }