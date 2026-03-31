"use strict";
(() => {
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
      const element = document.createElement("div");
      document.getElementById("keycrop").appendChild(element);
      this._html_element = element;
      element.classList.add("plant");
      element.classList.add(this.species);
      element.classList.add(this.size);
      this._updateTooltip();
    }
    _updateTooltip() {
      const background = document.getElementById("keycrop")?.getAttribute("background");
      this._html_element.title = background === "inventory" ? "" : `${this.species} (${this._key})
Uses: ${this._num_hotkey_uses}`;
    }
    grow(vscode2) {
      const now = Date.now();
      if (now - this._last_key_use > NUM_MILLISECONDS_ALLOWED_BETWEEN_KEY_USES) {
        this._num_hotkey_uses += 1;
        this._last_key_use = now;
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
