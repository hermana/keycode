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
  GeneratorWebViewProvider: () => GeneratorWebViewProvider,
  GreenhouseWebViewProvider: () => GreenhouseWebViewProvider,
  InventoryWebViewProvider: () => InventoryWebViewProvider,
  activate: () => activate,
  deactivate: () => deactivate
});
module.exports = __toCommonJS(extension_exports);
var vscode = __toESM(require("vscode"));
var fs = __toESM(require("fs"));
var path = __toESM(require("path"));
var CURRENT_MODE = 0 /* GAME */;
var greenhouse;
var generator;
var inventory;
var config = vscode.workspace.getConfiguration("keycrop");
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
        plants.push({ species: p[1].species, size: p[1].size, harvested: p[1].harvested, hotkey_uses: p[1].hotkey_uses });
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
    species: plant.species
  });
}
function growPlant(plant) {
  if (plants.some((p) => p.species === plant.species)) {
    let patch = plants.filter((p) => p.species === plant.species);
    patch.forEach(
      (p) => {
        greenhouse.postMessage({
          action: "grow",
          species: plant.species
        });
      }
    );
  } else {
    vscode.window.showInformationMessage("A new " + plant.species + " plant has sprouted in the greenhouse!");
    plants.push(plant);
    addPlant(plant);
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
  context.subscriptions.push(vscode.window.registerWebviewViewProvider(GreenhouseWebViewProvider.viewType, greenhouse));
  generator = new GeneratorWebViewProvider(context);
  context.subscriptions.push(vscode.window.registerWebviewViewProvider(GeneratorWebViewProvider.viewType, generator));
  inventory = new InventoryWebViewProvider(context);
  context.subscriptions.push(vscode.window.registerWebviewViewProvider(InventoryWebViewProvider.viewType, inventory));
  vscode.workspace.onDidChangeConfiguration((event) => {
    config = vscode.workspace.getConfiguration("keycrop");
    if (event.affectsConfiguration("keycrop-view.scale")) {
      greenhouse.postMessage({
        action: "scale",
        value: config.get("scale")
      });
    }
  });
  const growCommandPalette = vscode.commands.registerCommand("keycrop.growCommandPalette", () => {
    if (CURRENT_MODE === 0) {
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
    if (CURRENT_MODE === 0) {
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
    if (CURRENT_MODE === 0) {
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
    if (CURRENT_MODE === 0) {
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
    if (CURRENT_MODE === 0) {
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
    if (CURRENT_MODE === 0) {
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
    if (CURRENT_MODE === 0) {
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
    if (CURRENT_MODE === 0) {
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
    if (CURRENT_MODE === 0) {
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
    if (CURRENT_MODE === 0) {
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
    if (CURRENT_MODE === 0) {
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
    if (CURRENT_MODE === 0) {
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
function deactivate() {
}
var GeneratorWebViewProvider = class {
  constructor(context) {
    this.context = context;
  }
  static viewType = "generator";
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
          <title>KeyCrop Generator</title>
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
          </div>
          <script src="${webviewJS}"></script>
        </body>
        </html>
      `;
  }
};
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
          vscode.window.showErrorMessage(message.text);
          break;
        //Info message
        case "info":
          vscode.window.showInformationMessage(message.text);
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
          vscode.window.showInformationMessage("Your " + message.text + " plant has been harvested!");
          break;
      }
    });
  }
  getHtmlContent(webview) {
    const style = webview.asWebviewUri(vscode.Uri.joinPath(this.context.extensionUri, "src/media", "style.css"));
    const webviewJS = webview.asWebviewUri(vscode.Uri.joinPath(this.context.extensionUri, "dist/media", "webview.js"));
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
    const style = webview.asWebviewUri(vscode.Uri.joinPath(this.context.extensionUri, "src/media", "style.css"));
    const webviewJS = webview.asWebviewUri(vscode.Uri.joinPath(this.context.extensionUri, "dist/media", "webview.js"));
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
  GeneratorWebViewProvider,
  GreenhouseWebViewProvider,
  InventoryWebViewProvider,
  activate,
  deactivate
});
//# sourceMappingURL=extension.js.map
