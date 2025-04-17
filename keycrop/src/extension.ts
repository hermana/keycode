import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';
import { MODE } from './mode';

const CURRENT_MODE: MODE = MODE.KEYTRACKING;

let webview: WebViewProvider;
let config = vscode.workspace.getConfiguration('keycrop');
let extensionStorageFolder: string = '';
let plantsPath: string;
let keyTrackingPath: string;
let keyTrackingString: { key: string; time: number; }[] = [];
let studyOutputPath: string = './output'
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
        webview.postMessage({
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
  webview.postMessage({
    action: 'save_plants'
  });
}

let plants = new Array<Plant>();

function addPlant(plant: Plant) {
  webview.postMessage({
    action: 'add',
    species: plant.species
  });
}

function growPlant(plant: Plant) {
  if(plants.some(p => p.species === plant.species)){
    let patch = plants.filter(p =>p.species === plant.species);
    patch.forEach( p => 
    {
      webview.postMessage({
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
  vscode.window.showInformationMessage("Your "+plant+ " is growing!");
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

	webview = new WebViewProvider(context);
	context.subscriptions.push(vscode.window.registerWebviewViewProvider(WebViewProvider.viewType, webview));

	vscode.workspace.onDidChangeConfiguration(event => {
	
	  //Update config
	  config = vscode.workspace.getConfiguration('keycrop');

      //TODO: fix this or delete
      if (event.affectsConfiguration("keycrop-view.scale")) {
        webview.postMessage({
          action: 'scale',
          value: config.get('scale')
        });
      }
  });

	const growBean = vscode.commands.registerCommand('keycrop.growBean', () => {
    if(CURRENT_MODE === MODE.GAME){
      growPlant({
        species: "bean",
        size: "small", //TODO: left off here
        harvested: false, 
        hotkey_uses: 1
      });
    }else{
      
      logKeyPress('bean');
    }
	});

  const growChili = vscode.commands.registerCommand('keycrop.growChili', () => {
    if(CURRENT_MODE === MODE.GAME){
      growPlant({
        species: "chili",
        size: "small",
        harvested: false,
        hotkey_uses: 1
      });
    }else{
      logKeyPress('chili');
    }
  });

  const growBroccoli = vscode.commands.registerCommand('keycrop.growBroccoli', () => {
    if(CURRENT_MODE === MODE.GAME){
      growPlant({
        species: "broccoli",
        size: "small",
        harvested: false,
        hotkey_uses: 1
      }); 
    }else{
      logKeyPress('broccoli');
    }
  });

  const growLettuce = vscode.commands.registerCommand('keycrop.growLettuce', () => {
    if(CURRENT_MODE === MODE.GAME){
      growPlant({
        species: "lettuce",
        size: "small",
        harvested: false,
        hotkey_uses: 1
      });
    }else{
      logKeyPress('lettuce');
    }
  });

  const growTomato = vscode.commands.registerCommand('keycrop.growTomato', () => {
    if(CURRENT_MODE === MODE.GAME){
      growPlant({
        species: "tomato",
        size: "small",
        harvested: false, 
        hotkey_uses: 1
      });
    }else{
      logKeyPress('tomato');
    }
  });

	context.subscriptions.push(growBean, growChili, growBroccoli, growLettuce, growTomato);

}

// This method is called when your extension is deactivated
export function deactivate() {}


export class WebViewProvider implements vscode.WebviewViewProvider {

    public static readonly viewType = 'keycrop'; 
  
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
            //fs.writeFileSync(plantsStudyOutputPath, JSON.stringify(message.content));
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
          <div id="keycrop" background="${CURRENT_MODE === MODE.GAME ? config.get('background') : 'blackout'}">
          <div id="generator-instructions" hidden>
            <p class="instructions">Congratulations, you've managed to power up the KeyCrop Greenhouse! To unlock more seeds, all of the following plants must be harvested. </p>
            <!-- how many plants to make it to the next level -->
            <p class="key-instruction"><img src="${iconsPath+'/chilli_harvested.png'}" alt="Chili" width="20" height="20"> <span class="instruction-bold"> CTRL+SHIFT+SPACE</span>: See function parameter hints.</p>
            <p class="key-instruction"><img src="${iconsPath+'/bean_harvested.png'}" alt="Bean" width="20" height="20"> <span class="instruction-bold"> CTRL+SHIFT+M</span>: See warnings and errors in the Problems view.</p>
            <p class="key-instruction"><img src="${iconsPath+'/tomato_harvested.png'}" alt="Tomato" width="20" height="20"> <span class="instruction-bold"> CTRL+SHIFT+L</span>: Multicursor-select all instances of a specific word.</p>
            <p class="key-instruction"><img src="${iconsPath+'/lettuce_harvested.png'}" alt="Lettuce" width="20" height="20"> <span class="instruction-bold"> CTRL+/</span>: Comment or un-comment code.</p>
            <p class="key-instruction"><img src="${iconsPath+'/broccoli_harvested.png'}" alt="Broccoli" width="20" height="20"> <span class="instruction-bold"> CTRL+[</span>: Outdent a line.</p>
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

