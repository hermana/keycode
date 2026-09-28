import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';
import { MODE } from './mode';
import { InstructionsWebViewProvider } from './instructionsWebViewProvider';
import { BaseWebViewProvider } from './baseWebViewProvider';
import { PLANTS, ALL_SPECIES, toLabel, isFreePlant, plantingCost } from './media/plants';
import { KEY_MAP } from './keyMap';
import { GameState } from './gameState';
import { HotkeyTracker } from './hotkeyTracker';
import { ActivityLog } from './activityLog';
import type { FromWebviewMessage, SpeciesOption } from './messages';

const CURRENT_MODE: MODE = MODE.GAME;

// Created in activate(); the providers get the state they need through their constructors
let game: GameState;
let hotkeys: HotkeyTracker;
let activity: ActivityLog;
let greenhouse: GreenhouseWebViewProvider;
let instructions: InstructionsWebViewProvider;
let inventory: InventoryWebViewProvider;
let config = vscode.workspace.getConfiguration('keycrop');

function requestWebviewSave() {
  greenhouse.postMessage({
    action: 'save_plants'
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

  const existingPlant = game.growingPlant(key);
  if (existingPlant) {
    logHotkeyUse(key, existingPlant.species);
    greenhouse.postMessage({
      action: 'grow',
      key: existingPlant.key
    });
    requestWebviewSave();
  } else {
    logHotkeyUse(key, 'None');
    // No plant for this key, or it has been harvested — free the key and let user pick
    game.clearKey(key);
    greenhouse.postMessage({
      action: 'choose_species',
      key,
      options: buildSpeciesOptions(game.playerMoney)
    });
  }
}

function buildSpeciesOptions(playerMoney: number): SpeciesOption[] {
  const toOption = (s: string, locked: boolean): SpeciesOption => ({
    species: s,
    label: toLabel(s),
    description: PLANTS[s]?.description ?? '',
    price: PLANTS[s]?.price ?? 0,
    isFree: isFreePlant(s),
    locked
  });
  const isUnlocked = (s: string) => isFreePlant(s) || playerMoney >= plantingCost(s);
  const byCost = (a: string, b: string) => plantingCost(a) - plantingCost(b);

  const unlocked = ALL_SPECIES.filter(isUnlocked).sort(byCost);
  const locked = ALL_SPECIES.filter(s => !isUnlocked(s)).sort(byCost);

  return [
    ...unlocked.map(s => toOption(s, false)),
    ...locked.map(s => toOption(s, true))
  ];
}

function logHotkeyUse(key: string, species: string): void {
  hotkeys.record(key, species, vscode.window.activeTextEditor?.document.fileName ?? '');
  instructions.postMessage({ action: 'update_counts', counts: { ...hotkeys.counts } });
}

export function activate(context: vscode.ExtensionContext) {

  const storageFolder = context.globalStorageUri.fsPath;
  fs.mkdirSync(storageFolder, { recursive: true });
  hotkeys = new HotkeyTracker(path.join(storageFolder, 'hotkeys.json'));
  activity = new ActivityLog(path.join(storageFolder, 'plugin_data.json'));
  activity.record('vscode', 'opened');

  game = new GameState(path.join(storageFolder, 'plants.json'));
  game.load();

  instructions = new InstructionsWebViewProvider(context, () => ({ ...hotkeys.counts }), (event) => activity.record('instructions', event));
	context.subscriptions.push(vscode.window.registerWebviewViewProvider(InstructionsWebViewProvider.viewType, instructions));

	if (CURRENT_MODE === MODE.GAME) {
		greenhouse = new GreenhouseWebViewProvider(context, game);
		context.subscriptions.push(vscode.window.registerWebviewViewProvider(GreenhouseWebViewProvider.viewType, greenhouse, { webviewOptions: { retainContextWhenHidden: true } }));

		inventory = new InventoryWebViewProvider(context, game);
		context.subscriptions.push(vscode.window.registerWebviewViewProvider(InventoryWebViewProvider.viewType, inventory, { webviewOptions: { retainContextWhenHidden: true } }));
	}

	vscode.workspace.onDidChangeConfiguration(() => {
	  //Update config
	  config = vscode.workspace.getConfiguration('keycrop');
	});

  for (const { command, commandId } of KEY_MAP) {
    context.subscriptions.push(vscode.commands.registerCommand(commandId, () => growPlant(command)));
  }

}

// This method is called when your extension is deactivated
export function deactivate() {}

export class GreenhouseWebViewProvider extends BaseWebViewProvider {

    public static readonly viewType = 'greenhouse';

    constructor(context: vscode.ExtensionContext, private readonly game: GameState) {
      super(context, (event) => activity.record('greenhouse', event));
    }

    protected onMessage(message: FromWebviewMessage): void {
      switch (message.type) {
        case 'init':
          if(CURRENT_MODE === MODE.GAME){
            this.game.load();
            //Send background
            this.postMessage({
              action: 'background',
              value: 'dirt'
            });
            //Load existing plants array
            for (const p of this.game.allPlants) {
              this.postMessage({
                action: 'load',
                key: p.key,
                species: p.species,
                size: p.size,
                harvested: p.harvested,
                hotkey_uses: p.hotkey_uses
              });
            }
          }else{
            this.postMessage({
              action: 'key-tracking-mode'
            });
          }
          break;
        case 'save_plants': {
          this.game.updateGrowth(message.content);
          this.game.save();
          break;
        }
        case 'harvested': {
          const harvest = this.game.harvest(message.key);
          if (harvest) {
            inventory.postMessage({
              action: 'load_harvested',
              species: harvest.species,
              count: 1
            });
            if (harvest.alreadyOwned) {
              vscode.window.showInformationMessage("Your " + message.text.replace(/_/g, ' ') + " plant has been harvested!");
            }
            if (harvest.completedAllSpecies) {
              vscode.window.showInformationMessage("Achievement unlocked: you've grown one of every plant!");
              inventory.postMessage({ action: 'achievement' });
            }
          }
          break;
        }
        case 'select_species': {
          const { key, species } = message;
          const moneyBefore = this.game.playerMoney;
          this.game.plant(key, species);
          if (this.game.playerMoney !== moneyBefore) {
            inventory.postMessage({ action: 'load_money', amount: this.game.playerMoney });
          }
          vscode.window.showInformationMessage(`A new ${species.replace(/_/g, ' ')} plant has sprouted in the greenhouse!`);
          this.postMessage({ action: 'add', species, key });
          this.game.save();
          requestWebviewSave();
          break;
        }
        case 'locked_species_click': {
          const species = message.species;
          const data = PLANTS[species];
          if (data) {
            vscode.window.showInformationMessage(`You need $${data.price} to unlock ${toLabel(species)}.`);
          }
          break;
        }
      }
    }

    protected getHtmlContent(webview: vscode.Webview): string {

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
          ${CURRENT_MODE === MODE.GAME ? '<div id="fence-strip"></div><div id="decoration-strip"></div>' : ''}
          <script src="${webviewJS}"></script>
        </body>
        </html>
      `;
    }
  }

export class InventoryWebViewProvider extends BaseWebViewProvider {

  public static readonly viewType = "inventory";

  constructor(context: vscode.ExtensionContext, private readonly game: GameState) {
    super(context, (event) => activity.record('inventory', event));
  }

  protected onMessage(message: FromWebviewMessage): void {
    switch (message.type) {
      case 'init':
        if(CURRENT_MODE === MODE.GAME){
          //Send background
          this.postMessage({
            action: 'background',
            value: 'inventory'
          });
          //Load harvested plants and cooked food into inventory
          this.game.harvested.forEach((count, species) => {
            this.postMessage({ action: 'load_harvested', species, count });
          });
          this.game.cooked.forEach((count, recipeKey) => {
            this.postMessage({ action: 'load_cooked', recipeKey, count });
          });
          this.postMessage({ action: 'load_collection', recipeKeys: [...this.game.discovered] });
          this.postMessage({ action: 'load_money', amount: this.game.playerMoney });
        }else{
          this.postMessage({
            action: 'key-tracking-mode'
          });
        }
        break;
      case 'sell': {
        this.game.sell(message.amount ?? 0, message.species, message.recipeKey);
        this.game.save();
        break;
      }
      case 'cooked': {
        if (this.game.cook(message.recipeKey, message.species)) {
          this.postMessage({ action: 'load_collection', recipeKeys: [message.recipeKey] });
        }
        this.game.save();
        break;
      }
    }
  }

  protected getHtmlContent(webview: vscode.Webview): string {

      const style = webview.asWebviewUri(vscode.Uri.joinPath(this.context.extensionUri, 'dist/media', 'style.css'));
      const webviewJS = webview.asWebviewUri(vscode.Uri.joinPath(this.context.extensionUri, 'dist/media', 'webview.js'));
      const openPot = webview.asWebviewUri(vscode.Uri.joinPath(this.context.extensionUri, 'dist/media/pot', 'closed.png'));
      const closedPot = webview.asWebviewUri(vscode.Uri.joinPath(this.context.extensionUri, 'dist/media/pot', 'open.png'));
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
          <div id="empty-inventory-message" class="instructions">You currently don't have anything in your inventory.</div>
          <div id="keycrop">
            <!-- Shelves hidden for now; uncomment to bring them back (renderShelfRow skips when this is missing) -->
            <!-- <div id="shelf-strip"></div> -->
          </div>
          <div id="collection-grid"></div>
          <div id="inventory-bottom-left">
            <div id="money-display">$0</div>
            <button id="collection-btn">Collection</button>
          </div>
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