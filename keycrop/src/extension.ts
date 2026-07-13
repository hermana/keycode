import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';
import { MODE } from './mode';
import { InstructionsWebViewProvider } from './instructionsWebViewProvider';
import { PLANTS, ALL_SPECIES } from './media/plants';
import { KEY_MAP } from './keyMap';

const CURRENT_MODE: MODE = MODE.GAME;

let greenhouse: GreenhouseWebViewProvider;
let instructions: InstructionsWebViewProvider;
let inventory: InventoryWebViewProvider;
let config = vscode.workspace.getConfiguration('keycrop');
let extensionStorageFolder: string = '';
let plantsPath: string;
let hotkeysPath: string;
type HotkeyEntry = { hotkey: string; species: string; timestamp: string; file: string };
let hotkeyLog: HotkeyEntry[] = [];
let pluginDataPath: string;
type PluginDataEntry = { view: string; event: 'opened' | 'closed'; timestamp: string };
let pluginDataLog: PluginDataEntry[] = [];
let studyOutputPath: string = './output';
let plantsStudyOutputPath: string;

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
      const savedCooked: Record<string, number> = saved.cookedFoodCounts ?? {};
      cookedFoodCounts = new Map(Object.entries(savedCooked));
      playerMoney = saved.playerMoney ?? 0;
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
    harvestedCounts: Object.fromEntries(harvestedCounts),
    cookedFoodCounts: Object.fromEntries(cookedFoodCounts),
    playerMoney
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

function loadCookedFoodsToInventory() {
  cookedFoodCounts.forEach((count, recipeKey) => {
    inventory.postMessage({
      action: 'load_cooked',
      recipeKey,
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
let cookedFoodCounts = new Map<string, number>();
let playerMoney = 0;

function getHotkeyCounts(): Record<string, number> {
  const counts: Record<string, number> = {};
  for (const plant of plants) {
    if (plant.key) {
      counts[plant.key] = (counts[plant.key] ?? 0) + plant.hotkey_uses;
    }
  }
  return counts;
}

function addPlant(plant: Plant) {
  greenhouse.postMessage({
    action: 'add',
    species: plant.species, 
    key: plant.key
  });
}

function growPlant(key: string) {
  if (CURRENT_MODE !== MODE.GAME) {
    logHotkeyUse(key, 'None');
    return;
  }

  const keyEntry = KEY_MAP.find(k => k.command === key);
  if (keyEntry && !keyEntry.active) {
    logHotkeyUse(key, 'None');
    return;
  }

  const existingPlant = plants.find(p => p.key === key);
  if (existingPlant && !existingPlant.harvested) {
    logHotkeyUse(key, existingPlant.species);
    greenhouse.postMessage({
      action: 'grow',
      key: existingPlant.key
    });
    requestWebviewSave();
  } else {
    logHotkeyUse(key, 'None');
    // No plant for this key, or it has been harvested — free the key and let user pick
    plants = plants.filter(p => p.key !== key);
    greenhouse.postMessage({
      action: 'choose_species',
      key,
      options: buildSpeciesOptions()
    });
  }
}

function toLabel(s: string): string {
  return s.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
}

function plantingCost(s: string): number {
  const d = PLANTS[s];
  return (!d || d.category === 'vegetable') ? 0 : d.price;
}

type SpeciesOption = {
  species: string;
  label: string;
  description: string;
  price: number;
  isFree: boolean;
  locked: boolean;
};

function buildSpeciesOptions(): SpeciesOption[] {
  const toOption = (s: string, locked: boolean): SpeciesOption => {
    const data = PLANTS[s];
    const isFree = !data || data.category === 'vegetable';
    return {
      species: s,
      label: toLabel(s),
      description: data?.description ?? '',
      price: data?.price ?? 0,
      isFree,
      locked
    };
  };

  const unlocked = ALL_SPECIES.filter(s => {
    const data = PLANTS[s];
    return !data || data.category === 'vegetable' || playerMoney >= data.price;
  }).sort((a, b) => plantingCost(a) - plantingCost(b));
  const locked = ALL_SPECIES.filter(s => {
    const data = PLANTS[s];
    return data && data.category !== 'vegetable' && playerMoney < data.price;
  }).sort((a, b) => PLANTS[a].price - PLANTS[b].price);

  return [
    ...unlocked.map(s => toOption(s, false)),
    ...locked.map(s => toOption(s, true))
  ];
}

function logViewEvent(view: string, event: 'opened' | 'closed'): void {
  pluginDataLog.push({ view, event, timestamp: new Date().toISOString() });
  fs.writeFileSync(pluginDataPath, JSON.stringify(pluginDataLog, null, 2));
}

function logHotkeyUse(key: string, species: string): void {
  const keyEntry = KEY_MAP.find(k => k.command === key);
  hotkeyLog.push({
    hotkey: keyEntry?.capital_key ?? key,
    species,
    timestamp: new Date().toISOString(),
    file: vscode.window.activeTextEditor?.document.fileName ?? ''
  });
  fs.writeFileSync(hotkeysPath, JSON.stringify(hotkeyLog, null, 2));
}

export function activate(context: vscode.ExtensionContext) {

  extensionStorageFolder = context.globalStorageUri.path.substring(1);
  plantsPath = path.join(extensionStorageFolder, 'plants.json');
  // plantsStudyOutputPath = path.join(studyOutputPath, 'plants.json');
  hotkeysPath = path.join(extensionStorageFolder, 'hotkeys.json');
  if (fs.existsSync(hotkeysPath)) {
    try { hotkeyLog = JSON.parse(fs.readFileSync(hotkeysPath, 'utf8')); } catch { hotkeyLog = []; }
  }
  pluginDataPath = path.join(extensionStorageFolder, 'plugin_data.json');
  if (fs.existsSync(pluginDataPath)) {
    try { pluginDataLog = JSON.parse(fs.readFileSync(pluginDataPath, 'utf8')); } catch { pluginDataLog = []; }
  }
  logViewEvent('vscode', 'opened');

  // if (!fs.existsSync(studyOutputPath)){
  //   fs.mkdirSync(studyOutputPath, { recursive: true });
  // } 

  readPlantsFromDisk();

  instructions = new InstructionsWebViewProvider(context, getHotkeyCounts, (event) => logViewEvent('instructions', event));
	context.subscriptions.push(vscode.window.registerWebviewViewProvider(InstructionsWebViewProvider.viewType, instructions));

	if (CURRENT_MODE === MODE.GAME) {
		greenhouse = new GreenhouseWebViewProvider(context);
		context.subscriptions.push(vscode.window.registerWebviewViewProvider(GreenhouseWebViewProvider.viewType, greenhouse, { webviewOptions: { retainContextWhenHidden: true } }));

		inventory = new InventoryWebViewProvider(context);
		context.subscriptions.push(vscode.window.registerWebviewViewProvider(InventoryWebViewProvider.viewType, inventory, { webviewOptions: { retainContextWhenHidden: true } }));
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
    growPlant("command_palette");
  });
  const growDeleteCurrentLine = vscode.commands.registerCommand("keycrop.growDeleteCurrentLine", () => {
    growPlant("delete_current_line");
  });
  const growJumpToBracket = vscode.commands.registerCommand("keycrop.growJumpToBracket", () => {
    growPlant("jump_to_bracket");
  });
  const growShowAllSymbols = vscode.commands.registerCommand("keycrop.growShowAllSymbols", () => {
    growPlant("show_all_symbols");
  });
  const growGoToSymbol = vscode.commands.registerCommand("keycrop.growGoToSymbol", () => {
    growPlant("go_to_symbol");
  });
  const growViewProblems = vscode.commands.registerCommand("keycrop.growViewProblems", () => {
    growPlant("view_problems");
  });
  const growSelectAllOccurrences = vscode.commands.registerCommand("keycrop.growCursorAtAllOccurrences", () => {
    growPlant("cursor_at_all_occurrences");
  });
  const growTriggerParameterHints = vscode.commands.registerCommand("keycrop.growTriggerParameterHints", () => {
    growPlant("trigger_parameter_hints");
  });
  const growSplitEditor = vscode.commands.registerCommand("keycrop.growSplitEditor", () => {
    growPlant("split_editor");
  });
  const growOpenLastUsedEditorInGroup = vscode.commands.registerCommand("keycrop.growOpenLastUsedEditorInGroup", () => {
    growPlant("open_last_used_editor_in_group");
  });
  const growToggleTerminal = vscode.commands.registerCommand("keycrop.growToggleTerminal", () => {
    growPlant("toggle_terminal");
  });
  const growCreateNewTerminal = vscode.commands.registerCommand("keycrop.growCreateNewTerminal", () => {
    growPlant("create_new_terminal");
  });
  const growGoToLine = vscode.commands.registerCommand("keycrop.growGoToLine", () => {
    growPlant("go_to_line");
  });
  const growQuickFix = vscode.commands.registerCommand("keycrop.growQuickFix", () => {
    growPlant("quick_fix");
  });
  const growSaveFileAs = vscode.commands.registerCommand("keycrop.growSaveFileAs", () => {
    growPlant("save_file_as");
  });
  const growMoveLineUp = vscode.commands.registerCommand("keycrop.growMoveLineUp", () => {
    growPlant("move_line_up");
  });
  const growMoveLineDown = vscode.commands.registerCommand("keycrop.growMoveLineDown", () => {
    growPlant("move_line_down");
  });
  const growSelectLine = vscode.commands.registerCommand("keycrop.growSelectLine", () => {
    growPlant("select_line");
  });
  const growInsertCursorAtEndOfEachLineSelected = vscode.commands.registerCommand("keycrop.growInsertCursorAtEndOfEachLineSelected", () => {
    growPlant("insert_cursor_at_end_of_each_line_selected");
  });
  const growAddCursorAbove = vscode.commands.registerCommand("keycrop.growInsertCursorAbove", () => {
    growPlant("add_cursor_above");
  });
  const growAddCursorBelow = vscode.commands.registerCommand("keycrop.growInsertCursorBelow", () => {
    growPlant("add_cursor_below");
  });
  const growTriggerSuggest = vscode.commands.registerCommand("keycrop.growTriggerSuggest", () => {
    growPlant("trigger_suggest");
  });
  const growShowHover = vscode.commands.registerCommand("keycrop.growShowHover", () => {
    growPlant("show_hover");
  });
  const growOpenMarkdownSide = vscode.commands.registerCommand("keycrop.growOpenMarkdownSide", () => {
    growPlant("open_markdown_side");
  });
  const growOpenMarkdownPreview = vscode.commands.registerCommand("keycrop.growOpenMarkdownPreview", () => {
    growPlant("open_markdown_preview");
  });
  const growReplace = vscode.commands.registerCommand("keycrop.growReplace", () => {
    growPlant("replace");
  });
  const growCopyLineBelow = vscode.commands.registerCommand("keycrop.growCopyLineBelow", () => {
    growPlant("copy_line_below");
  });
  const growCopyLineAbove = vscode.commands.registerCommand("keycrop.growCopyLineAbove", () => {
    growPlant("copy_line_above");
  });
  const growFind = vscode.commands.registerCommand("keycrop.growFind", () => {
    growPlant("find");
  });
  const growExpandSelection = vscode.commands.registerCommand("keycrop.growExpandSelection", () => {
    growPlant("expand_selection");
  });
  const growReduceSelection = vscode.commands.registerCommand("keycrop.growReduceSelection", () => {
    growPlant("reduce_selection");
  });
  const growToggleBlockComment = vscode.commands.registerCommand("keycrop.growToggleBlockComment", () => {
    growPlant("toggle_block_comment");
  });
  const growCopy = vscode.commands.registerCommand("keycrop.growCopy", () => {
    growPlant("copy");
  });
  const growPaste = vscode.commands.registerCommand("keycrop.growPaste", () => {
    growPlant("paste");
  });
  context.subscriptions.push(growCommandPalette, growJumpToBracket, growShowAllSymbols, growGoToSymbol, growViewProblems, growSelectAllOccurrences, growTriggerParameterHints, growSplitEditor, growOpenLastUsedEditorInGroup, growToggleTerminal, growCreateNewTerminal, growDeleteCurrentLine, growGoToLine, growQuickFix, growSaveFileAs, growMoveLineUp, growMoveLineDown, growSelectLine, growInsertCursorAtEndOfEachLineSelected, growAddCursorAbove, growAddCursorBelow, growTriggerSuggest, growShowHover, growOpenMarkdownSide, growOpenMarkdownPreview, growReplace, growCopyLineBelow, growCopyLineAbove, growFind, growExpandSelection, growReduceSelection, growToggleBlockComment, growCopy, growPaste);

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
      logViewEvent('greenhouse', 'opened');
      webviewView.onDidChangeVisibility(() => logViewEvent('greenhouse', webviewView.visible ? 'opened' : 'closed'));
      webviewView.onDidDispose(() => logViewEvent('greenhouse', 'closed'));
  
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
            // Only update growth state from the webview — never remove entries.
            // The extension is authoritative for which keys are assigned; the webview
            // can lag behind after a reinit and must not overwrite that state.
            for (const saved of message.content as any[]) {
              const existing = plants.find(p => p.key === saved.key);
              if (existing) {
                existing.size = saved.size;
                existing.hotkey_uses = saved.hotkey_uses;
              }
            }
            writePlantsToDisk();
            instructions.postMessage({ action: 'update_counts', counts: getHotkeyCounts() });
            break;
          }
          case 'harvested': {
            const harvestedPlant = plants.find(p => p.key === message.key && !p.harvested);
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
          case 'select_species': {
            const species = message.species as string;
            const key = message.key as string;
            const plantData = PLANTS[species];
            if (plantData && plantData.category !== 'vegetable') {
              playerMoney -= plantData.price;
              inventory.postMessage({ action: 'load_money', amount: playerMoney });
            }
            vscode.window.showInformationMessage(`A new ${species.replace(/_/g, ' ')} plant has sprouted in the greenhouse!`);
            plants.push({ key, species, size: 'start', harvested: false, hotkey_uses: 1 });
            addPlant({ key, species, size: 'start', harvested: false, hotkey_uses: 1 });
            writePlantsToDisk();
            requestWebviewSave();
            break;
          }
          case 'locked_species_click': {
            const species = message.species as string;
            const data = PLANTS[species];
            if (data) {
              vscode.window.showInformationMessage(`You need $${data.price} to unlock ${toLabel(species)}.`);
            }
            break;
          }
        }
      });
    }

    private getHtmlContent(webview: vscode.Webview): string {

      const style = webview.asWebviewUri(vscode.Uri.joinPath(this.context.extensionUri, 'dist/media', 'style.css'));
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
      logViewEvent('inventory', 'opened');
      webviewView.onDidChangeVisibility(() => logViewEvent('inventory', webviewView.visible ? 'opened' : 'closed'));
      webviewView.onDidDispose(() => logViewEvent('inventory', 'closed'));

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
              loadCookedFoodsToInventory();
              webview.postMessage({ action: 'load_money', amount: playerMoney });
            }else{
              webview.postMessage({
                action: 'key-tracking-mode'
              });
            }
            break;
          case 'sell': {
            playerMoney += message.amount ?? 0;
            if (message.species) {
              const count = harvestedCounts.get(message.species) ?? 0;
              if (count <= 1) { harvestedCounts.delete(message.species); }
              else { harvestedCounts.set(message.species, count - 1); }
            } else if (message.recipeKey) {
              const count = cookedFoodCounts.get(message.recipeKey) ?? 0;
              if (count <= 1) { cookedFoodCounts.delete(message.recipeKey); }
              else { cookedFoodCounts.set(message.recipeKey, count - 1); }
            }
            writePlantsToDisk();
            break;
          }
          case 'cooked': {
            const current = cookedFoodCounts.get(message.recipeKey) ?? 0;
            cookedFoodCounts.set(message.recipeKey, current + 1);
            for (const species of (message.species as string[])) {
              const count = harvestedCounts.get(species) ?? 0;
              if (count <= 1) {
                harvestedCounts.delete(species);
              } else {
                harvestedCounts.set(species, count - 1);
              }
            }
            writePlantsToDisk();
            break;
          }
        }
      });
  }

  private getHtmlContent(webview: vscode.Webview): string {

      const style = webview.asWebviewUri(vscode.Uri.joinPath(this.context.extensionUri, 'dist/media', 'style.css'));
      const webviewJS = webview.asWebviewUri(vscode.Uri.joinPath(this.context.extensionUri, 'dist/media', 'webview.js'));
      const openPot = webview.asWebviewUri(vscode.Uri.joinPath(this.context.extensionUri, 'dist/media/recipes', 'open_pot_2.png'));
      const closedPot = webview.asWebviewUri(vscode.Uri.joinPath(this.context.extensionUri, 'dist/media/recipes', 'closed_pot_2.png'));
      const foodBase = webview.asWebviewUri(vscode.Uri.joinPath(this.context.extensionUri, 'dist/media/recipes/food'));

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
          <div id="money-display">$0</div>
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