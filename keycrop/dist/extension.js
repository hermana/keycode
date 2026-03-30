"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/extension.ts
var extension_exports = {};
__export(extension_exports, {
  GreenhouseWebViewProvider: () => GreenhouseWebViewProvider,
  InventoryWebViewProvider: () => InventoryWebViewProvider,
  activate: () => activate,
  deactivate: () => deactivate
});
module.exports = __toCommonJS(extension_exports);
var vscode2 = __toESM(require("vscode"));
var fs = __toESM(require("fs"));
var path = __toESM(require("path"));

// src/instructionsWebViewProvider.ts
var vscode = __toESM(require("vscode"));
var InstructionsWebViewProvider = class {
  constructor(context) {
    this.context = context;
  }
  static viewType = "instructions";
  view;
  resolveWebviewView(webviewView, _context, _token) {
    this.view = webviewView;
    const webview = webviewView.webview;
    webview.options = {
      enableScripts: true
    };
    webview.html = this.getHtmlContent(webview);
  }
  getHtmlContent(webview) {
    const style = webview.asWebviewUri(vscode.Uri.joinPath(this.context.extensionUri, "src/media", "style.css"));
    const webviewJS = webview.asWebviewUri(vscode.Uri.joinPath(this.context.extensionUri, "dist/media", "webview.js"));
    const iconsPath = webview.asWebviewUri(vscode.Uri.joinPath(this.context.extensionUri, "src/media/vegetables"));
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
          <p class="key-instruction"><img src="${iconsPath + "/chilli_harvested.png"}" alt="Chili" width="20" height="20"> <span class="instruction-bold"> CTRL+SHIFT+SPACE</span>: See function parameter hints.</p>
          <p class="key-instruction"><img src="${iconsPath + "/bean_harvested.png"}" alt="Bean" width="20" height="20"> <span class="instruction-bold"> CTRL+SHIFT+M</span>: See warnings and errors in the Problems view.</p>
          <p class="key-instruction"><img src="${iconsPath + "/tomato_harvested.png"}" alt="Tomato" width="20" height="20"> <span class="instruction-bold"> CTRL+SHIFT+L</span>: Multicursor-select all instances of a specific word.</p>
          <p class="key-instruction"><img src="${iconsPath + "/lettuce_harvested.png"}" alt="Lettuce" width="20" height="20"> <span class="instruction-bold"> CTRL+/</span>: Comment or un-comment code.</p>
          <p class="key-instruction"><img src="${iconsPath + "/broccoli_harvested.png"}" alt="Broccoli" width="20" height="20"> <span class="instruction-bold"> CTRL+[</span>: Outdent a line.</p>
        </div>
        <script src="${webviewJS}"></script>
      </body>
      </html>
    `;
  }
};

// src/extension.ts
var CURRENT_MODE = 0 /* GAME */;
var greenhouse;
var instructions;
var inventory;
var config = vscode2.workspace.getConfiguration("keycrop");
var extensionStorageFolder = "";
var plantsPath;
var keyTrackingPath;
var keyTrackingString = [];
function loadPlantsFile() {
  if (!fs.existsSync(extensionStorageFolder)) {
    fs.mkdirSync(extensionStorageFolder, { recursive: true });
  }
  if (fs.existsSync(plantsPath)) {
    try {
      let savedPlants = JSON.parse(fs.readFileSync(plantsPath, "utf8"));
      Object.entries(savedPlants).forEach((p) => {
        greenhouse.postMessage({
          action: "load",
          species: p[1].species,
          size: p[1].size,
          harvested: p[1].harvested,
          hotkey_uses: p[1].hotkey_uses
        });
        plants.push({ key: p[1].key, species: p[1].species, size: p[1].size, harvested: p[1].harvested, hotkey_uses: p[1].hotkey_uses });
      });
    } catch (e) {
      console.error("Saved plants could not be loaded");
      console.error(e);
      plants = new Array();
    }
  } else {
    plants = new Array();
  }
}
function savePlants() {
  greenhouse.postMessage({
    action: "save_plants"
  });
}
var plants = new Array();
function addPlant(plant) {
  greenhouse.postMessage({
    action: "add",
    species: plant.species,
    key: plant.key
  });
}
function growPlant(key) {
  if (plants.some((p) => p.key === key)) {
    let patch = plants.filter((p) => p.key === key);
    patch.forEach(
      (p) => {
        greenhouse.postMessage({
          action: "grow",
          species: p.species
        });
      }
    );
  } else {
    vscode2.window.showQuickPick(["bean", "tomato", "broccoli"], {
      placeHolder: "Choose a species for your new plant"
    }).then((species) => {
      if (species) {
        vscode2.window.showInformationMessage("A new " + species + " plant has sprouted in the greenhouse!");
        plants.push({ key, species, size: "start", harvested: false, hotkey_uses: 0 });
        addPlant({ key, species, size: "start", harvested: false, hotkey_uses: 0 });
      }
    });
  }
  savePlants();
}
function logKeyPress(plant) {
  keyTrackingString.push({
    key: plant,
    time: Date.now()
  });
  fs.writeFileSync(keyTrackingPath, JSON.stringify(keyTrackingString));
}
function activate(context) {
  extensionStorageFolder = context.globalStorageUri.path.substring(1);
  plantsPath = path.join(extensionStorageFolder, "plants.json");
  keyTrackingPath = path.join(extensionStorageFolder, "keytracking.json");
  greenhouse = new GreenhouseWebViewProvider(context);
  context.subscriptions.push(vscode2.window.registerWebviewViewProvider(GreenhouseWebViewProvider.viewType, greenhouse));
  instructions = new InstructionsWebViewProvider(context);
  context.subscriptions.push(vscode2.window.registerWebviewViewProvider(InstructionsWebViewProvider.viewType, instructions));
  inventory = new InventoryWebViewProvider(context);
  context.subscriptions.push(vscode2.window.registerWebviewViewProvider(InventoryWebViewProvider.viewType, inventory));
  vscode2.workspace.onDidChangeConfiguration((event) => {
    config = vscode2.workspace.getConfiguration("keycrop");
    if (event.affectsConfiguration("keycrop-view.scale")) {
      greenhouse.postMessage({
        action: "scale",
        value: config.get("scale")
      });
    }
  });
  const growCommandPalette = vscode2.commands.registerCommand("keycrop.growCommandPalette", () => {
    if (CURRENT_MODE === 0) {
      growPlant("command_palette");
    } else {
      logKeyPress("command_palette");
    }
  });
  const growDeleteCurrentLine = vscode2.commands.registerCommand("keycrop.growDeleteCurrentLine", () => {
    if (CURRENT_MODE === 0) {
      growPlant("delete_current_line");
    } else {
      logKeyPress("delete_current_line");
    }
  });
  const growJumpToBracket = vscode2.commands.registerCommand("keycrop.growJumpToBracket", () => {
    if (CURRENT_MODE === 0) {
      growPlant("jump_to_bracket");
    } else {
      logKeyPress("jump_to_bracket");
    }
  });
  const growShowAllSymbols = vscode2.commands.registerCommand("keycrop.growShowAllSymbols", () => {
    if (CURRENT_MODE === 0) {
      growPlant("show_all_symbols");
    } else {
      logKeyPress("show_all_symbols");
    }
  });
  const growGoToSymbol = vscode2.commands.registerCommand("keycrop.growGoToSymbol", () => {
    if (CURRENT_MODE === 0) {
      growPlant("go_to_symbol");
    } else {
      logKeyPress("go_to_symbol");
    }
  });
  const growViewProblems = vscode2.commands.registerCommand("keycrop.growViewProblems", () => {
    if (CURRENT_MODE === 0) {
      growPlant("view_problems");
    } else {
      logKeyPress("view_problems");
    }
  });
  const growSelectAllOccurrences = vscode2.commands.registerCommand("keycrop.growCursorAtAllOccurrences", () => {
    if (CURRENT_MODE === 0) {
      growPlant("cursor_at_all_occurrences");
    } else {
      logKeyPress("cursor_at_all_occurrences");
    }
  });
  const growTriggerParameterHints = vscode2.commands.registerCommand("keycrop.growTriggerParameterHints", () => {
    if (CURRENT_MODE === 0) {
      growPlant("trigger_parameter_hints");
    } else {
      logKeyPress("trigger_parameter_hints");
    }
  });
  const growSplitEditor = vscode2.commands.registerCommand("keycrop.growSplitEditor", () => {
    if (CURRENT_MODE === 0) {
      growPlant("split_editor");
    } else {
      logKeyPress("split_editor");
    }
  });
  const growOpenLastUsedEditorInGroup = vscode2.commands.registerCommand("keycrop.growOpenLastUsedEditorInGroup", () => {
    if (CURRENT_MODE === 0) {
      growPlant("open_last_used_editor_in_group");
    } else {
      logKeyPress("open_last_used_editor_in_group");
    }
  });
  const growToggleTerminal = vscode2.commands.registerCommand("keycrop.growToggleTerminal", () => {
    if (CURRENT_MODE === 0) {
      growPlant("toggle_terminal");
    } else {
      logKeyPress("toggle_terminal");
    }
  });
  const growCreateNewTerminal = vscode2.commands.registerCommand("keycrop.growCreateNewTerminal", () => {
    if (CURRENT_MODE === 0) {
      growPlant("create_new_terminal");
    } else {
      logKeyPress("create_new_terminal");
    }
  });
  context.subscriptions.push(growCommandPalette, growJumpToBracket, growShowAllSymbols, growGoToSymbol, growViewProblems, growSelectAllOccurrences, growTriggerParameterHints, growSplitEditor, growOpenLastUsedEditorInGroup, growToggleTerminal, growCreateNewTerminal, growDeleteCurrentLine);
}
function deactivate() {
}
var GreenhouseWebViewProvider = class {
  constructor(context) {
    this.context = context;
  }
  static viewType = "greenhouse";
  view;
  postMessage(message) {
    this.view?.webview.postMessage(message);
  }
  resolveWebviewView(webviewView, context, _token) {
    this.view = webviewView;
    const webview = webviewView.webview;
    webview.options = {
      enableScripts: true
    };
    webview.html = this.getHtmlContent(
      webviewView.webview
    );
    webview.onDidReceiveMessage((message) => {
      switch (message.type) {
        //Error message
        case "error":
          vscode2.window.showErrorMessage(message.text);
          break;
        //Info message
        case "info":
          vscode2.window.showInformationMessage(message.text);
          break;
        case "init":
          if (CURRENT_MODE === 0 /* GAME */) {
            webview.postMessage({
              action: "background",
              value: "dirt"
            });
            loadPlantsFile();
          } else {
            webview.postMessage({
              action: "key-tracking-mode"
            });
          }
          break;
        case "save_plants":
          fs.writeFileSync(plantsPath, JSON.stringify(message.content));
          break;
        case "harvested":
          vscode2.window.showInformationMessage("Your " + message.text + " plant has been harvested!");
          break;
      }
    });
  }
  getHtmlContent(webview) {
    const style = webview.asWebviewUri(vscode2.Uri.joinPath(this.context.extensionUri, "src/media", "style.css"));
    const webviewJS = webview.asWebviewUri(vscode2.Uri.joinPath(this.context.extensionUri, "dist/media", "webview.js"));
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
          <div id="keycrop" background="${CURRENT_MODE === 0 /* GAME */ ? config.get("background") : "blackout"}">
          </div>
          <script src="${webviewJS}"></script>
        </body>
        </html>
      `;
  }
};
var InventoryWebViewProvider = class {
  constructor(context) {
    this.context = context;
  }
  static viewType = "inventory";
  view;
  resolveWebviewView(webviewView, context, token) {
    this.view = webviewView;
    const webview = webviewView.webview;
    webview.options = {
      enableScripts: true
    };
    webview.html = this.getHtmlContent(
      webviewView.webview
    );
    webview.onDidReceiveMessage((message) => {
      switch (message.type) {
        case "init":
          if (CURRENT_MODE === 0 /* GAME */) {
            webview.postMessage({
              action: "background",
              value: "blackout"
            });
            loadPlantsFile();
          } else {
            webview.postMessage({
              action: "key-tracking-mode"
            });
          }
          break;
      }
    });
  }
  getHtmlContent(webview) {
    const style = webview.asWebviewUri(vscode2.Uri.joinPath(this.context.extensionUri, "src/media", "style.css"));
    const webviewJS = webview.asWebviewUri(vscode2.Uri.joinPath(this.context.extensionUri, "dist/media", "webview.js"));
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
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  GreenhouseWebViewProvider,
  InventoryWebViewProvider,
  activate,
  deactivate
});
//# sourceMappingURL=extension.js.map
