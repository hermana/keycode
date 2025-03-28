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
  harvested: boolean;
  hotkey_uses: number
}

function loadPlantsFile() {
  //Storage folder does not exist
  if (!fs.existsSync(extensionStorageFolder)) fs.mkdirSync(extensionStorageFolder, { recursive: true });

  //Read plants file
  if (fs.existsSync(plantsPath)) {
    try {
      //Try to read plants file
      let savedPlants = JSON.parse(fs.readFileSync(plantsPath, 'utf8'));
      Object.entries(savedPlants).forEach((p: any) => {
        webview.postMessage({
          action: 'load',
          species: p[1].species,
          size: p[1].size,
          harvested: p[1].harvested, 
          hotkey_uses: p[1].hotkey_uses
        })
        plants.push({species: p[1].species, size: p[1].size, harvested: p[1].harvested, hotkey_uses: p[1].hotkey_uses});
      })
    } catch (e) {
      //Failed -> Reset plants
      console.error('Saved plants could not be loaded');
      console.error(e);
      plants = new Array<Plant>();
    }
  } else {
    plants = new Array<Plant>();
  }
}

function savePlants() {
  webview.postMessage({
    action: 'save_plants'
  })
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
    }
    );
  }else{
    vscode.window.showInformationMessage("A new " +plant.species +" plant has sprouted in the greenhouse!");
    plants.push(plant);
    addPlant(plant);    
  }
  savePlants();
}

export function activate(context: vscode.ExtensionContext) {

  extensionStorageFolder = context.globalStorageUri.path.substring(1);
  plantsPath = path.join(extensionStorageFolder, 'plants.json');

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
        size: "small", //TODO: left off here
        harvested: false, 
        hotkey_uses: 1
      });
	});

  const growChili = vscode.commands.registerCommand('keycrop.growChili', () => {
    growPlant({
      species: "chili",
      size: "small",
      harvested: false,
      hotkey_uses: 1
    });
  });

  const growBroccoli = vscode.commands.registerCommand('keycrop.growBroccoli', () => {
    growPlant({
      species: "broccoli",
      size: "small",
      harvested: false,
      hotkey_uses: 1
    });
  })

  const growLettuce = vscode.commands.registerCommand('keycrop.growLettuce', () => {
    growPlant({
      species: "lettuce",
      size: "small",
      harvested: false,
      hotkey_uses: 1
    });
  })

  const growTomato = vscode.commands.registerCommand('keycrop.growTomato', () => {
    growPlant({
      species: "tomato",
      size: "small",
      harvested: false, 
      hotkey_uses: 1
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
            //Load existing plants array
            loadPlantsFile();
            break;
          case 'save_plants':
            fs.writeFileSync(plantsPath, JSON.stringify(message.content));
            break;
          case 'harvested':
            vscode.window.showInformationMessage("Your "+message.text+" plant has been harvested!");
            break;
          case 'level_one':
            vscode.window.showInformationMessage("Congratulations! You have finished the game!");
            break;
        }
      });
    }


    private getHtmlContent(webview: vscode.Webview): string {

      const style = webview.asWebviewUri(vscode.Uri.joinPath(this.context.extensionUri, 'src/media', 'style.css'));
      const mainJS = webview.asWebviewUri(vscode.Uri.joinPath(this.context.extensionUri, 'src/media', 'main.js'));
      const plantsJS = webview.asWebviewUri(vscode.Uri.joinPath(this.context.extensionUri, 'src/media', 'plants.js'));
      const levelsJS = webview.asWebviewUri(vscode.Uri.joinPath(this.context.extensionUri, 'src/media', 'levels.js'));

      const iconsPath = webview.asWebviewUri(vscode.Uri.joinPath(this.context.extensionUri, 'src/media/vegetables'));

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
          <div id="generator-instructions" hidden="true">
            <p class="instructions">Congratulations, you've managed to power up the KeyCrop Greenhouse! To unlock more seeds, all of the following plants must be harvested. </p>
            <!-- how many plants to make it to the next level -->
            <p class="key-instruction"><img src="${iconsPath+'/chilli_harvested.png'}" alt="Chili" width="20" height="20"> <span class="instruction-bold"> CTRL+C</span>: Copy text </p>
            <p class="key-instruction"><img src="${iconsPath+'/bean_harvested.png'}" alt="Chili" width="20" height="20"> <span class="instruction-bold"> CTRL+V</span>: Paste text </p>
            <p class="key-instruction"><img src="${iconsPath+'/tomato_harvested.png'}" alt="Chili" width="20" height="20"> <span class="instruction-bold"> CTRL+L</span>: Clear the terminal. </p>
            <p class="key-instruction"><img src="${iconsPath+'/lettuce_harvested.png'}" alt="Chili" width="20" height="20"> <span class="instruction-bold"> CTRL+A</span>: Select all text. </p>
            <p class="key-instruction"><img src="${iconsPath+'/broccoli_harvested.png'}" alt="Chili" width="20" height="20"> <span class="instruction-bold"> CTRL+X</span>: Cut text. </p>
          </div>
          <div class="btn-wrapper">
            <button class="btn" id="inventory-button">Inventory</button>
            <button class="selected btn" id="greenhouse-button">Greenhouse</button>
            <button class="btn" id="generator-button">Generator</button>
          </div>
          </div>
          <script src="${mainJS}"></script>
          <script src="${plantsJS}"></script>
          <script src="${levelsJS}"></script>
        </body>
        </html>
      `;
    }
  }

