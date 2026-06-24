"use strict";
(() => {
  // src/keyMap.ts
  var KEY_MAP = [
    { key: "ctrl+shift+p", category: "Using VSCode", capital_key: "CTRL+SHIFT+P", command: "command_palette", description: "Show command palette" },
    { key: "ctrl+shift+k", category: "Editing", capital_key: "CTRL+SHIFT+K", command: "delete_current_line", description: "Delete current line" },
    { key: "ctrl+shift+\\", category: "Navigating Code", capital_key: "CTRL+SHIFT+\\", command: "jump_to_bracket", description: "Jump to bracket" },
    { key: "ctrl+t", category: "Navigating Code", capital_key: "CTRL+T", command: "show_all_symbols", description: "Show all symbols" },
    { key: "ctrl+shift+o", category: "Navigating Code", capital_key: "CTRL+SHIFT+O", command: "go_to_symbol", description: "Go to symbol" },
    { key: "ctrl+shift+m", category: "Debugging", capital_key: "CTRL+SHIFT+M", command: "view_problems", description: "View problems" },
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
    { key: "ctrl+shift+down", category: "Multicursor", capital_key: "CTRL+SHIFT+DOWN", command: "add_cursor_below", description: "Add cursor below" },
    { key: "ctrl+space", category: "IntelliSense", capital_key: "CTRL+SPACE", command: "trigger_suggest", description: "Trigger suggestions" },
    { key: "ctrl+k ctrl+i", category: "IntelliSense", capital_key: "CTRL+K CTRL+I", command: "show_hover", description: "Show hover with function details" }
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
      const displaySpecies = this.species.replace(/_/g, " ");
      const capitalSpecies = displaySpecies.charAt(0).toUpperCase() + displaySpecies.slice(1);
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
    remove() {
      this._html_element.remove();
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
        const displaySpecies = this.species.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
        this._html_element.title = displaySpecies;
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

  // src/media/harvestedPlant.ts
  var HarvestedPlant = class {
    _species;
    _count;
    _html_element;
    _badge_element;
    get species() {
      return this._species;
    }
    get count() {
      return this._count;
    }
    constructor(species, count) {
      this._species = species;
      this._count = count;
      const element = document.createElement("div");
      document.getElementById("keycrop").appendChild(element);
      this._html_element = element;
      element.classList.add("harvested-plant");
      element.classList.add(species);
      const displaySpecies = species.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
      element.title = displaySpecies;
      const badge = document.createElement("div");
      badge.classList.add("plant-count-badge");
      badge.textContent = String(count);
      element.appendChild(badge);
      this._badge_element = badge;
    }
    incrementCount() {
      this._count += 1;
      this._badge_element.textContent = String(this._count);
    }
  };

  // src/media/greenhouse.ts
  var Greenhouse = class {
    plants = [];
    harvestedPlants = [];
    NUM_ITEMS_PER_RECIPE = 2;
    COOK_DURATION_MS = 5e3;
    constructor() {
    }
    addPlant(key, species) {
      this.plants.push(new Plant(key, species));
    }
    grow(species, vscode2) {
      this.plants.forEach((plant) => {
        if (plant.species === species && !plant.html_element.classList.contains("harvested-plant")) {
          plant.grow(vscode2);
        }
      });
    }
    loadPlant(message, background) {
      const existingIndex = this.plants.findIndex((p2) => p2.key === message.key);
      if (existingIndex !== -1) {
        this.plants[existingIndex].remove();
        this.plants.splice(existingIndex, 1);
      }
      let p = new Plant(message.key, message.species);
      p.setSize(message.size);
      p.setIsHarvested(message.harvested, background);
      p.setHotKeyUses(message.hotkey_uses);
      this.plants.push(p);
    }
    loadHarvestedPlant(species, count) {
      const existing = this.harvestedPlants.find((p) => p.species === species);
      if (existing) {
        existing.incrementCount();
        return;
      }
      this.harvestedPlants.push(new HarvestedPlant(species, count));
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
        break;
      case "achievement":
        launchConfetti();
        break;
      case "load_harvested":
        game.greenhouse.loadHarvestedPlant(message.species, message.count);
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
  function launchConfetti() {
    const colors = ["#f44336", "#e91e63", "#9c27b0", "#3f51b5", "#2196f3", "#4caf50", "#ffeb3b", "#ff9800"];
    const count = 80;
    for (let i = 0; i < count; i++) {
      const piece = document.createElement("div");
      piece.classList.add("confetti-piece");
      piece.style.left = Math.random() * 100 + "vw";
      piece.style.background = colors[Math.floor(Math.random() * colors.length)];
      piece.style.animationDuration = 1.5 + Math.random() * 2 + "s";
      piece.style.animationDelay = Math.random() * 1.5 + "s";
      piece.style.width = 6 + Math.random() * 6 + "px";
      piece.style.height = 6 + Math.random() * 6 + "px";
      document.body.appendChild(piece);
      piece.addEventListener("animationend", () => piece.remove());
    }
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
          "key": plant.key,
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
  var potWrapper = document.getElementById("inventory-pot-wrapper");
  if (potWrapper) {
    let updateOverlay = function() {
      overlay.textContent = `${potContents.length}/${game.greenhouse.NUM_ITEMS_PER_RECIPE}`;
    }, updateCookButton = function() {
      if (cookBtn) {
        cookBtn.hidden = potContents.length < game.greenhouse.NUM_ITEMS_PER_RECIPE;
      }
    }, refreshHighlights = function() {
      document.querySelectorAll("#keycrop .harvested-plant").forEach((p) => {
        const canAdd = !p.classList.contains("in-pot") && potContents.length < game.greenhouse.NUM_ITEMS_PER_RECIPE;
        ;
        p.classList.toggle("highlighted", potActive && canAdd);
      });
    }, addToPot = function(plant) {
      if (potContents.length >= game.greenhouse.NUM_ITEMS_PER_RECIPE) {
        return;
      }
      plant.classList.add("in-pot");
      const slot = document.createElement("div");
      slot.className = "pot-tray-slot";
      slot.style.backgroundImage = window.getComputedStyle(plant).backgroundImage;
      slot.addEventListener("click", (e) => {
        e.stopPropagation();
        removeFromPot(plant, slot);
      });
      tray.appendChild(slot);
      potContents.push({ plant, slot });
      updateOverlay();
      updateCookButton();
      refreshHighlights();
    }, removeFromPot = function(plant, slot) {
      const idx = potContents.findIndex((entry) => entry.plant === plant);
      if (idx !== -1) {
        potContents.splice(idx, 1);
      }
      slot.remove();
      plant.classList.remove("in-pot");
      updateOverlay();
      updateCookButton();
      refreshHighlights();
    };
    updateOverlay2 = updateOverlay, updateCookButton2 = updateCookButton, refreshHighlights2 = refreshHighlights, addToPot2 = addToPot, removeFromPot2 = removeFromPot;
    const overlay = potWrapper.querySelector(".inventory-pot-overlay");
    const cookBtn = document.getElementById("cook-btn");
    let potActive = false;
    const potContents = [];
    const tray = document.createElement("div");
    tray.className = "pot-tray";
    potWrapper.appendChild(tray);
    game.div.addEventListener("click", (e) => {
      if (!potActive) {
        return;
      }
      const plant = e.target.closest(".harvested-plant");
      if (!plant || plant.classList.contains("in-pot")) {
        return;
      }
      addToPot(plant);
    });
    potWrapper.addEventListener("click", () => {
      potActive = !potActive;
      overlay.hidden = !potActive;
      if (potActive) {
        updateOverlay();
      }
      refreshHighlights();
    });
    const progressWrapper = document.getElementById("cook-progress-wrapper");
    const progressBar = document.getElementById("cook-progress-bar");
    cookBtn?.addEventListener("click", () => {
      if (potContents.length < game.greenhouse.NUM_ITEMS_PER_RECIPE) {
        return;
      }
      const potImg = potWrapper.querySelector(".inventory-pot");
      if (cookBtn) {
        cookBtn.disabled = true;
      }
      potWrapper.style.pointerEvents = "none";
      const entries = [...potContents];
      let completed = 0;
      entries.forEach(({ slot }, i) => {
        slot.style.animationDelay = `${i * 80}ms`;
        slot.classList.add("falling");
        slot.addEventListener("animationend", () => {
          completed++;
          if (completed === entries.length) {
            entries.forEach(({ plant: p, slot: s }) => {
              s.remove();
              p.classList.remove("in-pot");
            });
            potContents.length = 0;
            potImg.src = potImg.dataset.closedSrc;
            potActive = false;
            overlay.hidden = true;
            updateOverlay();
            updateCookButton();
            refreshHighlights();
            potWrapper.style.pointerEvents = "";
            if (cookBtn) {
              cookBtn.hidden = true;
            }
            if (progressWrapper && progressBar) {
              progressWrapper.hidden = false;
              progressBar.style.transition = "none";
              progressBar.style.width = "100%";
              requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                  progressBar.style.transition = `width ${game.greenhouse.COOK_DURATION_MS}ms linear`;
                  progressBar.style.width = "0%";
                });
              });
              progressBar.addEventListener("transitionend", () => {
                progressWrapper.hidden = true;
              }, { once: true });
            }
          }
        }, { once: true });
      });
    });
  }
  var updateOverlay2;
  var updateCookButton2;
  var refreshHighlights2;
  var addToPot2;
  var removeFromPot2;
  var timer = setInterval(update, 1e3 / game.fps);
  vscode.postMessage({ type: "init" });
})();
//# sourceMappingURL=webview.js.map
