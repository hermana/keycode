import * as vscode from 'vscode'
import * as fs from 'fs';
import * as path from 'path';

let webview: WebViewProvider;
let config = vscode.workspace.getConfiguration('keycrop');
let extensionStorageFolder: string = '';
let plantsPath: string;


type Plant = { 
  species: string; 
  size: string;
}

function loadPlantsFile() {
  //Storage folder does not exist
  if (!fs.existsSync(extensionStorageFolder)) fs.mkdirSync(extensionStorageFolder, { recursive: true });

  //Read plants file
  if (fs.existsSync(plantsPath)) {
    try {
      //Try to read plants file
      plants = JSON.parse(fs.readFileSync(plantsPath, 'utf8'));
      if (!Array.isArray(plants)) plants = new Array<Plant>();
    } catch (e) {
      //Failed -> Reset plants
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

function addPlant(plant: Plant) {
  webview.postMessage({
    action: 'add',
    species: plant.species
  })
}

function growPlant(plant: Plant) {
  if(plants.some(p => p.species === plant.species)){
    //FIXME: am i doing multiple?
    let patch = plants.filter(p =>p.species === plant.species);
    patch.forEach( p => 
    {
      webview.postMessage({
        action: 'grow',
        species: plant.species
      })
      //loadPlant(p);
    }
    );
  }else{
    vscode.window.showInformationMessage("A new " +plant.species +" plant has sprouted in the greenhouse!");
    plants.push(plant);
    savePlants();
    addPlant(plant);
  }

}

export function activate(context: vscode.ExtensionContext) {

  extensionStorageFolder = context.globalStorageUri.path.substring(1);
  plantsPath = path.join(extensionStorageFolder, 'plants.json');

    //Load existing plants array
  loadPlantsFile();

	webview = new WebViewProvider(context);
	context.subscriptions.push(vscode.window.registerWebviewViewProvider(WebViewProvider.viewType, webview));
    


	vscode.workspace.onDidChangeConfiguration(event => {
	
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


	const growBean = vscode.commands.registerCommand('keycrop.growBean', () => {
      growPlant({
        species: "bean",
        size: "small" //TODO: left off here
      });
	});

  const growChili = vscode.commands.registerCommand('keycrop.growChili', () => {
    growPlant({
      species: "chili",
      size: "small"
    });
  });

  const growBroccoli = vscode.commands.registerCommand('keycrop.growBroccoli', () => {
    growPlant({
      species: "broccoli",
      size: "small"
    });
  })

  const growLettuce = vscode.commands.registerCommand('keycrop.growLettuce', () => {
    growPlant({
      species: "lettuce",
      size: "small"
    });
  })

  const growTomato = vscode.commands.registerCommand('keycrop.growTomato', () => {
    growPlant({
      species: "tomato",
      size: "small"
    });
  })

	context.subscriptions.push(growBean, growChili, growBroccoli, growLettuce, growTomato, helloWorld);

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
              action: 'background',
              value: 'dirt'
            })
            plants.forEach(plant => { addPlant(plant); });
            break;
          case 'level_one':
            console.log("LEVEL ONE ACHEIVED");
            vscode.window.showInformationMessage("Congratulations! You have finished the game!");
            break;
  
            //Send scale
            // webview.postMessage({
            //   type: 'scale',
            //   value: config.get('scale')
            // })

        }
      });
    }


    private getHtmlContent(webview: vscode.Webview): string {

      const style = webview.asWebviewUri(vscode.Uri.joinPath(this.context.extensionUri, 'src/media', 'style.css'));
      const mainJS = webview.asWebviewUri(vscode.Uri.joinPath(this.context.extensionUri, 'src/media', 'main.js'));
      const plantsJS = webview.asWebviewUri(vscode.Uri.joinPath(this.context.extensionUri, 'src/media', 'plants.js'));
      const levelsJS = webview.asWebviewUri(vscode.Uri.joinPath(this.context.extensionUri, 'src/media', 'levels.js'));


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
          <button class="btn" id="inventory-button">See Inventory</button>
          <button class="btn" id="greenhouse-button" hidden="true">See Greenhouse</button>
          </div>
          <script src="${mainJS}"></script>
          <script src="${plantsJS}"></script>
          <script src="${levelsJS}"></script>
        </body>
        </html>
      `;
    }
  }

