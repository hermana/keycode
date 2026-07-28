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

// src/keyMap.ts
var KEY_MAP = [
  { key: "ctrl+shift+p", category: "Using VSCode", capital_key: "CTRL+SHIFT+P", command: "command_palette", description: "Show command palette", active: false },
  { key: "ctrl+shift+k", category: "Editing", capital_key: "CTRL+SHIFT+K", command: "delete_current_line", description: "Delete current line", active: false },
  { key: "ctrl+shift+\\", category: "Navigating Code", capital_key: "CTRL+SHIFT+\\", command: "jump_to_bracket", description: "Jump to bracket", active: false },
  { key: "ctrl+t", category: "Navigating Code", capital_key: "CTRL+T", command: "show_all_symbols", description: "Show all symbols", active: false },
  { key: "ctrl+shift+o", category: "Navigating Code", capital_key: "CTRL+SHIFT+O", command: "go_to_symbol", description: "Go to symbol", active: false },
  { key: "ctrl+shift+m", category: "Debugging", capital_key: "CTRL+SHIFT+M", command: "view_problems", description: "View problems", active: false },
  { key: "ctrl+shift+l", category: "Multicursor", capital_key: "CTRL+SHIFT+L", command: "cursor_at_all_occurrences", description: "Add a cursor at all occurrences", active: false },
  { key: "ctrl+shift+space", category: "IntelliSense", capital_key: "CTRL+SHIFT+SPACE", command: "trigger_parameter_hints", description: "Trigger parameter hints", active: false },
  { key: "ctrl+\\", category: "Using VSCode", capital_key: "CTRL+\\", command: "split_editor", description: "Split editor", active: false },
  { key: "ctrl+shift+tab", category: "Using VSCode", capital_key: "CTRL+SHIFT+TAB", command: "open_last_used_editor_in_group", description: "Open last used editor in group", active: false },
  { key: "ctrl+`", category: "Terminal", capital_key: "CTRL+`", command: "toggle_terminal", description: "Toggle terminal", active: false },
  { key: "ctrl+shift+`", category: "Terminal", capital_key: "CTRL+SHIFT+`", command: "create_new_terminal", description: "Create new terminal", active: false },
  { key: "ctrl+g", category: "Navigating Code", capital_key: "CTRL+G", command: "go_to_line", description: "Go to line", active: false },
  // this is where I started adding new stuff
  { key: "ctrl+.", category: "Navigating Code", capital_key: "CTRL+.", command: "quick_fix", description: "Quick Fix", active: false },
  { key: "ctrl+shift+s", category: "Using VSCode", capital_key: "CTRL+SHIFT+S", command: "save_file_as", description: "Save File As", active: false },
  { key: "alt+up", category: "Editing", capital_key: "ALT+UP", command: "move_line_up", description: "Move line up", active: false },
  { key: "alt+down", category: "Editing", capital_key: "ALT+DOWN", command: "move_line_down", description: "Move line down", active: false },
  { key: "ctrl+l", category: "Editing", capital_key: "CTRL+L", command: "select_line", description: "Select line", active: false },
  { key: "shift+alt+i", category: "Multicursor", capital_key: "SHIFT+ALT+I", command: "insert_cursor_at_end_of_each_line_selected", description: "Insert cursor at end of each line selected", active: false },
  { key: "ctrl+shift+up", category: "Multicursor", capital_key: "CTRL+SHIFT+UP", command: "add_cursor_above", description: "Add cursor above", active: true },
  { key: "ctrl+shift+down", category: "Multicursor", capital_key: "CTRL+SHIFT+DOWN", command: "add_cursor_below", description: "Add cursor below", active: true },
  { key: "ctrl+space", category: "IntelliSense", capital_key: "CTRL+SPACE", command: "trigger_suggest", description: "Trigger suggestions", active: false },
  { key: "ctrl+k ctrl+i", category: "IntelliSense", capital_key: "CTRL+K CTRL+I", command: "show_hover", description: "Show hover with function details", active: false },
  { key: "ctrl+k v", category: "Markdown", capital_key: "CTRL+K V", command: "open_markdown_side", description: "Open markdown to the side", active: true },
  { key: "ctrl+shift+v", category: "Markdown", capital_key: "CTRL+SHIFT+V", command: "open_markdown_preview", description: "Open markdown preview", active: true },
  { key: "ctrl+h", category: "Search", capital_key: "CTRL+H", command: "replace", description: "Replace", active: true },
  { key: "shift+alt+down", category: "Editing", capital_key: "SHIFT+ALT+DOWN", command: "copy_line_below", description: "Copy line below", active: true },
  { key: "shift+alt+up", category: "Editing", capital_key: "SHIFT+ALT+UP", command: "copy_line_above", description: "Copy line above", active: true },
  { key: "ctrl+f", category: "Search", capital_key: "CTRL+F", command: "find", description: "Find", active: true },
  { key: "shift+alt+right", category: "Editing", capital_key: "SHIFT+ALT+RIGHT", command: "expand_selection", description: "Expand selection", active: true },
  { key: "shift+alt+left", category: "Editing", capital_key: "SHIFT+ALT+LEFT", command: "reduce_selection", description: "Reduce selection", active: true },
  { key: "ctrl+shift+a", category: "Editing", capital_key: "CTRL+SHIFT+A", command: "toggle_block_comment", description: "Toggle block comment", active: true },
  { key: "ctrl+c", category: "Editing", capital_key: "CTRL+C", command: "copy", description: "Copy", active: false },
  { key: "ctrl+v", category: "Editing", capital_key: "CTRL+V", command: "paste", description: "Paste", active: false }
];

// src/instructionsWebViewProvider.ts
var InstructionsWebViewProvider = class {
  constructor(context, getHotkeyCounts2, onViewEvent) {
    this.context = context;
    this.getHotkeyCounts = getHotkeyCounts2;
    this.onViewEvent = onViewEvent;
  }
  static viewType = "instructions";
  _view;
  postMessage(message) {
    this._view?.webview.postMessage(message);
  }
  resolveWebviewView(webviewView, _context, _token) {
    this._view = webviewView;
    this.onViewEvent?.("opened");
    webviewView.onDidChangeVisibility(() => this.onViewEvent?.(webviewView.visible ? "opened" : "closed"));
    webviewView.onDidDispose(() => this.onViewEvent?.("closed"));
    const webview = webviewView.webview;
    webview.options = {
      enableScripts: true
    };
    webview.html = this.getHtmlContent(webview);
    webview.onDidReceiveMessage((message) => {
      if (message.type === "init") {
        webview.postMessage({ action: "update_counts", counts: this.getHotkeyCounts() });
      }
    });
  }
  getHtmlContent(webview) {
    const style = webview.asWebviewUri(vscode.Uri.joinPath(this.context.extensionUri, "dist/media", "style.css"));
    const activeKeys = KEY_MAP.filter((k) => k.active);
    const categories = [...new Set(activeKeys.map((k) => k.category))];
    const categoryButtons = categories.map(
      (cat) => `<button class="category-btn" data-category="${cat}">${cat}</button>`
    ).join("\n        ");
    const tableRows = activeKeys.map(
      (k) => `<tr data-category="${k.category}" data-command="${k.command}"><td>${k.capital_key}</td><td>${k.description}</td><td class="use-count">0</td></tr>`
    ).join("\n                ");
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
          <div class="table-scroll">
            <table class="key-table">
              <thead>
                <tr>
                  <th>Hotkey</th>
                  <th>Description</th>
                  <th>Uses</th>
                </tr>
              </thead>
              <tbody>
                ${tableRows}
              </tbody>
            </table>
          </div>
          <div class="category-btn-row">
            ${categoryButtons}
          </div>
        </div>
        <script>
          const vscode = acquireVsCodeApi();
          vscode.postMessage({ type: 'init' });

          window.addEventListener('message', (event) => {
            const message = event.data;
            if (message.action === 'update_counts') {
              Object.entries(message.counts).forEach(([cmd, count]) => {
                const row = document.querySelector('tr[data-command="' + cmd + '"]');
                if (row) { row.querySelector('.use-count').textContent = String(count); }
              });
            }
          });

          const buttons = document.querySelectorAll('.category-btn');
          const rows = document.querySelectorAll('tbody tr');

          let activeCategory = null;

          buttons.forEach(btn => {
            btn.addEventListener('click', () => {
              const cat = btn.dataset.category;
              if (activeCategory === cat) {
                activeCategory = null;
                buttons.forEach(b => b.classList.remove('selected'));
                rows.forEach(r => r.style.display = '');
              } else {
                activeCategory = cat;
                buttons.forEach(b => b.classList.toggle('selected', b.dataset.category === cat));
                rows.forEach(r => {
                  r.style.display = r.dataset.category === cat ? '' : 'none';
                });
              }
            });
          });
        </script>
      </body>
      </html>
    `;
  }
};

// src/media/plants.ts
var PLANTS = {
  bean: { price: 2, category: "vegetable", description: "A humble unassuming legume." },
  tomato: { price: 2, category: "vegetable", description: "This crop has a wide variety of culinary uses." },
  broccoli: { price: 2, category: "vegetable", description: "Nutritious" },
  chili: { price: 2, category: "vegetable", description: "Spicy and flavorful." },
  lettuce: { price: 2, category: "vegetable", description: "Great in salads" },
  rhubarb: { price: 2, category: "vegetable", description: "The stalks are edible." },
  ivy: { price: 25, category: "decorative", description: "A decorative ground cover." },
  jacaranda_tree: { price: 25, category: "decorative", description: "A tree with purple leaves." },
  raspberry: { price: 4, category: "fruit", description: "A sweet and tart fruit." },
  strawberry: { price: 4, category: "fruit", description: "A sweet and juicy fruit." },
  watermelon: { price: 4, category: "fruit", description: "Great with hotkeys in the summer." },
  glowberry: { price: 50, category: "exotic", description: "Glowberries emit a soft bioluminescent hue." },
  bulbino: { price: 50, category: "exotic", description: "A mysterious plant." },
  poison_cabbage: { price: 50, category: "exotic", description: "Closely related to regular cabbage." },
  neon_mould: { price: 50, category: "exotic", description: "Radioactive mould." }
};
var ALL_SPECIES = Object.keys(PLANTS);

// src/extension.ts
var CURRENT_MODE = 0 /* GAME */;
var greenhouse;
var instructions;
var inventory;
var config = vscode2.workspace.getConfiguration("keycrop");
var extensionStorageFolder = "";
var plantsPath;
var hotkeysPath;
var hotkeyLog = [];
var pluginDataPath;
var pluginDataLog = [];
function readPlantsFromDisk() {
  if (!fs.existsSync(extensionStorageFolder)) {
    fs.mkdirSync(extensionStorageFolder, { recursive: true });
  }
  if (fs.existsSync(plantsPath)) {
    try {
      const saved = JSON.parse(fs.readFileSync(plantsPath, "utf8"));
      const savedPlants = saved.plants ?? saved;
      const savedHarvested = saved.harvestedCounts ?? {};
      harvestedCounts = new Map(Object.entries(savedHarvested));
      const savedCooked = saved.cookedFoodCounts ?? {};
      cookedFoodCounts = new Map(Object.entries(savedCooked));
      playerMoney = saved.playerMoney ?? 0;
      const seen = /* @__PURE__ */ new Map();
      for (const p of savedPlants) {
        const existing = seen.get(p.key);
        if (!existing || !p.harvested && existing.harvested) {
          seen.set(p.key, { key: p.key, species: p.species, size: p.size, harvested: p.harvested, hotkey_uses: p.hotkey_uses });
        }
      }
      plants = Array.from(seen.values());
    } catch (e) {
      console.error("Saved plants could not be loaded");
      console.error(e);
      plants = new Array();
    }
  } else {
    plants = new Array();
  }
}
function writePlantsToDisk() {
  if (!fs.existsSync(extensionStorageFolder)) {
    fs.mkdirSync(extensionStorageFolder, { recursive: true });
  }
  fs.writeFileSync(plantsPath, JSON.stringify({
    plants,
    harvestedCounts: Object.fromEntries(harvestedCounts),
    cookedFoodCounts: Object.fromEntries(cookedFoodCounts),
    playerMoney
  }));
}
function sendPlantsToWebview() {
  plants.forEach((p) => {
    greenhouse.postMessage({
      action: "load",
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
      action: "load_harvested",
      species,
      count
    });
  });
}
function loadCookedFoodsToInventory() {
  cookedFoodCounts.forEach((count, recipeKey) => {
    inventory.postMessage({
      action: "load_cooked",
      recipeKey,
      count
    });
  });
}
function requestWebviewSave() {
  greenhouse.postMessage({
    action: "save_plants"
  });
}
var plants = new Array();
var harvestedCounts = /* @__PURE__ */ new Map();
var cookedFoodCounts = /* @__PURE__ */ new Map();
var playerMoney = 0;
function getHotkeyCounts() {
  const counts = {};
  for (const plant of plants) {
    if (plant.key) {
      counts[plant.key] = (counts[plant.key] ?? 0) + plant.hotkey_uses;
    }
  }
  return counts;
}
function addPlant(plant) {
  greenhouse.postMessage({
    action: "add",
    species: plant.species,
    key: plant.key
  });
}
function growPlant(key) {
  if (CURRENT_MODE !== 0 /* GAME */) {
    logHotkeyUse(key, "None");
    return;
  }
  const keyEntry = KEY_MAP.find((k) => k.command === key);
  if (keyEntry && !keyEntry.active) {
    logHotkeyUse(key, "None");
    return;
  }
  const existingPlant = plants.find((p) => p.key === key);
  if (existingPlant && !existingPlant.harvested) {
    logHotkeyUse(key, existingPlant.species);
    greenhouse.postMessage({
      action: "grow",
      key: existingPlant.key
    });
    requestWebviewSave();
  } else {
    logHotkeyUse(key, "None");
    plants = plants.filter((p) => p.key !== key);
    greenhouse.postMessage({
      action: "choose_species",
      key,
      options: buildSpeciesOptions()
    });
  }
}
function toLabel(s) {
  return s.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}
function plantingCost(s) {
  const d = PLANTS[s];
  return !d || d.category === "vegetable" ? 0 : d.price;
}
function buildSpeciesOptions() {
  const toOption = (s, locked2) => {
    const data = PLANTS[s];
    const isFree = !data || data.category === "vegetable";
    return {
      species: s,
      label: toLabel(s),
      description: data?.description ?? "",
      price: data?.price ?? 0,
      isFree,
      locked: locked2
    };
  };
  const unlocked = ALL_SPECIES.filter((s) => {
    const data = PLANTS[s];
    return !data || data.category === "vegetable" || playerMoney >= data.price;
  }).sort((a, b) => plantingCost(a) - plantingCost(b));
  const locked = ALL_SPECIES.filter((s) => {
    const data = PLANTS[s];
    return data && data.category !== "vegetable" && playerMoney < data.price;
  }).sort((a, b) => PLANTS[a].price - PLANTS[b].price);
  return [
    ...unlocked.map((s) => toOption(s, false)),
    ...locked.map((s) => toOption(s, true))
  ];
}
function logViewEvent(view, event) {
  pluginDataLog.push({ view, event, timestamp: (/* @__PURE__ */ new Date()).toISOString() });
  fs.writeFileSync(pluginDataPath, JSON.stringify(pluginDataLog, null, 2));
}
function logHotkeyUse(key, species) {
  const keyEntry = KEY_MAP.find((k) => k.command === key);
  hotkeyLog.push({
    hotkey: keyEntry?.capital_key ?? key,
    species,
    timestamp: (/* @__PURE__ */ new Date()).toISOString(),
    file: vscode2.window.activeTextEditor?.document.fileName ?? ""
  });
  fs.writeFileSync(hotkeysPath, JSON.stringify(hotkeyLog, null, 2));
}
function activate(context) {
  extensionStorageFolder = context.globalStorageUri.path.substring(1);
  plantsPath = path.join(extensionStorageFolder, "plants.json");
  hotkeysPath = path.join(extensionStorageFolder, "hotkeys.json");
  if (fs.existsSync(hotkeysPath)) {
    try {
      hotkeyLog = JSON.parse(fs.readFileSync(hotkeysPath, "utf8"));
    } catch {
      hotkeyLog = [];
    }
  }
  pluginDataPath = path.join(extensionStorageFolder, "plugin_data.json");
  if (fs.existsSync(pluginDataPath)) {
    try {
      pluginDataLog = JSON.parse(fs.readFileSync(pluginDataPath, "utf8"));
    } catch {
      pluginDataLog = [];
    }
  }
  logViewEvent("vscode", "opened");
  readPlantsFromDisk();
  instructions = new InstructionsWebViewProvider(context, getHotkeyCounts, (event) => logViewEvent("instructions", event));
  context.subscriptions.push(vscode2.window.registerWebviewViewProvider(InstructionsWebViewProvider.viewType, instructions));
  if (CURRENT_MODE === 0 /* GAME */) {
    greenhouse = new GreenhouseWebViewProvider(context);
    context.subscriptions.push(vscode2.window.registerWebviewViewProvider(GreenhouseWebViewProvider.viewType, greenhouse, { webviewOptions: { retainContextWhenHidden: true } }));
    inventory = new InventoryWebViewProvider(context);
    context.subscriptions.push(vscode2.window.registerWebviewViewProvider(InventoryWebViewProvider.viewType, inventory, { webviewOptions: { retainContextWhenHidden: true } }));
  }
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
    growPlant("command_palette");
  });
  const growDeleteCurrentLine = vscode2.commands.registerCommand("keycrop.growDeleteCurrentLine", () => {
    growPlant("delete_current_line");
  });
  const growJumpToBracket = vscode2.commands.registerCommand("keycrop.growJumpToBracket", () => {
    growPlant("jump_to_bracket");
  });
  const growShowAllSymbols = vscode2.commands.registerCommand("keycrop.growShowAllSymbols", () => {
    growPlant("show_all_symbols");
  });
  const growGoToSymbol = vscode2.commands.registerCommand("keycrop.growGoToSymbol", () => {
    growPlant("go_to_symbol");
  });
  const growViewProblems = vscode2.commands.registerCommand("keycrop.growViewProblems", () => {
    growPlant("view_problems");
  });
  const growSelectAllOccurrences = vscode2.commands.registerCommand("keycrop.growCursorAtAllOccurrences", () => {
    growPlant("cursor_at_all_occurrences");
  });
  const growTriggerParameterHints = vscode2.commands.registerCommand("keycrop.growTriggerParameterHints", () => {
    growPlant("trigger_parameter_hints");
  });
  const growSplitEditor = vscode2.commands.registerCommand("keycrop.growSplitEditor", () => {
    growPlant("split_editor");
  });
  const growOpenLastUsedEditorInGroup = vscode2.commands.registerCommand("keycrop.growOpenLastUsedEditorInGroup", () => {
    growPlant("open_last_used_editor_in_group");
  });
  const growToggleTerminal = vscode2.commands.registerCommand("keycrop.growToggleTerminal", () => {
    growPlant("toggle_terminal");
  });
  const growCreateNewTerminal = vscode2.commands.registerCommand("keycrop.growCreateNewTerminal", () => {
    growPlant("create_new_terminal");
  });
  const growGoToLine = vscode2.commands.registerCommand("keycrop.growGoToLine", () => {
    growPlant("go_to_line");
  });
  const growQuickFix = vscode2.commands.registerCommand("keycrop.growQuickFix", () => {
    growPlant("quick_fix");
  });
  const growSaveFileAs = vscode2.commands.registerCommand("keycrop.growSaveFileAs", () => {
    growPlant("save_file_as");
  });
  const growMoveLineUp = vscode2.commands.registerCommand("keycrop.growMoveLineUp", () => {
    growPlant("move_line_up");
  });
  const growMoveLineDown = vscode2.commands.registerCommand("keycrop.growMoveLineDown", () => {
    growPlant("move_line_down");
  });
  const growSelectLine = vscode2.commands.registerCommand("keycrop.growSelectLine", () => {
    growPlant("select_line");
  });
  const growInsertCursorAtEndOfEachLineSelected = vscode2.commands.registerCommand("keycrop.growInsertCursorAtEndOfEachLineSelected", () => {
    growPlant("insert_cursor_at_end_of_each_line_selected");
  });
  const growAddCursorAbove = vscode2.commands.registerCommand("keycrop.growInsertCursorAbove", () => {
    growPlant("add_cursor_above");
  });
  const growAddCursorBelow = vscode2.commands.registerCommand("keycrop.growInsertCursorBelow", () => {
    growPlant("add_cursor_below");
  });
  const growTriggerSuggest = vscode2.commands.registerCommand("keycrop.growTriggerSuggest", () => {
    growPlant("trigger_suggest");
  });
  const growShowHover = vscode2.commands.registerCommand("keycrop.growShowHover", () => {
    growPlant("show_hover");
  });
  const growOpenMarkdownSide = vscode2.commands.registerCommand("keycrop.growOpenMarkdownSide", () => {
    growPlant("open_markdown_side");
  });
  const growOpenMarkdownPreview = vscode2.commands.registerCommand("keycrop.growOpenMarkdownPreview", () => {
    growPlant("open_markdown_preview");
  });
  const growReplace = vscode2.commands.registerCommand("keycrop.growReplace", () => {
    growPlant("replace");
  });
  const growCopyLineBelow = vscode2.commands.registerCommand("keycrop.growCopyLineBelow", () => {
    growPlant("copy_line_below");
  });
  const growCopyLineAbove = vscode2.commands.registerCommand("keycrop.growCopyLineAbove", () => {
    growPlant("copy_line_above");
  });
  const growFind = vscode2.commands.registerCommand("keycrop.growFind", () => {
    growPlant("find");
  });
  const growExpandSelection = vscode2.commands.registerCommand("keycrop.growExpandSelection", () => {
    growPlant("expand_selection");
  });
  const growReduceSelection = vscode2.commands.registerCommand("keycrop.growReduceSelection", () => {
    growPlant("reduce_selection");
  });
  const growToggleBlockComment = vscode2.commands.registerCommand("keycrop.growToggleBlockComment", () => {
    growPlant("toggle_block_comment");
  });
  const growCopy = vscode2.commands.registerCommand("keycrop.growCopy", () => {
    growPlant("copy");
  });
  const growPaste = vscode2.commands.registerCommand("keycrop.growPaste", () => {
    growPlant("paste");
  });
  context.subscriptions.push(growCommandPalette, growJumpToBracket, growShowAllSymbols, growGoToSymbol, growViewProblems, growSelectAllOccurrences, growTriggerParameterHints, growSplitEditor, growOpenLastUsedEditorInGroup, growToggleTerminal, growCreateNewTerminal, growDeleteCurrentLine, growGoToLine, growQuickFix, growSaveFileAs, growMoveLineUp, growMoveLineDown, growSelectLine, growInsertCursorAtEndOfEachLineSelected, growAddCursorAbove, growAddCursorBelow, growTriggerSuggest, growShowHover, growOpenMarkdownSide, growOpenMarkdownPreview, growReplace, growCopyLineBelow, growCopyLineAbove, growFind, growExpandSelection, growReduceSelection, growToggleBlockComment, growCopy, growPaste);
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
  resolveWebviewView(webviewView, _context, _token) {
    this.view = webviewView;
    logViewEvent("greenhouse", "opened");
    webviewView.onDidChangeVisibility(() => logViewEvent("greenhouse", webviewView.visible ? "opened" : "closed"));
    webviewView.onDidDispose(() => logViewEvent("greenhouse", "closed"));
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
            readPlantsFromDisk();
            webview.postMessage({
              action: "background",
              value: "dirt"
            });
            sendPlantsToWebview();
          } else {
            webview.postMessage({
              action: "key-tracking-mode"
            });
          }
          break;
        case "save_plants": {
          for (const saved of message.content) {
            const existing = plants.find((p) => p.key === saved.key);
            if (existing) {
              existing.size = saved.size;
              existing.hotkey_uses = saved.hotkey_uses;
            }
          }
          writePlantsToDisk();
          instructions.postMessage({ action: "update_counts", counts: getHotkeyCounts() });
          break;
        }
        case "harvested": {
          const harvestedPlant = plants.find((p) => p.key === message.key && !p.harvested);
          if (harvestedPlant) {
            const alreadyInInventory = harvestedCounts.has(harvestedPlant.species);
            harvestedPlant.harvested = true;
            const sizeBefore = harvestedCounts.size;
            const newCount = (harvestedCounts.get(harvestedPlant.species) ?? 0) + 1;
            harvestedCounts.set(harvestedPlant.species, newCount);
            inventory.postMessage({
              action: "load_harvested",
              species: harvestedPlant.species,
              count: 1
            });
            if (alreadyInInventory) {
              vscode2.window.showInformationMessage("Your " + message.text.replace(/_/g, " ") + " plant has been harvested!");
            }
            if (sizeBefore < ALL_SPECIES.length && harvestedCounts.size === ALL_SPECIES.length) {
              vscode2.window.showInformationMessage("Achievement unlocked: you've grown one of every plant!");
              inventory.postMessage({ action: "achievement" });
            }
          }
          break;
        }
        case "select_species": {
          const species = message.species;
          const key = message.key;
          const plantData = PLANTS[species];
          if (plantData && plantData.category !== "vegetable") {
            playerMoney -= plantData.price;
            inventory.postMessage({ action: "load_money", amount: playerMoney });
          }
          vscode2.window.showInformationMessage(`A new ${species.replace(/_/g, " ")} plant has sprouted in the greenhouse!`);
          plants.push({ key, species, size: "start", harvested: false, hotkey_uses: 1 });
          addPlant({ key, species, size: "start", harvested: false, hotkey_uses: 1 });
          writePlantsToDisk();
          requestWebviewSave();
          break;
        }
        case "locked_species_click": {
          const species = message.species;
          const data = PLANTS[species];
          if (data) {
            vscode2.window.showInformationMessage(`You need $${data.price} to unlock ${toLabel(species)}.`);
          }
          break;
        }
      }
    });
  }
  getHtmlContent(webview) {
    const style = webview.asWebviewUri(vscode2.Uri.joinPath(this.context.extensionUri, "dist/media", "style.css"));
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
          ${CURRENT_MODE === 0 /* GAME */ ? '<div id="fence-strip"></div>' : ""}
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
  postMessage(message) {
    this.view?.webview.postMessage(message);
  }
  resolveWebviewView(webviewView, _context, _token) {
    this.view = webviewView;
    logViewEvent("inventory", "opened");
    webviewView.onDidChangeVisibility(() => logViewEvent("inventory", webviewView.visible ? "opened" : "closed"));
    webviewView.onDidDispose(() => logViewEvent("inventory", "closed"));
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
              value: "inventory"
            });
            loadPlantsToInventory();
            loadCookedFoodsToInventory();
            webview.postMessage({ action: "load_money", amount: playerMoney });
          } else {
            webview.postMessage({
              action: "key-tracking-mode"
            });
          }
          break;
        case "sell": {
          playerMoney += message.amount ?? 0;
          if (message.species) {
            const count = harvestedCounts.get(message.species) ?? 0;
            if (count <= 1) {
              harvestedCounts.delete(message.species);
            } else {
              harvestedCounts.set(message.species, count - 1);
            }
          } else if (message.recipeKey) {
            const count = cookedFoodCounts.get(message.recipeKey) ?? 0;
            if (count <= 1) {
              cookedFoodCounts.delete(message.recipeKey);
            } else {
              cookedFoodCounts.set(message.recipeKey, count - 1);
            }
          }
          writePlantsToDisk();
          break;
        }
        case "cooked": {
          const current = cookedFoodCounts.get(message.recipeKey) ?? 0;
          cookedFoodCounts.set(message.recipeKey, current + 1);
          for (const species of message.species) {
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
  getHtmlContent(webview) {
    const style = webview.asWebviewUri(vscode2.Uri.joinPath(this.context.extensionUri, "dist/media", "style.css"));
    const webviewJS = webview.asWebviewUri(vscode2.Uri.joinPath(this.context.extensionUri, "dist/media", "webview.js"));
    const openPot = webview.asWebviewUri(vscode2.Uri.joinPath(this.context.extensionUri, "dist/media/pot", "closed.png"));
    const closedPot = webview.asWebviewUri(vscode2.Uri.joinPath(this.context.extensionUri, "dist/media/pot", "open.png"));
    const foodBase = webview.asWebviewUri(vscode2.Uri.joinPath(this.context.extensionUri, "dist/media/recipes/food"));
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
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  GreenhouseWebViewProvider,
  InventoryWebViewProvider,
  activate,
  deactivate
});
//# sourceMappingURL=extension.js.map
