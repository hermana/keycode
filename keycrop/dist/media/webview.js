"use strict";
(() => {
  // src/keyMap.ts
  var KEY_MAP = [
    { key: "ctrl+shift+p", category: "Using VSCode", capital_key: "CTRL+SHIFT+P", command: "command_palette", description: "Show command palette" },
    { key: "ctrl+shift+k", category: "Editing", capital_key: "CTRL+SHIFT+K", command: "delete_current_line", description: "Delete current line" },
    { key: "ctrl+shift+\\", category: "Navigating Code", capital_key: "CTRL+SHIFT+\\", command: "jump_to_bracket", description: "Jump to bracket" },
    { key: "ctrl+t", category: "Navigating Code", capital_key: "CTRL+T", command: "show_all_symbols", description: "Show all symbols" },
    { key: "ctrl+shift+o", category: "Navigating Code", capital_key: "CTRL+SHIFT+O", command: "go_to_symbol", description: "Go to symbol" },
    // { key: 'ctrl+shift+m', category: 'Debugging', capital_key: "CTRL+SHIFT+M", command: 'view_problems', description: "View problems" },
    { key: "ctrl+shift+l", category: "Multicursor", capital_key: "CTRL+SHIFT+L", command: "cursor_at_all_occurrences", description: "Add a cursor at all occurrences" },
    { key: "ctrl+shift+space", category: "IntelliSense", capital_key: "CTRL+SHIFT+SPACE", command: "trigger_parameter_hints", description: "Trigger parameter hints" },
    { key: "ctrl+\\", category: "Using VSCode", capital_key: "CTRL+\\", command: "split_editor", description: "Split editor" },
    { key: "ctrl+shift+tab", category: "Using VSCode", capital_key: "CTRL+SHIFT+TAB", command: "open_last_used_editor_in_group", description: "Open last used editor in group" },
    { key: "ctrl+`", category: "Terminal", capital_key: "CTRL+`", command: "toggle_terminal", description: "Toggle terminal" },
    { key: "ctrl+shift+`", category: "Terminal", capital_key: "CTRL+SHIFT+`", command: "create_new_terminal", description: "Create new terminal" },
    { key: "ctrl+g", category: "Navigating Code", capital_key: "CTRL+G", command: "go_to_line", description: "Go to line" },
    // this is where I started adding new stuff
    { key: "ctrl+.", category: "Navigating Code", capital_key: "CTRL+.", command: "quick_fix", description: "Quick Fix" },
    { key: "ctrl+shift+s", category: "Using VSCode", capital_key: "CTRL+SHIFT+S", command: "save_file_as", description: "Save File As" },
    { key: "alt+up", category: "Editing", capital_key: "ALT+UP", command: "move_line_up", description: "Move line up" },
    { key: "alt+down", category: "Editing", capital_key: "ALT+DOWN", command: "move_line_down", description: "Move line down" },
    { key: "ctrl+l", category: "Editing", capital_key: "CTRL+L", command: "select_line", description: "Select line" },
    { key: "shift+alt+i", category: "Multicursor", capital_key: "SHIFT+ALT+I", command: "insert_cursor_at_end_of_each_line_selected", description: "Insert cursor at end of each line selected" },
    { key: "ctrl+shift+up", category: "Multicursor", capital_key: "CTRL+SHIFT+UP", command: "add_cursor_above", description: "Add cursor above" },
    { key: "ctrl+shift+down", category: "Multicursor", capital_key: "CTRL+SHIFT+DOWN", command: "add_cursor_below", description: "Add cursor below" }
  ];

  // src/media/plant.ts
  var NUM_MILLISECONDS_ALLOWED_BETWEEN_KEY_USES = 0;
  var Plant = class {
    constructor(key, species) {
      this.init(key, species);
    }
    _init = false;
    _key = "";
    get key() {
      return this._key;
    }
    _species = "";
    get species() {
      return this._species;
    }
    _size = "";
    get size() {
      return this._size;
    }
    _html_element;
    get html_element() {
      return this._html_element;
    }
    _num_hotkey_uses = 0;
    get num_hotkey_uses() {
      return this._num_hotkey_uses;
    }
    _last_key_use = Date.now();
    get last_key_use() {
      return this._last_key_use;
    }
    _num_mashes = 0;
    get num_mashes() {
      return this._num_mashes;
    }
    init(key, species) {
      if (this._init) {
        return;
      }
      if (species === "" || key === "") {
        return;
      }
      this._key = key;
      this._species = species;
      this._size = "start";
      this._num_hotkey_uses = 1;
      const element = document.createElement("div");
      document.getElementById("keycrop").appendChild(element);
      this._html_element = element;
      element.classList.add("plant");
      element.classList.add(this.species);
      element.classList.add(this.size);
      this._updateStageClass();
      this._updateTooltip();
    }
    _updateStageClass() {
      const existing = Array.from(this._html_element.classList).find((c) => c.startsWith("stage-"));
      if (existing) {
        this._html_element.classList.remove(existing);
      }
      if (this._num_hotkey_uses <= 14) {
        this._html_element.classList.add(`stage-${this._num_hotkey_uses}`);
      }
    }
    _updateTooltip() {
      const background = document.getElementById("keycrop")?.getAttribute("background");
      const capitalKey = KEY_MAP.find((k) => k.command === this._key)?.capital_key ?? this._key;
      const capitalSpecies = this.species.charAt(0).toUpperCase() + this.species.slice(1);
      this._html_element.title = background === "inventory" ? "" : `${capitalSpecies} (${capitalKey})
Uses: ${this._num_hotkey_uses}`;
    }
    grow(vscode2) {
      const now = Date.now();
      if (now - this._last_key_use > NUM_MILLISECONDS_ALLOWED_BETWEEN_KEY_USES) {
        this._num_hotkey_uses += 1;
        this._last_key_use = now;
        this._updateStageClass();
        if (this._num_hotkey_uses > 14 && this._html_element.classList.contains("harvested-plant")) {
          vscode2.postMessage({ type: "harvested", text: this.species });
        } else if (this._num_hotkey_uses > 14) {
          this._html_element.classList.remove("plant");
          this._html_element.classList.add("harvested-plant");
          this._html_element.hidden = true;
          vscode2.postMessage({ type: "harvested", text: this.species });
        } else if (this._num_hotkey_uses > 10) {
          this._size = "large";
          this._html_element.classList.remove("medium");
          this._html_element.classList.add(this._size);
        } else if (this._num_hotkey_uses > 6) {
          this._size = "medium";
          this._html_element.classList.remove("small");
          this._html_element.classList.add(this._size);
        } else if (this._num_hotkey_uses > 3) {
          this._size = "small";
          this._html_element.classList.remove("start");
          this._html_element.classList.add(this._size);
        }
        this._updateTooltip();
      } else {
        this._num_mashes += 1;
      }
    }
    setSize(s) {
      this._size = s;
      this._html_element.classList.remove("start");
      this._html_element.classList.remove("small");
      this._html_element.classList.remove("medium");
      this._html_element.classList.remove("large");
      this._html_element.classList.add(this._size);
    }
    setIsHarvested(h, background) {
      if (h) {
        this._html_element.classList.remove("plant");
        this._html_element.classList.add("harvested-plant");
        this._html_element.hidden = background === "inventory" ? false : true;
      } else {
        this._html_element.classList.remove("harvested-plant");
        this._html_element.classList.add("plant");
        this._html_element.hidden = background === "inventory" ? true : false;
      }
    }
    setHotKeyUses(n) {
      this._num_hotkey_uses = n;
      this._updateStageClass();
    }
  };

  // src/media/greenhouse.ts
  var Greenhouse = class {
    plants = [];
    constructor() {
    }
    addPlant(key, species) {
      this.plants.push(new Plant(key, species));
    }
    grow(species, vscode2) {
      this.plants.forEach((plant) => {
        if (plant.species === species) {
          plant.grow(vscode2);
        }
      });
    }
    loadPlant(message, background) {
      let p = new Plant(message.key, message.species);
      p.setSize(message.size);
      p.setIsHarvested(message.harvested, background);
      p.setHotKeyUses(message.hotkey_uses);
      this.plants.push(p);
    }
  };

  // src/media/webview.ts
  var vscode = acquireVsCodeApi();
  var game = {
    div: document.getElementById("keycrop"),
    width: window.innerWidth,
    height: window.innerHeight,
    scale: 2,
    frames: 0,
    fps: 30,
    greenhouse: new Greenhouse()
  };
  window.addEventListener("message", (event) => {
    const message = event.data;
    switch (message.action) {
      case "key-tracking-mode":
        hideGameElements();
        break;
      case "background":
        game.div.setAttribute("background", message.value);
        if (message.value === "blackout") {
          hideGameElements();
        }
        break;
      case "add":
        game.greenhouse.addPlant(message.key, message.species);
        break;
      case "grow":
        game.greenhouse.grow(message.species, vscode);
        checkAcheivements();
        break;
      case "save_plants": {
        const plantsString = getPlantsString();
        vscode.postMessage({ type: "save_plants", content: plantsString });
        break;
      }
      case "load":
        game.greenhouse.loadPlant(message, game.div.getAttribute("background"));
        document.getElementById("empty-inventory-message")?.remove();
      case "scale":
        switch (message.value.toLowerCase()) {
          case "small":
            game.scale = 1;
            break;
          case "medium":
          default:
            game.scale = 2;
            break;
          case "big":
            game.scale = 3;
            break;
        }
        document.body.style.setProperty("--scale", String(game.scale));
        onResize();
        break;
    }
  });
  function checkAcheivements() {
  }
  function hideGameElements() {
    document.getElementById("generator-button").hidden = true;
    document.getElementById("greenhouse-button").hidden = true;
  }
  function onResize() {
    game.width = window.innerWidth;
    game.height = window.innerHeight;
  }
  function getPlantsString() {
    const plantsString = [];
    const currentPlants = [...new Set(game.greenhouse.plants)];
    if (currentPlants.length > 0) {
      currentPlants.forEach((plant) => {
        const harvested = plant.html_element.classList.contains("harvested-plant");
        const plantString = {
          "species": plant.species,
          "size": plant.size,
          "harvested": harvested,
          "hotkey_uses": plant.num_hotkey_uses,
          "num_mashes": plant.num_mashes
        };
        plantsString.push(plantString);
      });
    }
    return plantsString;
  }
  function update() {
    if (game.width !== window.innerWidth || game.height !== window.innerHeight) {
      onResize();
    }
    game.frames++;
  }
  var timer = setInterval(update, 1e3 / game.fps);
  vscode.postMessage({ type: "init" });
})();
//# sourceMappingURL=webview.js.map
