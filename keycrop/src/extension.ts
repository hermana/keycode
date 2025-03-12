import * as vscode from 'vscode'
import * as fs from 'fs';
import * as path from 'path';
//import { WebViewProvider} from './providers/webviewprovider';

let webview: WebViewProvider;
let config = vscode.workspace.getConfiguration('keycrop');
let extensionStorageFolder: string = '';
let plantsPath: string;


//FIXME: move this? and all plant stuff
type Plant = { 
  //There will be different plant types in the future
  type: string; 
}

function loadPlantsFile() {
  //Storage folder does not exist
  if (!fs.existsSync(extensionStorageFolder)) fs.mkdirSync(extensionStorageFolder, { recursive: true });

  //Read plants file
  if (fs.existsSync(plantsPath)) {
    //Read plants from pets.json
    try {
      //Try to read plants file
      plants = JSON.parse(fs.readFileSync(plantsPath, 'utf8'));
      if (!Array.isArray(plants)) plants = new Array<Plant>();
    } catch (e) {
      //Failed -> Reset pets
      plants = new Array<Plant>();
    }
  } else {
    //Create plants.json file
    savePlants();
  }
}

function savePlants() {
  fs.writeFileSync(plantsPath, JSON.stringify(plants, null, 2));
}

let plants = new Array<Plant>();

function loadPlant(plant: Plant) {
  //Sends a plant to the webview
  webview.postMessage({
    action: 'add',
    type: plant.type
  })
}

function growPlant(plant: Plant) {
  if(plants.some(p => p.type === plant.type)){
    console.log("THIS PLANT ALREADY EXISTS");
  }else{
    vscode.window.showInformationMessage(`A new plant has sprouted in the greenhouse!`);
    plants.push(plant);
    savePlants();
    //load pet in webview
    loadPlant(plant);
  }

}

export function activate(context: vscode.ExtensionContext) {

  extensionStorageFolder = context.globalStorageUri.path.substring(1);
  plantsPath = path.join(extensionStorageFolder, 'plants.json');

	webview = new WebViewProvider(context);
	context.subscriptions.push(vscode.window.registerWebviewViewProvider(WebViewProvider.viewType, webview));
    
  //Load existing plants array
  loadPlantsFile();

	vscode.workspace.onDidChangeConfiguration(event => {
		  
	  console.log("configuration change registered!");
	  //Update config
	  config = vscode.workspace.getConfiguration('keycrop');



	  //Background changed
	  if (event.affectsConfiguration("keycrop.background")) {
		webview.postMessage({
		  action: 'background',
		  value: config.get('background')
		})
	  }
  
    if (event.affectsConfiguration("keycrop-view.scale")) {
      webview.postMessage({
        action: 'scale',
        value: config.get('scale')
      })
    }
})

  const helloWorld = vscode.commands.registerCommand('keycrop.helloWorld', () => {
    vscode.window.showInformationMessage(`Hello world from keycrop!`);
  });

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	const growBasil = vscode.commands.registerCommand('keycrop.growBasil', () => {
      growPlant({
        type: "basil",
      });
	});
	context.subscriptions.push(growBasil, helloWorld);

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
        switch (message.action) {
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
              action: 'background',
              value: config.get('background')
            })
  
            //Send scale
            // webview.postMessage({
            //   type: 'scale',
            //   value: config.get('scale')
            // })
  
            plants.forEach(plant => { loadPlant(plant); });
            break;
        }
      });
    }
  
    private getHtmlContent(webview: vscode.Webview): string {
      //You can reference local files (like CSS or JS) via vscode-resource URIs
	  const style = webview.asWebviewUri(vscode.Uri.joinPath(this.context.extensionUri, 'src/media', 'style.css'));
    const mainJS = webview.asWebviewUri(vscode.Uri.joinPath(this.context.extensionUri, 'src/media', 'main.js'));
    const plantsJS = webview.asWebviewUri(vscode.Uri.joinPath(this.context.extensionUri, 'src/media', 'plants.js'));
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
          <script src="${plantsJS}"></script>
        </body>
        </html>
      `;
    }
  }