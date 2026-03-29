"use strict";
(() => {
  // src/media/webview.ts
  var NUM_MILLISECONDS_ALLOWED_BETWEEN_KEY_USES = 0;
  var LEVEL_ONE = [
    "tomato",
    "broccoli",
    "lettuce",
    "bean",
    "chili"
  ];
  var vscode = acquireVsCodeApi();
  var game = {
    div: document.getElementById("keycrop"),
    width: window.innerWidth,
    height: window.innerHeight,
    scale: 2,
    frames: 0,
    fps: 30,
    plants: []
  };
  var Plant = class {
    #init = false;
    #species = "";
    get species() {
      return this.#species;
    }
    #size = "";
    get size() {
      return this.#size;
    }
    #html_element;
    get html_element() {
      return this.#html_element;
    }
    #num_hotkey_uses = 0;
    get num_hotkey_uses() {
      return this.#num_hotkey_uses;
    }
    #last_key_use = Date.now();
    get last_key_use() {
      return this.#last_key_use;
    }
    #num_mashes = 0;
    get num_mashes() {
      return this.#num_mashes;
    }
    constructor() {
    }
    //Init
    init(species) {
      if (this.#init) {
        return;
      }
      if (species === "") {
        return;
      }
      this.#species = species;
      this.#size = "start";
      const element = document.createElement("div");
      game.div.appendChild(element);
      this.#html_element = element;
      element.classList.add("plant");
      element.classList.add(this.species);
      element.classList.add(this.size);
      game.plants.push(this);
    }
    grow() {
      const now = Date.now();
      if (now - this.#last_key_use > NUM_MILLISECONDS_ALLOWED_BETWEEN_KEY_USES) {
        this.#num_hotkey_uses += 1;
        this.#last_key_use = now;
        if (this.#num_hotkey_uses > 8 && this.#html_element.classList.contains("harvested-plant")) {
          vscode.postMessage({ type: "harvested", text: this.species });
        } else if (this.#num_hotkey_uses > 4) {
          this.#html_element.classList.remove("plant");
          this.#html_element.classList.add("harvested-plant");
          this.#html_element.hidden = true;
          vscode.postMessage({ type: "harvested", text: this.species });
        } else if (this.#num_hotkey_uses > 3) {
          this.#size = "large";
          this.#html_element.classList.remove("medium");
          this.#html_element.classList.add(this.#size);
        } else if (this.#num_hotkey_uses > 2) {
          this.#size = "medium";
          this.#html_element.classList.remove("small");
          this.#html_element.classList.add(this.#size);
        } else if (this.#num_hotkey_uses > 1) {
          this.#size = "small";
          this.#html_element.classList.remove("start");
          this.#html_element.classList.add(this.#size);
        }
      } else {
        this.#num_mashes += 1;
      }
    }
    setSize(s) {
      this.#size = s;
      this.#html_element.classList.remove("start");
      this.#html_element.classList.remove("small");
      this.#html_element.classList.remove("medium");
      this.#html_element.classList.remove("large");
      this.#html_element.classList.add(this.#size);
    }
    setIsHarvested(h) {
      if (h) {
        this.#html_element.classList.remove("plant");
        this.#html_element.classList.add("harvested-plant");
        this.#html_element.hidden = game.div.getAttribute("background") === "inventory" ? false : true;
      } else {
        this.#html_element.classList.remove("harvested-plant");
        this.#html_element.classList.add("plant");
        this.#html_element.hidden = game.div.getAttribute("background") === "inventory" ? true : false;
      }
    }
    setHotKeyUses(n) {
      this.#num_hotkey_uses = n;
    }
  };
  var Corn = class extends Plant {
    constructor() {
      super();
      this.init("corn");
    }
  };
  var Strawberry = class extends Plant {
    constructor() {
      super();
      this.init("strawberry");
    }
  };
  var Mango = class extends Plant {
    constructor() {
      super();
      this.init("mango");
    }
  };
  var Poppy = class extends Plant {
    constructor() {
      super();
      this.init("poppy");
    }
  };
  var Sunflower = class extends Plant {
    constructor() {
      super();
      this.init("sunflower");
    }
  };
  var SnapPea = class extends Plant {
    constructor() {
      super();
      this.init("snappea");
    }
  };
  var Okra = class extends Plant {
    constructor() {
      super();
      this.init("okra");
    }
  };
  var Carrot = class extends Plant {
    constructor() {
      super();
      this.init("carrot");
    }
  };
  var Canola = class extends Plant {
    constructor() {
      super();
      this.init("canola");
    }
  };
  var AppleTree = class extends Plant {
    constructor() {
      super();
      this.init("apple_tree");
    }
  };
  var CherryTree = class extends Plant {
    constructor() {
      super();
      this.init("cherry_tree");
    }
  };
  var SphagettiFern = class extends Plant {
    constructor() {
      super();
      this.init("sphagettifern");
    }
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
        switch (message.species) {
          case "corn":
            game.plants.push(new Corn());
            break;
          case "strawberry":
            game.plants.push(new Strawberry());
            break;
          case "mango":
            game.plants.push(new Mango());
            break;
          case "poppy":
            game.plants.push(new Poppy());
            break;
          case "sunflower":
            game.plants.push(new Sunflower());
            break;
          case "snappea":
            game.plants.push(new SnapPea());
            break;
          case "sphagettifern":
            game.plants.push(new SphagettiFern());
            break;
          case "okra":
            game.plants.push(new Okra());
            break;
          case "carrot":
            game.plants.push(new Carrot());
            break;
          case "canola":
            game.plants.push(new Canola());
            break;
          case "apple_tree":
            game.plants.push(new AppleTree());
            break;
          case "cherry_tree":
            game.plants.push(new CherryTree());
            break;
        }
        break;
      case "grow":
        switch (message.species) {
          case "corn":
            game.plants.forEach((plant) => {
              if (plant.species === "corn") {
                plant.grow();
              }
            });
            checkAcheivements();
            break;
          case "mango":
            game.plants.forEach((plant) => {
              if (plant.species === "mango") {
                plant.grow();
              }
            });
            checkAcheivements();
            break;
          case "strawberry":
            game.plants.forEach((plant) => {
              if (plant.species === "strawberry") {
                plant.grow();
              }
            });
            checkAcheivements();
            break;
          case "poppy":
            game.plants.forEach((plant) => {
              if (plant.species === "poppy") {
                plant.grow();
              }
            });
            checkAcheivements();
            break;
          case "sunflower":
            game.plants.forEach((plant) => {
              if (plant.species === "sunflower") {
                plant.grow();
              }
            });
            checkAcheivements();
            break;
          case "canola":
            game.plants.forEach((plant) => {
              if (plant.species === "canola") {
                plant.grow();
              }
            });
            checkAcheivements();
            break;
          case "snappea":
            game.plants.forEach((plant) => {
              if (plant.species === "snappea") {
                plant.grow();
              }
            });
            checkAcheivements();
            break;
          case "okra":
            game.plants.forEach((plant) => {
              if (plant.species === "okra") {
                plant.grow();
              }
            });
            checkAcheivements();
            break;
          case "carrot":
            game.plants.forEach((plant) => {
              if (plant.species === "carrot") {
                plant.grow();
              }
            });
            checkAcheivements();
            break;
          case "cherry_tree":
            game.plants.forEach((plant) => {
              if (plant.species === "cherry_tree") {
                plant.grow();
              }
            });
            checkAcheivements();
            break;
          case "apple_tree":
            game.plants.forEach((plant) => {
              if (plant.species === "apple_tree") {
                plant.grow();
              }
            });
            checkAcheivements();
            break;
          case "sphagettifern":
            game.plants.forEach((plant) => {
              if (plant.species === "sphagettifern") {
                plant.grow();
              }
            });
            checkAcheivements();
            break;
        }
        break;
      case "save_plants": {
        const plantsString = getPlantsString();
        vscode.postMessage({ type: "save_plants", content: plantsString });
        break;
      }
      case "load":
        switch (message.species) {
          case "corn": {
            const corn = new Corn();
            corn.setSize(message.size);
            corn.setIsHarvested(message.harvested);
            corn.setHotKeyUses(message.hotkey_uses);
            game.plants.push(corn);
            break;
          }
          case "strawberry": {
            const strawberry = new Strawberry();
            strawberry.setSize(message.size);
            strawberry.setIsHarvested(message.harvested);
            strawberry.setHotKeyUses(message.hotkey_uses);
            game.plants.push(strawberry);
            break;
          }
          case "mango": {
            const mango = new Mango();
            mango.setSize(message.size);
            mango.setIsHarvested(message.harvested);
            mango.setHotKeyUses(message.hotkey_uses);
            game.plants.push(mango);
            break;
          }
          case "poppy": {
            const poppy = new Poppy();
            poppy.setSize(message.size);
            poppy.setIsHarvested(message.harvested);
            poppy.setHotKeyUses(message.hotkey_uses);
            game.plants.push(poppy);
            break;
          }
          case "sunflower": {
            const sunflower = new Sunflower();
            sunflower.setSize(message.size);
            sunflower.setIsHarvested(message.harvested);
            sunflower.setHotKeyUses(message.hotkey_uses);
            game.plants.push(sunflower);
            break;
          }
          case "snappea": {
            const snappea = new SnapPea();
            snappea.setSize(message.size);
            snappea.setIsHarvested(message.harvested);
            snappea.setHotKeyUses(message.hotkey_uses);
            game.plants.push(snappea);
            break;
          }
          case "sphagettifern": {
            const sphagettifern = new SphagettiFern();
            sphagettifern.setSize(message.size);
            sphagettifern.setIsHarvested(message.harvested);
            sphagettifern.setHotKeyUses(message.hotkey_uses);
            game.plants.push(sphagettifern);
            break;
          }
          case "canola": {
            const canola = new Canola();
            canola.setSize(message.size);
            canola.setIsHarvested(message.harvested);
            canola.setHotKeyUses(message.hotkey_uses);
            game.plants.push(canola);
            break;
          }
          case "okra": {
            const okra = new Okra();
            okra.setSize(message.size);
            okra.setIsHarvested(message.harvested);
            okra.setHotKeyUses(message.hotkey_uses);
            game.plants.push(okra);
            break;
          }
          case "carrot": {
            const carrot = new Carrot();
            carrot.setSize(message.size);
            carrot.setIsHarvested(message.harvested);
            carrot.setHotKeyUses(message.hotkey_uses);
            game.plants.push(carrot);
            break;
          }
          case "apple_tree": {
            const apple_tree = new AppleTree();
            apple_tree.setSize(message.size);
            apple_tree.setIsHarvested(message.harvested);
            apple_tree.setHotKeyUses(message.hotkey_uses);
            game.plants.push(apple_tree);
            break;
          }
          case "cherry_tree": {
            const cherry_tree = new CherryTree();
            cherry_tree.setSize(message.size);
            cherry_tree.setIsHarvested(message.harvested);
            cherry_tree.setHotKeyUses(message.hotkey_uses);
            game.plants.push(cherry_tree);
            break;
          }
        }
        break;
      //Update scale - take this out?
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
    let levelOneChecklist = 0;
    const currentPlants = [...new Set(game.plants)];
    currentPlants.forEach((plant) => {
      if (plant.html_element.classList.contains("harvested-plant")) {
        if (LEVEL_ONE.includes(plant.species)) {
          levelOneChecklist += 1;
        }
      }
    });
    if (LEVEL_ONE.length === levelOneChecklist) {
      vscode.postMessage({ type: "level_one" });
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
    const currentPlants = [...new Set(game.plants)];
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
