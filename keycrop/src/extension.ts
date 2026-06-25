import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';
import { MODE } from './mode';
import { InstructionsWebViewProvider } from './instructionsWebViewProvider';

const CURRENT_MODE: MODE = MODE.GAME;

let greenhouse: GreenhouseWebViewProvider;
let instructions: InstructionsWebViewProvider;
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
  key: string;
  species: string;
  size: string;
  harvested: boolean;
  hotkey_uses: number
}

function readPlantsFromDisk() {
  if (!fs.existsSync(extensionStorageFolder)){
    fs.mkdirSync(extensionStorageFolder, { recursive: true });
  }
  if (fs.existsSync(plantsPath)) {
    try {
      const saved = JSON.parse(fs.readFileSync(plantsPath, 'utf8'));
      const savedPlants: any[] = saved.plants ?? saved;
      const savedHarvested: Record<string, number> = saved.harvestedCounts ?? {};
      harvestedCounts = new Map(Object.entries(savedHarvested));
      // Deduplicate by key — prefer non-harvested if there are conflicting entries
      const seen = new Map<string, Plant>();
      for (const p of savedPlants) {
        const existing = seen.get(p.key);
        if (!existing || (!p.harvested && existing.harvested)) {
          seen.set(p.key, {key: p.key, species: p.species, size: p.size, harvested: p.harvested, hotkey_uses: p.hotkey_uses});
        }
      }
      plants = Array.from(seen.values());
    } catch (e) {
      console.error('Saved plants could not be loaded');
      console.error(e);
      plants = new Array<Plant>();
    }
  } else {
    plants = new Array<Plant>();
  }
}

function writePlantsToDisk() {
  if (!fs.existsSync(extensionStorageFolder)){
    fs.mkdirSync(extensionStorageFolder, { recursive: true });
  }
  fs.writeFileSync(plantsPath, JSON.stringify({
    plants: plants,
    harvestedCounts: Object.fromEntries(harvestedCounts)
  }));
}

function sendPlantsToWebview() {
  plants.forEach(p => {
    greenhouse.postMessage({
      action: 'load',
      key: p.key,
      species: p.species,
      size: p.size,
      harvested: p.harvested,
      hotkey_uses: p.hotkey_uses
    });
  });
}

function loadPlantsToInventory() {
  harvestedCounts.forEach((count, species) => {
    inventory.postMessage({
      action: 'load_harvested',
      species,
      count
    });
  });
}

function requestWebviewSave() {
  greenhouse.postMessage({
    action: 'save_plants'
  });
}

let plants = new Array<Plant>();
let harvestedCounts = new Map<string, number>();

const SPECIES_DESCRIPTIONS: Record<string, string> = {
  'bean': "A humble unassuming legume.",
  'tomato': 'This crop has a wide variety of culinary uses.',
  'broccoli': 'Nutritious',
  'chili': 'Spicy and flavorful.',
  'bulbino': 'A mysterious plant.',
  'glowberry': 'Glowberries emit a soft bioluminescent hue.',
  'ivy': 'A decorative ground cover.',
  'jacaranda_tree': 'A tree with purple leaves.',
  'lettuce': 'Great in salads',
  'neon_mould': 'Radioactive mould.',
  'poison_cabbage': 'Closely related to regular cabbage.',
  'raspberry': 'A sweet and tart fruit.',
  'rhubarb': 'The stalks are edible.',
  'strawberry': 'A sweet and juicy fruit.',
  'watermelon': 'Great with hotkeys in the summer.',
};
const ALL_SPECIES = ['bean', 'tomato', 'broccoli', 'chili', 'bulbino', 'glowberry', 'ivy', 'jacaranda_tree', 'lettuce', 'neon_mould', 'poison_cabbage', 'raspberry', 'rhubarb', 'strawberry', 'watermelon'];

function addPlant(plant: Plant) {
  greenhouse.postMessage({
    action: 'add',
    species: plant.species, 
    key: plant.key
  });
}

function growPlant(key: string) {
  const existingPlant = plants.find(p => p.key === key);
  if (existingPlant && !existingPlant.harvested) {
    greenhouse.postMessage({
      action: 'grow',
      species: existingPlant.species
    });
    requestWebviewSave();
  } else {
    // No plant for this key, or it has been harvested — free the key and let user pick
    plants = plants.filter(p => p.key !== key);
    const usedSpecies = new Set(plants.filter(p => !p.harvested).map(p => p.species));
    const availableSpecies = ALL_SPECIES.filter(s => !usedSpecies.has(s));
    const speciesItems = availableSpecies.map(s => ({ label: s.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase()), description: SPECIES_DESCRIPTIONS[s] }));
    vscode.window.showQuickPick(speciesItems, {
      placeHolder: 'Choose a species for your new plant'
    }).then(item => {
      const species = item?.label.toLowerCase().replace(/ /g, '_');
      if (species) {
        const displayName = species.replace(/_/g, ' ');
        vscode.window.showInformationMessage("A new " + displayName + " plant has sprouted in the greenhouse!");
        plants.push({ key: key, species: species, size: 'start', harvested: false, hotkey_uses: 1 });
        addPlant({ key: key, species: species, size: 'start', harvested: false, hotkey_uses: 1 });
        writePlantsToDisk();
        requestWebviewSave();
      }
    });
  }
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

  readPlantsFromDisk();

  instructions = new InstructionsWebViewProvider(context);
	context.subscriptions.push(vscode.window.registerWebviewViewProvider(InstructionsWebViewProvider.viewType, instructions));

	if (CURRENT_MODE === MODE.GAME) {
		greenhouse = new GreenhouseWebViewProvider(context);
		context.subscriptions.push(vscode.window.registerWebviewViewProvider(GreenhouseWebViewProvider.viewType, greenhouse));

		inventory = new InventoryWebViewProvider(context);
		context.subscriptions.push(vscode.window.registerWebviewViewProvider(InventoryWebViewProvider.viewType, inventory));
	}

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
      growPlant("command_palette");
    } else {
      logKeyPress("command_palette");
    }
  });
  const growDeleteCurrentLine = vscode.commands.registerCommand("keycrop.growDeleteCurrentLine", () => {
    if (CURRENT_MODE === 0 /* GAME */) {
      growPlant("delete_current_line");
    } else {
      logKeyPress("delete_current_line");
    }
  });
  const growJumpToBracket = vscode.commands.registerCommand("keycrop.growJumpToBracket", () => {
    if (CURRENT_MODE === 0 /* GAME */) {
      growPlant("jump_to_bracket");
    } else {
      logKeyPress("jump_to_bracket");
    }
  });
  const growShowAllSymbols = vscode.commands.registerCommand("keycrop.growShowAllSymbols", () => {
    if (CURRENT_MODE === 0 /* GAME */) {
      growPlant("show_all_symbols");
    } else {
      logKeyPress("show_all_symbols");
    }
  });
  const growGoToSymbol = vscode.commands.registerCommand("keycrop.growGoToSymbol", () => {
    if (CURRENT_MODE === 0 /* GAME */) {
      growPlant("go_to_symbol");
    } else {
      logKeyPress("go_to_symbol");
    }
  });
  const growViewProblems = vscode.commands.registerCommand("keycrop.growViewProblems", () => {
    if (CURRENT_MODE === 0 /* GAME */) {
      growPlant("view_problems");
    } else {
      logKeyPress("view_problems");
    }
  });
  const growSelectAllOccurrences = vscode.commands.registerCommand("keycrop.growCursorAtAllOccurrences", () => {
    if (CURRENT_MODE === 0 /* GAME */) {
      growPlant("cursor_at_all_occurrences");
    } else {
      logKeyPress("cursor_at_all_occurrences");
    }
  });
  const growTriggerParameterHints = vscode.commands.registerCommand("keycrop.growTriggerParameterHints", () => {
    if (CURRENT_MODE === 0 /* GAME */) {
      growPlant("trigger_parameter_hints");
    } else {
      logKeyPress("trigger_parameter_hints");
    }
  });
  const growSplitEditor = vscode.commands.registerCommand("keycrop.growSplitEditor", () => {
    if (CURRENT_MODE === 0 /* GAME */) {
      growPlant("split_editor");
    } else {
      logKeyPress("split_editor");
    }
  });
  const growOpenLastUsedEditorInGroup = vscode.commands.registerCommand("keycrop.growOpenLastUsedEditorInGroup", () => {
    if (CURRENT_MODE === 0 /* GAME */) {
      growPlant("open_last_used_editor_in_group");
    } else {
      logKeyPress("open_last_used_editor_in_group");
    }
  });
  const growToggleTerminal = vscode.commands.registerCommand("keycrop.growToggleTerminal", () => {
    if (CURRENT_MODE === 0 /* GAME */) {
      growPlant("toggle_terminal");
    } else {
      logKeyPress("toggle_terminal");
    }
  });
  const growCreateNewTerminal = vscode.commands.registerCommand("keycrop.growCreateNewTerminal", () => {
    if (CURRENT_MODE === 0 /* GAME */) {
      growPlant("create_new_terminal");
    } else {
      logKeyPress("create_new_terminal");
    }
  });
  const growGoToLine = vscode.commands.registerCommand("keycrop.growGoToLine", () => {
    if (CURRENT_MODE === 0 /* GAME */) {
      growPlant("go_to_line");
    } else {
      logKeyPress("go_to_line");
    }
  });
  const growQuickFix = vscode.commands.registerCommand("keycrop.growQuickFix", () => {
    if (CURRENT_MODE === 0 /* GAME */) {
      growPlant("quick_fix");
    } else {
      logKeyPress("quick_fix");
    }
  });
  const growSaveFileAs = vscode.commands.registerCommand("keycrop.growSaveFileAs", () => {
    if (CURRENT_MODE === 0 /* GAME */) {
      growPlant("save_file_as");
    } else {
      logKeyPress("save_file_as");
    }
  });
  const growMoveLineUp = vscode.commands.registerCommand("keycrop.growMoveLineUp", () => {
    if (CURRENT_MODE === 0 /* GAME */) {
      growPlant("move_line_up");
    } else {
      logKeyPress("move_line_up");
    }
  });
  const growMoveLineDown = vscode.commands.registerCommand("keycrop.growMoveLineDown", () => {
    if (CURRENT_MODE === 0 /* GAME */) {
      growPlant("move_line_down");
    } else {
      logKeyPress("move_line_down");
    }
  });
  const growSelectLine = vscode.commands.registerCommand("keycrop.growSelectLine", () => {
    if (CURRENT_MODE === 0 /* GAME */) {
      growPlant("select_line");
    } else {
      logKeyPress("select_line");
    }
  });
  const growInsertCursorAtEndOfEachLineSelected = vscode.commands.registerCommand("keycrop.growInsertCursorAtEndOfEachLineSelected", () => {
    if (CURRENT_MODE === 0 /* GAME */) {
      growPlant("insert_cursor_at_end_of_each_line_selected");
    } else {
      logKeyPress("insert_cursor_at_end_of_each_line_selected");
    }
  });
  const growAddCursorAbove = vscode.commands.registerCommand("keycrop.growInsertCursorAbove", () => {
    if (CURRENT_MODE === 0 /* GAME */) {
      growPlant("add_cursor_above");
    } else {
      logKeyPress("add_cursor_above");
    }
  });
  const growAddCursorBelow = vscode.commands.registerCommand("keycrop.growInsertCursorBelow", () => {
    if (CURRENT_MODE === 0 /* GAME */) {
      growPlant("add_cursor_below");
    } else {
      logKeyPress("add_cursor_below");
    }
  });
  const growTriggerSuggest = vscode.commands.registerCommand("keycrop.growTriggerSuggest", () => {
    if (CURRENT_MODE === 0 /* GAME */) {
      growPlant("trigger_suggest");
    } else {
      logKeyPress("trigger_suggest");
    }
  });
  const growShowHover = vscode.commands.registerCommand("keycrop.growShowHover", () => {
    if (CURRENT_MODE === 0 /* GAME */) {
      growPlant("show_hover");
    } else {
      logKeyPress("show_hover");
    }
  });
  context.subscriptions.push(growCommandPalette, growJumpToBracket, growShowAllSymbols, growGoToSymbol, growViewProblems, growSelectAllOccurrences, growTriggerParameterHints, growSplitEditor, growOpenLastUsedEditorInGroup, growToggleTerminal, growCreateNewTerminal, growDeleteCurrentLine, growGoToLine, growQuickFix, growSaveFileAs, growMoveLineUp, growMoveLineDown, growSelectLine, growInsertCursorAtEndOfEachLineSelected, growAddCursorAbove, growAddCursorBelow, growTriggerSuggest, growShowHover);

}

// This method is called when your extension is deactivated
export function deactivate() {}

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
              readPlantsFromDisk();
              //Send background
              webview.postMessage({
                action: 'background',
                value: 'dirt'
              });
              //Load existing plants array
              sendPlantsToWebview();
            }else{
              webview.postMessage({
                action: 'key-tracking-mode'
              });
            }
            break;
          case 'save_plants': {
            plants = (message.content as any[]).map(p => ({
              key: p.key, species: p.species, size: p.size,
              harvested: p.harvested, hotkey_uses: p.hotkey_uses
            }));
            fs.writeFileSync(plantsPath, JSON.stringify({
              plants: message.content,
              harvestedCounts: Object.fromEntries(harvestedCounts)
            }));
            break;
          }
          case 'harvested': {
            const harvestedPlant = plants.find(p => p.species === message.text && !p.harvested);
            if (harvestedPlant) {
              const alreadyInInventory = harvestedCounts.has(harvestedPlant.species);
              harvestedPlant.harvested = true;
              const sizeBefore = harvestedCounts.size;
              const newCount = (harvestedCounts.get(harvestedPlant.species) ?? 0) + 1;
              harvestedCounts.set(harvestedPlant.species, newCount);
              inventory.postMessage({
                action: 'load_harvested',
                species: harvestedPlant.species,
                count: 1
              });
              if (alreadyInInventory) {
                vscode.window.showInformationMessage("Your " + message.text.replace(/_/g, ' ') + " plant has been harvested!");
              }
              if (sizeBefore < ALL_SPECIES.length && harvestedCounts.size === ALL_SPECIES.length) {
                vscode.window.showInformationMessage("Achievement unlocked: you've grown one of every plant!");
                inventory.postMessage({ action: 'achievement' });
              }
            }
            break;
          }
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

  public static readonly viewType = "inventory";
  private view?: vscode.WebviewView;

  constructor(private readonly context: vscode.ExtensionContext){}
  
  public postMessage(message: any) {
    this.view?.webview.postMessage(message);
  }
    
    public resolveWebviewView(webviewView: vscode.WebviewView, context: vscode.WebviewViewResolveContext, token: vscode.CancellationToken): Thenable<void> | void {
      this.view = webviewView;

      const webview = webviewView.webview;

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
                value: 'inventory'
              });
              //Load harvested plants into inventory
              loadPlantsToInventory();
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
      const openPot = webview.asWebviewUri(vscode.Uri.joinPath(this.context.extensionUri, 'src/media/recipes', 'open_pot.png'));
      const closedPot = webview.asWebviewUri(vscode.Uri.joinPath(this.context.extensionUri, 'src/media/recipes', 'closed_pot.png'));
      const foodBase = webview.asWebviewUri(vscode.Uri.joinPath(this.context.extensionUri, 'src/media/recipes/food'));

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
          <div id="keycrop">
          </div>
          <div id="empty-inventory-message" class="instructions">You currently don't have anything in your inventory.</div>
          <div id="food-row" hidden></div>
          <div id="inventory-bottom-right" data-food-base="${foodBase}">
            <div id="inventory-pot-wrapper" class="inventory-pot-wrapper">
              <img src="${openPot}" data-open-src="${openPot}" data-closed-src="${closedPot}" class="inventory-pot" />
              <span class="inventory-pot-overlay" hidden></span>
            </div>
            <button id="cook-btn" hidden>Cook</button>
            <div id="cook-progress-wrapper" hidden>
              <div id="cook-progress-bar"></div>
            </div>
          </div>
          <script src="${webviewJS}"></script>
        </body>
        </html>
      `;
  
  
    }
}