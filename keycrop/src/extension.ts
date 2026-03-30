import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';
import { MODE } from './mode';

const CURRENT_MODE: MODE = MODE.GAME;

let greenhouse: GreenhouseWebViewProvider;
let generator: GeneratorWebViewProvider;
let inventory: InventoryWebViewProvider;
let config = vscode.workspace.getConfiguration('keycrop');
let extensionStorageFolder: string = '';
let plantsPath: string;
let keyTrackingPath: string;
let keyTrackingString: { key: string; time: number; }[] = [];
let studyOutputPath: string = './output';
let plantsStudyOutputPath: string;
let keytrackingStudyOutputPath: string;

type Plant = { 
  species: string; 
  size: string;
  harvested: boolean;
  hotkey_uses: number
}

function loadPlantsFile() {
  //Storage folder does not exist
  if (!fs.existsSync(extensionStorageFolder)){
    fs.mkdirSync(extensionStorageFolder, { recursive: true });
  } 

  //Read plants file
  if (fs.existsSync(plantsPath)) {
    try {
      //Try to read plants file
      let savedPlants = JSON.parse(fs.readFileSync(plantsPath, 'utf8'));
      Object.entries(savedPlants).forEach((p: any) => {
        //FIXME: do they need to be loaded one at a time? IDK
        greenhouse.postMessage({
          action: 'load',
          species: p[1].species,
          size: p[1].size,
          harvested: p[1].harvested, 
          hotkey_uses: p[1].hotkey_uses
        });
        plants.push({species: p[1].species, size: p[1].size, harvested: p[1].harvested, hotkey_uses: p[1].hotkey_uses});
      });
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
  greenhouse.postMessage({
    action: 'save_plants'
  });
}

let plants = new Array<Plant>();

function addPlant(plant: Plant) {
  greenhouse.postMessage({
    action: 'add',
    species: plant.species
  });
}

function growPlant(plant: Plant) {
  if(plants.some(p => p.species === plant.species)){
    let patch = plants.filter(p =>p.species === plant.species);
    patch.forEach( p => 
    {
      greenhouse.postMessage({
        action: 'grow',
        species: plant.species
      });
    }
    );
  }else{
    vscode.window.showInformationMessage("A new " +plant.species +" plant has sprouted in the greenhouse!");
    plants.push(plant);
    addPlant(plant);    
  }
  savePlants();
}

function logKeyPress(plant: string) {
  keyTrackingString.push({
    key: plant,
    time: Date.now()
  });
  // fs.writeFileSync(keytrackingStudyOutputPath, JSON.stringify(keyTrackingString))
  fs.writeFileSync(keyTrackingPath, JSON.stringify(keyTrackingString));
}

export function activate(context: vscode.ExtensionContext) {

  extensionStorageFolder = context.globalStorageUri.path.substring(1);
  plantsPath = path.join(extensionStorageFolder, 'plants.json');
  // plantsStudyOutputPath = path.join(studyOutputPath, 'plants.json');
  keyTrackingPath = path.join(extensionStorageFolder, 'keytracking.json');
  // keytrackingStudyOutputPath = path.join(studyOutputPath, 'keytracking.json');

  // if (!fs.existsSync(studyOutputPath)){
  //   fs.mkdirSync(studyOutputPath, { recursive: true });
  // } 

  //TODO GAMEMODE: do not initialize this in nongame mode
	greenhouse = new GreenhouseWebViewProvider(context);
	context.subscriptions.push(vscode.window.registerWebviewViewProvider(GreenhouseWebViewProvider.viewType, greenhouse));

	generator = new GeneratorWebViewProvider(context);
  //FIXME: do I need this?
	context.subscriptions.push(vscode.window.registerWebviewViewProvider(GeneratorWebViewProvider.viewType, generator));

	inventory = new InventoryWebViewProvider(context);
  //FIXME: do I need this?
	context.subscriptions.push(vscode.window.registerWebviewViewProvider(InventoryWebViewProvider.viewType, inventory));

	vscode.workspace.onDidChangeConfiguration(event => {
	
	  //Update config
	  config = vscode.workspace.getConfiguration('keycrop');

      //TODO: fix this or delete
      if (event.affectsConfiguration("keycrop-view.scale")) {
        greenhouse.postMessage({
          action: 'scale',
          value: config.get('scale')
        });
      }
  });

  const growCommandPalette = vscode.commands.registerCommand("keycrop.growCommandPalette", () => {
    if (CURRENT_MODE === 0 /* GAME */) {
      growPlant({
        species: "corn",
        size: "small",
        harvested: false,
        hotkey_uses: 1
      });
    } else {
      logKeyPress("corn");
    }
  });
  const growDeleteCurrentLine = vscode.commands.registerCommand("keycrop.growDeleteCurrentLine", () => {
    if (CURRENT_MODE === 0 /* GAME */) {
      growPlant({
        species: "strawberry",
        size: "small",
        harvested: false,
        hotkey_uses: 1
      });
    } else {
      logKeyPress("strawberry");
    }
  });
  const growJumpToBracket = vscode.commands.registerCommand("keycrop.growJumpToBracket", () => {
    if (CURRENT_MODE === 0 /* GAME */) {
      growPlant({
        species: "mango",
        size: "small",
        harvested: false,
        hotkey_uses: 1
      });
    } else {
      logKeyPress("mango");
    }
  });
  const growShowAllSymbols = vscode.commands.registerCommand("keycrop.growShowAllSymbols", () => {
    if (CURRENT_MODE === 0 /* GAME */) {
      growPlant({
        species: "poppy",
        size: "small",
        harvested: false,
        hotkey_uses: 1
      });
    } else {
      logKeyPress("poppy");
    }
  });
  const growGoToSymbol = vscode.commands.registerCommand("keycrop.growGoToSymbol", () => {
    if (CURRENT_MODE === 0 /* GAME */) {
      growPlant({
        species: "sunflower",
        size: "small",
        harvested: false,
        hotkey_uses: 1
      });
    } else {
      logKeyPress("sunflower");
    }
  });
  const growViewProblems = vscode.commands.registerCommand("keycrop.growViewProblems", () => {
    if (CURRENT_MODE === 0 /* GAME */) {
      growPlant({
        species: "snappea",
        size: "small",
        harvested: false,
        hotkey_uses: 1
      });
    } else {
      logKeyPress("snappea");
    }
  });
  const growSelectAllOccurrences = vscode.commands.registerCommand("keycrop.growSelectAllOccurrences", () => {
    if (CURRENT_MODE === 0 /* GAME */) {
      growPlant({
        species: "sphagettifern",
        size: "small",
        harvested: false,
        hotkey_uses: 1
      });
    } else {
      logKeyPress("sphagettifern");
    }
  });
  const growTriggerParameterHints = vscode.commands.registerCommand("keycrop.growTriggerParameterHints", () => {
    if (CURRENT_MODE === 0 /* GAME */) {
      growPlant({
        species: "okra",
        size: "small",
        harvested: false,
        hotkey_uses: 1
      });
    } else {
      logKeyPress("okra");
    }
  });
  const growSplitEditor = vscode.commands.registerCommand("keycrop.growSplitEditor", () => {
    if (CURRENT_MODE === 0 /* GAME */) {
      growPlant({
        species: "carrot",
        size: "small",
        harvested: false,
        hotkey_uses: 1
      });
    } else {
      logKeyPress("carrot");
    }
  });
  const growOpenLastUsedEditorInGroup = vscode.commands.registerCommand("keycrop.growOpenLastUsedEditorInGroup", () => {
    if (CURRENT_MODE === 0 /* GAME */) {
      growPlant({
        species: "canola",
        size: "small",
        harvested: false,
        hotkey_uses: 1
      });
    } else {
      logKeyPress("canola");
    }
  });
  const growToggleTerminal = vscode.commands.registerCommand("keycrop.growToggleTerminal", () => {
    if (CURRENT_MODE === 0 /* GAME */) {
      growPlant({
        species: "apple_tree",
        size: "small",
        harvested: false,
        hotkey_uses: 1
      });
    } else {
      logKeyPress("apple_tree");
    }
  });
  const growCreateNewTerminal = vscode.commands.registerCommand("keycrop.growCreateNewTerminal", () => {
    if (CURRENT_MODE === 0 /* GAME */) {
      growPlant({
        species: "cherry_tree",
        size: "small",
        harvested: false,
        hotkey_uses: 1
      });
    } else {
      logKeyPress("cherry_tree");
    }
  });
  context.subscriptions.push(growCommandPalette, growJumpToBracket, growShowAllSymbols, growGoToSymbol, growViewProblems, growSelectAllOccurrences, growTriggerParameterHints, growSplitEditor, growOpenLastUsedEditorInGroup, growToggleTerminal, growCreateNewTerminal, growDeleteCurrentLine);

}

// This method is called when your extension is deactivated
export function deactivate() {}

//make an interface that forces them to implement getHTMLcontent
export class GeneratorWebViewProvider implements vscode.WebviewViewProvider {

  public static readonly viewType = "generator"
  private view?: vscode.WebviewView;

  constructor(private readonly context: vscode.ExtensionContext){}
    
  public resolveWebviewView(webviewView: vscode.WebviewView, context: vscode.WebviewViewResolveContext, token: vscode.CancellationToken): Thenable<void> | void {
      this.view = webviewView; //FIXME: do I need this?
  
      const webview = webviewView.webview; //FIXME: ditto
  
      //ditto
      webview.options = {
        enableScripts: true 
      };
  
      //Set the HTML content for the webview
      webview.html = this.getHtmlContent(
        webviewView.webview,
      );
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
          <title>KeyCrop Generator</title>
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
          </div>
          <script src="${webviewJS}"></script>
        </body>
        </html>
      `;
    }

  

}

export class GreenhouseWebViewProvider implements vscode.WebviewViewProvider {

    public static readonly viewType = 'greenhouse'; 
  
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
            if(CURRENT_MODE === MODE.GAME){
              //Send background
              webview.postMessage({
                action: 'background',
                value: 'dirt'
              });
              //Load existing plants array
              loadPlantsFile();
            }else{
              webview.postMessage({
                action: 'key-tracking-mode'
              });
            }
            break;
          case 'save_plants':
            // fs.writeFileSync(plantsStudyOutputPath, JSON.stringify(message.content));
            fs.writeFileSync(plantsPath, JSON.stringify(message.content));
            break;
          case 'harvested':
            vscode.window.showInformationMessage("Your "+message.text+" plant has been harvested!");
            break;
        }
      });
    }

    private getHtmlContent(webview: vscode.Webview): string {

      const style = webview.asWebviewUri(vscode.Uri.joinPath(this.context.extensionUri, 'src/media', 'style.css'));
      const webviewJS = webview.asWebviewUri(vscode.Uri.joinPath(this.context.extensionUri, 'dist/media', 'webview.js'));

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
          <div id="keycrop" background="${CURRENT_MODE === MODE.GAME ? config.get('background') : 'blackout'}">
          </div>
          <script src="${webviewJS}"></script>
        </body>
        </html>
      `;
    }
  }

export class InventoryWebViewProvider implements vscode.WebviewViewProvider {

  public static readonly viewType = "inventory"
  private view?: vscode.WebviewView;

  constructor(private readonly context: vscode.ExtensionContext){}
    
  public resolveWebviewView(webviewView: vscode.WebviewView, context: vscode.WebviewViewResolveContext, token: vscode.CancellationToken): Thenable<void> | void {
      this.view = webviewView; //FIXME: do I need this?
  
      const webview = webviewView.webview; //FIXME: ditto
  
      //ditto
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
          case 'init':
            if(CURRENT_MODE === MODE.GAME){
              //Send background
              webview.postMessage({
                action: 'background',
                value: 'blackout'
              });
              //Load existing plants array
              loadPlantsFile();
            }else{
              webview.postMessage({
                action: 'key-tracking-mode'
              });
            }
            break;
        }
      });
  }

  private getHtmlContent(webview: vscode.Webview): string {

      const style = webview.asWebviewUri(vscode.Uri.joinPath(this.context.extensionUri, 'src/media', 'style.css'));
      const webviewJS = webview.asWebviewUri(vscode.Uri.joinPath(this.context.extensionUri, 'dist/media', 'webview.js'));

      return `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <link href="${style}" rel="stylesheet">
          <title>KeyCrop Inventory</title>
        </head>
        <body>
          <div id="inventory">
          </div>
          <div class="instructions">You currently don't have anything in your inventory.</div>
          <script src="${webviewJS}"></script>
        </body>
        </html>
      `;
  
  
    }
}