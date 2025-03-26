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
  WebViewProvider: () => WebViewProvider,
  activate: () => activate,
  deactivate: () => deactivate
});
module.exports = __toCommonJS(extension_exports);
var vscode = __toESM(require("vscode"));
var fs = __toESM(require("fs"));
var path = __toESM(require("path"));
var webview;
var config = vscode.workspace.getConfiguration("keycrop");
var extensionStorageFolder = "";
var plantsPath;
function loadPlantsFile() {
  if (!fs.existsSync(extensionStorageFolder)) fs.mkdirSync(extensionStorageFolder, { recursive: true });
  if (fs.existsSync(plantsPath)) {
    try {
      let savedPlants = JSON.parse(fs.readFileSync(plantsPath, "utf8"));
      Object.entries(savedPlants).forEach((p) => {
        webview.postMessage({
          action: "load",
          species: p[1].species,
          size: p[1].size,
          harvested: p[1].harvested
        });
      });
    } catch (e) {
      console.log("PLANTS COULD NOT BE LOADED");
      console.log(e);
      plants = new Array();
    }
  } else {
    plants = new Array();
  }
}
function savePlants() {
  webview.postMessage({
    action: "save_plants"
  });
}
var plants = new Array();
function addPlant(plant) {
  webview.postMessage({
    action: "add",
    species: plant.species
  });
}
function growPlant(plant) {
  if (plants.some((p) => p.species === plant.species)) {
    let patch = plants.filter((p) => p.species === plant.species);
    patch.forEach(
      (p) => {
        webview.postMessage({
          action: "grow",
          species: plant.species
        });
      }
    );
  } else {
    vscode.window.showInformationMessage("A new " + plant.species + " plant has sprouted in the greenhouse!");
    plants.push(plant);
    addPlant(plant);
    savePlants();
  }
}
function activate(context) {
  extensionStorageFolder = context.globalStorageUri.path.substring(1);
  plantsPath = path.join(extensionStorageFolder, "plants.json");
  webview = new WebViewProvider(context);
  context.subscriptions.push(vscode.window.registerWebviewViewProvider(WebViewProvider.viewType, webview));
  vscode.workspace.onDidChangeConfiguration((event) => {
    config = vscode.workspace.getConfiguration("keycrop");
    if (event.affectsConfiguration("keycrop.background")) {
      webview.postMessage({
        action: "background",
        value: config.get("background")
      });
    }
    if (event.affectsConfiguration("keycrop-view.scale")) {
      webview.postMessage({
        action: "scale",
        value: config.get("scale")
      });
    }
  });
  const helloWorld = vscode.commands.registerCommand("keycrop.helloWorld", () => {
    vscode.window.showInformationMessage(`Hello world from keycrop!`);
  });
  const growBean = vscode.commands.registerCommand("keycrop.growBean", () => {
    growPlant({
      species: "bean",
      size: "small",
      //TODO: left off here
      harvested: false
    });
  });
  const growChili = vscode.commands.registerCommand("keycrop.growChili", () => {
    growPlant({
      species: "chili",
      size: "small",
      harvested: false
    });
  });
  const growBroccoli = vscode.commands.registerCommand("keycrop.growBroccoli", () => {
    growPlant({
      species: "broccoli",
      size: "small",
      harvested: false
    });
  });
  const growLettuce = vscode.commands.registerCommand("keycrop.growLettuce", () => {
    growPlant({
      species: "lettuce",
      size: "small",
      harvested: false
    });
  });
  const growTomato = vscode.commands.registerCommand("keycrop.growTomato", () => {
    growPlant({
      species: "tomato",
      size: "small",
      harvested: false
    });
  });
  context.subscriptions.push(growBean, growChili, growBroccoli, growLettuce, growTomato, helloWorld);
}
function deactivate() {
}
var WebViewProvider = class {
  constructor(context) {
    this.context = context;
  }
  static viewType = "keycrop";
  //TODO: may be able to switch views later
  view;
  postMessage(message) {
    console.log("TRYING TO POST");
    console.log(message.action);
    this.view?.webview.postMessage(message);
  }
  resolveWebviewView(webviewView, context, _token) {
    this.view = webviewView;
    const webview2 = webviewView.webview;
    webview2.options = {
      enableScripts: true
    };
    webview2.html = this.getHtmlContent(
      webviewView.webview
    );
    webview2.onDidReceiveMessage((message) => {
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
          webview2.postMessage({
            action: "background",
            value: "dirt"
          });
          loadPlantsFile();
          break;
        case "save_plants":
          console.log("THE SAVE FUNCTION IS CALLED");
          fs.writeFileSync(plantsPath, JSON.stringify(message.content));
          break;
        case "harvested":
          vscode.window.showInformationMessage("Your " + message.text + " plant has been harvested!");
          break;
        case "level_one":
          vscode.window.showInformationMessage("Congratulations! You have finished the game!");
          break;
      }
    });
  }
  getHtmlContent(webview2) {
    const style = webview2.asWebviewUri(vscode.Uri.joinPath(this.context.extensionUri, "src/media", "style.css"));
    const mainJS = webview2.asWebviewUri(vscode.Uri.joinPath(this.context.extensionUri, "src/media", "main.js"));
    const plantsJS = webview2.asWebviewUri(vscode.Uri.joinPath(this.context.extensionUri, "src/media", "plants.js"));
    const levelsJS = webview2.asWebviewUri(vscode.Uri.joinPath(this.context.extensionUri, "src/media", "levels.js"));
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
          <div id="keycrop" background="${config.get("background")}">
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
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  WebViewProvider,
  activate,
  deactivate
});
//# sourceMappingURL=extension.js.map
