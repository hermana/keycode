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
var fs4 = __toESM(require("fs"));
var path2 = __toESM(require("path"));

// src/instructionsWebViewProvider.ts
var vscode = __toESM(require("vscode"));

// src/keyMap.ts
var KEY_MAP = [
  { key: "ctrl+shift+p", category: "Using VSCode", capital_key: "CTRL+SHIFT+P", command: "command_palette", commandId: "keycrop.growCommandPalette", description: "Show command palette", active: false },
  { key: "ctrl+shift+k", category: "Editing", capital_key: "CTRL+SHIFT+K", command: "delete_current_line", commandId: "keycrop.growDeleteCurrentLine", description: "Delete current line", active: false },
  { key: "ctrl+shift+\\", category: "Navigating Code", capital_key: "CTRL+SHIFT+\\", command: "jump_to_bracket", commandId: "keycrop.growJumpToBracket", description: "Jump to bracket", active: false },
  { key: "ctrl+t", category: "Navigating Code", capital_key: "CTRL+T", command: "show_all_symbols", commandId: "keycrop.growShowAllSymbols", description: "Show all symbols", active: false },
  { key: "ctrl+shift+o", category: "Navigating Code", capital_key: "CTRL+SHIFT+O", command: "go_to_symbol", commandId: "keycrop.growGoToSymbol", description: "Go to symbol", active: false },
  { key: "ctrl+shift+m", category: "Debugging", capital_key: "CTRL+SHIFT+M", command: "view_problems", commandId: "keycrop.growViewProblems", description: "View problems", active: false },
  { key: "ctrl+shift+l", category: "Multicursor", capital_key: "CTRL+SHIFT+L", command: "cursor_at_all_occurrences", commandId: "keycrop.growCursorAtAllOccurrences", description: "Add a cursor at all occurrences", active: false },
  { key: "ctrl+shift+space", category: "IntelliSense", capital_key: "CTRL+SHIFT+SPACE", command: "trigger_parameter_hints", commandId: "keycrop.growTriggerParameterHints", description: "Trigger parameter hints", active: false },
  { key: "ctrl+\\", category: "Using VSCode", capital_key: "CTRL+\\", command: "split_editor", commandId: "keycrop.growSplitEditor", description: "Split editor", active: false },
  { key: "ctrl+shift+tab", category: "Using VSCode", capital_key: "CTRL+SHIFT+TAB", command: "open_last_used_editor_in_group", commandId: "keycrop.growOpenLastUsedEditorInGroup", description: "Open last used editor in group", active: false },
  { key: "ctrl+`", category: "Terminal", capital_key: "CTRL+`", command: "toggle_terminal", commandId: "keycrop.growToggleTerminal", description: "Toggle terminal", active: false },
  { key: "ctrl+shift+`", category: "Terminal", capital_key: "CTRL+SHIFT+`", command: "create_new_terminal", commandId: "keycrop.growCreateNewTerminal", description: "Create new terminal", active: false },
  { key: "ctrl+g", category: "Navigating Code", capital_key: "CTRL+G", command: "go_to_line", commandId: "keycrop.growGoToLine", description: "Go to line", active: false },
  // this is where I started adding new stuff
  { key: "ctrl+.", category: "Navigating Code", capital_key: "CTRL+.", command: "quick_fix", commandId: "keycrop.growQuickFix", description: "Quick Fix", active: false },
  { key: "ctrl+shift+s", category: "Using VSCode", capital_key: "CTRL+SHIFT+S", command: "save_file_as", commandId: "keycrop.growSaveFileAs", description: "Save File As", active: false },
  { key: "alt+up", category: "Editing", capital_key: "ALT+UP", command: "move_line_up", commandId: "keycrop.growMoveLineUp", description: "Move line up", active: false },
  { key: "alt+down", category: "Editing", capital_key: "ALT+DOWN", command: "move_line_down", commandId: "keycrop.growMoveLineDown", description: "Move line down", active: false },
  { key: "ctrl+l", category: "Editing", capital_key: "CTRL+L", command: "select_line", commandId: "keycrop.growSelectLine", description: "Select line", active: false },
  { key: "shift+alt+i", category: "Multicursor", capital_key: "SHIFT+ALT+I", command: "insert_cursor_at_end_of_each_line_selected", commandId: "keycrop.growInsertCursorAtEndOfEachLineSelected", description: "Insert cursor at end of each line selected", active: false },
  { key: "ctrl+shift+up", category: "Multicursor", capital_key: "CTRL+SHIFT+UP", command: "add_cursor_above", commandId: "keycrop.growInsertCursorAbove", description: "Add cursor above", active: true },
  { key: "ctrl+shift+down", category: "Multicursor", capital_key: "CTRL+SHIFT+DOWN", command: "add_cursor_below", commandId: "keycrop.growInsertCursorBelow", description: "Add cursor below", active: true },
  { key: "ctrl+space", category: "IntelliSense", capital_key: "CTRL+SPACE", command: "trigger_suggest", commandId: "keycrop.growTriggerSuggestions", description: "Trigger suggestions", active: false },
  { key: "ctrl+k ctrl+i", category: "IntelliSense", capital_key: "CTRL+K CTRL+I", command: "show_hover", commandId: "keycrop.growShowHover", description: "Show hover with function details", active: false },
  { key: "ctrl+k v", category: "Markdown", capital_key: "CTRL+K V", command: "open_markdown_side", commandId: "keycrop.growOpenMarkdownSide", description: "Open markdown to the side", active: true },
  { key: "ctrl+shift+v", category: "Markdown", capital_key: "CTRL+SHIFT+V", command: "open_markdown_preview", commandId: "keycrop.growOpenMarkdownPreview", description: "Open markdown preview", active: true },
  { key: "ctrl+h", category: "Search", capital_key: "CTRL+H", command: "replace", commandId: "keycrop.growReplace", description: "Replace", active: true },
  { key: "shift+alt+down", category: "Editing", capital_key: "SHIFT+ALT+DOWN", command: "copy_line_below", commandId: "keycrop.growCopyLineBelow", description: "Copy line below", active: true },
  { key: "shift+alt+up", category: "Editing", capital_key: "SHIFT+ALT+UP", command: "copy_line_above", commandId: "keycrop.growCopyLineAbove", description: "Copy line above", active: true },
  { key: "ctrl+f", category: "Search", capital_key: "CTRL+F", command: "find", commandId: "keycrop.growFind", description: "Find", active: true },
  { key: "shift+alt+right", category: "Editing", capital_key: "SHIFT+ALT+RIGHT", command: "expand_selection", commandId: "keycrop.growExpandSelection", description: "Expand selection", active: true },
  { key: "shift+alt+left", category: "Editing", capital_key: "SHIFT+ALT+LEFT", command: "reduce_selection", commandId: "keycrop.growReduceSelection", description: "Reduce selection", active: true },
  { key: "ctrl+shift+a", category: "Editing", capital_key: "CTRL+SHIFT+A", command: "toggle_block_comment", commandId: "keycrop.growToggleBlockComment", description: "Toggle block comment", active: true },
  { key: "ctrl+c", category: "Editing", capital_key: "CTRL+C", command: "copy", commandId: "keycrop.growCopy", description: "Copy", active: false },
  { key: "ctrl+v", category: "Editing", capital_key: "CTRL+V", command: "paste", commandId: "keycrop.growPaste", description: "Paste", active: false }
];
var HOTKEY_LEVELS = [
  { name: "Novice", minUses: 1, className: "level-novice" },
  // lead
  { name: "Apprentice", minUses: 15, className: "level-apprentice" },
  // bronze
  { name: "Journeyman", minUses: 30, className: "level-journeyman" },
  // silver
  { name: "Expert", minUses: 60, className: "level-expert" },
  // gold
  { name: "Grandmaster", minUses: 120, className: "level-grandmaster" }
  // diamond
];

// src/baseWebViewProvider.ts
var BaseWebViewProvider = class {
  constructor(context, onViewEvent) {
    this.context = context;
    this.onViewEvent = onViewEvent;
  }
  view;
  postMessage(message) {
    this.view?.webview.postMessage(message);
  }
  resolveWebviewView(webviewView, _context, _token) {
    this.view = webviewView;
    this.onViewEvent?.("opened");
    webviewView.onDidChangeVisibility(() => this.onViewEvent?.(webviewView.visible ? "opened" : "closed"));
    webviewView.onDidDispose(() => this.onViewEvent?.("closed"));
    const webview = webviewView.webview;
    webview.options = { enableScripts: true };
    webview.html = this.getHtmlContent(webview);
    webview.onDidReceiveMessage((message) => this.onMessage(message));
  }
};

// src/instructionsWebViewProvider.ts
var InstructionsWebViewProvider = class extends BaseWebViewProvider {
  constructor(context, getHotkeyCounts, onViewEvent) {
    super(context, onViewEvent);
    this.getHotkeyCounts = getHotkeyCounts;
  }
  static viewType = "instructions";
  onMessage(message) {
    if (message.type === "init") {
      this.postMessage({ action: "update_counts", counts: this.getHotkeyCounts() });
    }
  }
  getHtmlContent(webview) {
    const style = webview.asWebviewUri(vscode.Uri.joinPath(this.context.extensionUri, "dist/media", "style.css"));
    const activeKeys = KEY_MAP.filter((k) => k.active);
    const categories = [...new Set(activeKeys.map((k) => k.category))];
    const categoryButtons = categories.map(
      (cat) => `<button class="category-btn" data-category="${cat}">${cat}</button>`
    ).join("\n        ");
    const tableRows = activeKeys.map(
      (k) => `<tr data-category="${k.category}" data-command="${k.command}"><td>${k.capital_key}</td><td>${k.description}</td><td class="use-count">0</td><td class="level-cell"></td></tr>`
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
                  <th>Level</th>
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
          const LEVELS = ${JSON.stringify(HOTKEY_LEVELS)};

          function levelFor(count) {
            let level = null;
            for (const l of LEVELS) {
              if (count >= l.minUses) { level = l; }
            }
            return level;
          }
          vscode.postMessage({ type: 'init' });

          window.addEventListener('message', (event) => {
            const message = event.data;
            if (message.action === 'update_counts') {
              Object.entries(message.counts).forEach(([cmd, count]) => {
                const row = document.querySelector('tr[data-command="' + cmd + '"]');
                if (!row) { return; }
                row.querySelector('.use-count').textContent = String(count);
                const level = levelFor(count);
                const cell = row.querySelector('.level-cell');
                cell.innerHTML = '';
                if (level) {
                  const badge = document.createElement('span');
                  badge.className = 'level-badge ' + level.className;
                  badge.textContent = level.name;
                  cell.appendChild(badge);
                }
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
function toLabel(species) {
  return species.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}
function isFreePlant(species) {
  const data = PLANTS[species];
  return !data || data.category === "vegetable";
}
function plantingCost(species) {
  return isFreePlant(species) ? 0 : PLANTS[species].price;
}

// src/gameState.ts
var fs = __toESM(require("fs"));
var path = __toESM(require("path"));
var GameState = class _GameState {
  constructor(filePath) {
    this.filePath = filePath;
  }
  plants = [];
  harvestedCounts = /* @__PURE__ */ new Map();
  cookedFoodCounts = /* @__PURE__ */ new Map();
  discoveredRecipes = /* @__PURE__ */ new Set();
  money = 0;
  get playerMoney() {
    return this.money;
  }
  get allPlants() {
    return this.plants;
  }
  get harvested() {
    return this.harvestedCounts;
  }
  get cooked() {
    return this.cookedFoodCounts;
  }
  get discovered() {
    return this.discoveredRecipes;
  }
  load() {
    this.plants = [];
    if (!fs.existsSync(this.filePath)) {
      return;
    }
    try {
      const saved = JSON.parse(fs.readFileSync(this.filePath, "utf8"));
      const savedPlants = saved.plants ?? saved;
      this.harvestedCounts = new Map(Object.entries(saved.harvestedCounts ?? {}));
      this.cookedFoodCounts = new Map(Object.entries(saved.cookedFoodCounts ?? {}));
      this.money = saved.playerMoney ?? 0;
      this.discoveredRecipes = /* @__PURE__ */ new Set([...saved.discoveredRecipes ?? [], ...this.cookedFoodCounts.keys()]);
      const seen = /* @__PURE__ */ new Map();
      for (const p of savedPlants) {
        const existing = seen.get(p.key);
        if (!existing || !p.harvested && existing.harvested) {
          seen.set(p.key, { key: p.key, species: p.species, size: p.size, harvested: p.harvested, hotkey_uses: p.hotkey_uses });
        }
      }
      this.plants = Array.from(seen.values());
    } catch (e) {
      console.error("Saved plants could not be loaded");
      console.error(e);
      this.plants = [];
    }
  }
  save() {
    fs.mkdirSync(path.dirname(this.filePath), { recursive: true });
    fs.writeFileSync(this.filePath, JSON.stringify({
      plants: this.plants,
      harvestedCounts: Object.fromEntries(this.harvestedCounts),
      cookedFoodCounts: Object.fromEntries(this.cookedFoodCounts),
      discoveredRecipes: [...this.discoveredRecipes],
      playerMoney: this.money
    }));
  }
  /** The growing (not yet harvested) plant on this hotkey, if any. */
  growingPlant(key) {
    return this.plants.find((p) => p.key === key && !p.harvested);
  }
  /** Frees a hotkey so a new species can be planted on it. */
  clearKey(key) {
    this.plants = this.plants.filter((p) => p.key !== key);
  }
  /** Plants a new species on a hotkey, paying for it unless it's a free vegetable. */
  plant(key, species) {
    this.money -= plantingCost(species);
    const plant = { key, species, size: "start", harvested: false, hotkey_uses: 1 };
    this.plants.push(plant);
    return plant;
  }
  /**
   * Copies growth progress reported by the greenhouse webview. Never adds or removes
   * plants: the extension decides which keys are assigned, and the webview can lag
   * behind after a reload.
   */
  updateGrowth(snapshots) {
    for (const snapshot of snapshots) {
      const existing = this.plants.find((p) => p.key === snapshot.key);
      if (existing) {
        existing.size = snapshot.size;
        existing.hotkey_uses = snapshot.hotkey_uses;
      }
    }
  }
  /** Moves a fully grown plant into the inventory. Undefined if nothing is growing on that key. */
  harvest(key) {
    const plant = this.growingPlant(key);
    if (!plant) {
      return void 0;
    }
    const alreadyOwned = this.harvestedCounts.has(plant.species);
    const speciesBefore = this.harvestedCounts.size;
    plant.harvested = true;
    this.harvestedCounts.set(plant.species, (this.harvestedCounts.get(plant.species) ?? 0) + 1);
    const completedAllSpecies = speciesBefore < ALL_SPECIES.length && this.harvestedCounts.size === ALL_SPECIES.length;
    return { species: plant.species, alreadyOwned, completedAllSpecies };
  }
  sell(amount, species, recipeKey) {
    this.money += amount;
    if (species) {
      _GameState.decrement(this.harvestedCounts, species);
    } else if (recipeKey) {
      _GameState.decrement(this.cookedFoodCounts, recipeKey);
    }
  }
  /** Uses up the ingredients and adds the dish. Returns true the first time this recipe is made. */
  cook(recipeKey, ingredients) {
    this.cookedFoodCounts.set(recipeKey, (this.cookedFoodCounts.get(recipeKey) ?? 0) + 1);
    for (const species of ingredients) {
      _GameState.decrement(this.harvestedCounts, species);
    }
    const newlyDiscovered = !this.discoveredRecipes.has(recipeKey);
    this.discoveredRecipes.add(recipeKey);
    return newlyDiscovered;
  }
  static decrement(counts, key) {
    const count = counts.get(key) ?? 0;
    if (count <= 1) {
      counts.delete(key);
    } else {
      counts.set(key, count - 1);
    }
  }
};

// src/hotkeyTracker.ts
var fs2 = __toESM(require("fs"));
var HotkeyTracker = class _HotkeyTracker {
  constructor(filePath) {
    this.filePath = filePath;
    if (fs2.existsSync(filePath)) {
      try {
        this.log = JSON.parse(fs2.readFileSync(filePath, "utf8"));
      } catch {
        this.log = [];
      }
    }
    this.useCounts = _HotkeyTracker.countUses(this.log);
  }
  log = [];
  useCounts = {};
  /** Lifetime uses keyed by KEY_MAP command. */
  get counts() {
    return this.useCounts;
  }
  record(command, species, file) {
    const keyEntry = KEY_MAP.find((k) => k.command === command);
    this.log.push({
      hotkey: keyEntry?.capital_key ?? command,
      species,
      timestamp: (/* @__PURE__ */ new Date()).toISOString(),
      file
    });
    fs2.writeFileSync(this.filePath, JSON.stringify(this.log, null, 2));
    this.useCounts[command] = (this.useCounts[command] ?? 0) + 1;
  }
  static countUses(log) {
    const commandByHotkey = new Map(KEY_MAP.map((k) => [k.capital_key, k.command]));
    const counts = {};
    for (const entry of log) {
      const command = commandByHotkey.get(entry.hotkey) ?? entry.hotkey;
      counts[command] = (counts[command] ?? 0) + 1;
    }
    return counts;
  }
};

// src/activityLog.ts
var fs3 = __toESM(require("fs"));
var ActivityLog = class {
  constructor(filePath) {
    this.filePath = filePath;
    if (fs3.existsSync(filePath)) {
      try {
        this.entries = JSON.parse(fs3.readFileSync(filePath, "utf8"));
      } catch {
        this.entries = [];
      }
    }
  }
  entries = [];
  record(view, event) {
    this.entries.push({ view, event, timestamp: (/* @__PURE__ */ new Date()).toISOString() });
    fs3.writeFileSync(this.filePath, JSON.stringify(this.entries, null, 2));
  }
};

// src/extension.ts
var CURRENT_MODE = 0 /* GAME */;
var game;
var hotkeys;
var activity;
var greenhouse;
var instructions;
var inventory;
var config = vscode2.workspace.getConfiguration("keycrop");
function requestWebviewSave() {
  greenhouse.postMessage({
    action: "save_plants"
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
  const existingPlant = game.growingPlant(key);
  if (existingPlant) {
    logHotkeyUse(key, existingPlant.species);
    greenhouse.postMessage({
      action: "grow",
      key: existingPlant.key
    });
    requestWebviewSave();
  } else {
    logHotkeyUse(key, "None");
    game.clearKey(key);
    greenhouse.postMessage({
      action: "choose_species",
      key,
      options: buildSpeciesOptions(game.playerMoney)
    });
  }
}
function buildSpeciesOptions(playerMoney) {
  const toOption = (s, locked2) => ({
    species: s,
    label: toLabel(s),
    description: PLANTS[s]?.description ?? "",
    price: PLANTS[s]?.price ?? 0,
    isFree: isFreePlant(s),
    locked: locked2
  });
  const isUnlocked = (s) => isFreePlant(s) || playerMoney >= plantingCost(s);
  const byCost = (a, b) => plantingCost(a) - plantingCost(b);
  const unlocked = ALL_SPECIES.filter(isUnlocked).sort(byCost);
  const locked = ALL_SPECIES.filter((s) => !isUnlocked(s)).sort(byCost);
  return [
    ...unlocked.map((s) => toOption(s, false)),
    ...locked.map((s) => toOption(s, true))
  ];
}
function logHotkeyUse(key, species) {
  hotkeys.record(key, species, vscode2.window.activeTextEditor?.document.fileName ?? "");
  instructions.postMessage({ action: "update_counts", counts: { ...hotkeys.counts } });
}
function activate(context) {
  const storageFolder = context.globalStorageUri.fsPath;
  fs4.mkdirSync(storageFolder, { recursive: true });
  hotkeys = new HotkeyTracker(path2.join(storageFolder, "hotkeys.json"));
  activity = new ActivityLog(path2.join(storageFolder, "plugin_data.json"));
  activity.record("vscode", "opened");
  game = new GameState(path2.join(storageFolder, "plants.json"));
  game.load();
  instructions = new InstructionsWebViewProvider(context, () => ({ ...hotkeys.counts }), (event) => activity.record("instructions", event));
  context.subscriptions.push(vscode2.window.registerWebviewViewProvider(InstructionsWebViewProvider.viewType, instructions));
  if (CURRENT_MODE === 0 /* GAME */) {
    greenhouse = new GreenhouseWebViewProvider(context, game);
    context.subscriptions.push(vscode2.window.registerWebviewViewProvider(GreenhouseWebViewProvider.viewType, greenhouse, { webviewOptions: { retainContextWhenHidden: true } }));
    inventory = new InventoryWebViewProvider(context, game);
    context.subscriptions.push(vscode2.window.registerWebviewViewProvider(InventoryWebViewProvider.viewType, inventory, { webviewOptions: { retainContextWhenHidden: true } }));
  }
  vscode2.workspace.onDidChangeConfiguration(() => {
    config = vscode2.workspace.getConfiguration("keycrop");
  });
  for (const { command, commandId } of KEY_MAP) {
    context.subscriptions.push(vscode2.commands.registerCommand(commandId, () => growPlant(command)));
  }
}
function deactivate() {
}
var GreenhouseWebViewProvider = class extends BaseWebViewProvider {
  constructor(context, game2) {
    super(context, (event) => activity.record("greenhouse", event));
    this.game = game2;
  }
  static viewType = "greenhouse";
  onMessage(message) {
    switch (message.type) {
      case "init":
        if (CURRENT_MODE === 0 /* GAME */) {
          this.game.load();
          this.postMessage({
            action: "background",
            value: "dirt"
          });
          for (const p of this.game.allPlants) {
            this.postMessage({
              action: "load",
              key: p.key,
              species: p.species,
              size: p.size,
              harvested: p.harvested,
              hotkey_uses: p.hotkey_uses
            });
          }
        } else {
          this.postMessage({
            action: "key-tracking-mode"
          });
        }
        break;
      case "save_plants": {
        this.game.updateGrowth(message.content);
        this.game.save();
        break;
      }
      case "harvested": {
        const harvest = this.game.harvest(message.key);
        if (harvest) {
          inventory.postMessage({
            action: "load_harvested",
            species: harvest.species,
            count: 1
          });
          if (harvest.alreadyOwned) {
            vscode2.window.showInformationMessage("Your " + message.text.replace(/_/g, " ") + " plant has been harvested!");
          }
          if (harvest.completedAllSpecies) {
            vscode2.window.showInformationMessage("Achievement unlocked: you've grown one of every plant!");
            inventory.postMessage({ action: "achievement" });
          }
        }
        break;
      }
      case "select_species": {
        const { key, species } = message;
        const moneyBefore = this.game.playerMoney;
        this.game.plant(key, species);
        if (this.game.playerMoney !== moneyBefore) {
          inventory.postMessage({ action: "load_money", amount: this.game.playerMoney });
        }
        vscode2.window.showInformationMessage(`A new ${species.replace(/_/g, " ")} plant has sprouted in the greenhouse!`);
        this.postMessage({ action: "add", species, key });
        this.game.save();
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
          ${CURRENT_MODE === 0 /* GAME */ ? '<div id="fence-strip"></div><div id="decoration-strip"></div>' : ""}
          <script src="${webviewJS}"></script>
        </body>
        </html>
      `;
  }
};
var InventoryWebViewProvider = class extends BaseWebViewProvider {
  constructor(context, game2) {
    super(context, (event) => activity.record("inventory", event));
    this.game = game2;
  }
  static viewType = "inventory";
  onMessage(message) {
    switch (message.type) {
      case "init":
        if (CURRENT_MODE === 0 /* GAME */) {
          this.postMessage({
            action: "background",
            value: "inventory"
          });
          this.game.harvested.forEach((count, species) => {
            this.postMessage({ action: "load_harvested", species, count });
          });
          this.game.cooked.forEach((count, recipeKey) => {
            this.postMessage({ action: "load_cooked", recipeKey, count });
          });
          this.postMessage({ action: "load_collection", recipeKeys: [...this.game.discovered] });
          this.postMessage({ action: "load_money", amount: this.game.playerMoney });
        } else {
          this.postMessage({
            action: "key-tracking-mode"
          });
        }
        break;
      case "sell": {
        this.game.sell(message.amount ?? 0, message.species, message.recipeKey);
        this.game.save();
        break;
      }
      case "cooked": {
        if (this.game.cook(message.recipeKey, message.species)) {
          this.postMessage({ action: "load_collection", recipeKeys: [message.recipeKey] });
        }
        this.game.save();
        break;
      }
    }
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
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  GreenhouseWebViewProvider,
  InventoryWebViewProvider,
  activate,
  deactivate
});
//# sourceMappingURL=extension.js.map
