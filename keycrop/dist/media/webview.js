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

  // src/media/inventoryItem.ts
  var InventoryItem = class {
    _count;
    _price;
    _badge_element;
    _price_badge_element;
    get count() {
      return this._count;
    }
    constructor(count, price) {
      this._count = count;
      this._price = price;
    }
    createBadge(parent) {
      parent.dataset.price = String(this._price);
      const badge = document.createElement("div");
      badge.classList.add("plant-count-badge");
      badge.textContent = String(this._count);
      parent.appendChild(badge);
      this._badge_element = badge;
      const priceBadge = document.createElement("div");
      priceBadge.classList.add("price-badge");
      priceBadge.textContent = `$${this._price * this._count}`;
      parent.appendChild(priceBadge);
      this._price_badge_element = priceBadge;
    }
    incrementCount() {
      this._count += 1;
      this._badge_element.textContent = String(this._count);
      this._price_badge_element.textContent = `$${this._price * this._count}`;
    }
  };

  // src/media/plants.ts
  var PLANTS = {
    bean: { price: 2, category: "vegetable" },
    tomato: { price: 2, category: "vegetable" },
    broccoli: { price: 2, category: "vegetable" },
    chili: { price: 2, category: "vegetable" },
    lettuce: { price: 2, category: "vegetable" },
    rhubarb: { price: 2, category: "vegetable" },
    ivy: { price: 50, category: "decorative" },
    jacaranda_tree: { price: 50, category: "decorative" },
    raspberry: { price: 4, category: "fruit" },
    strawberry: { price: 4, category: "fruit" },
    watermelon: { price: 4, category: "fruit" },
    glowberry: { price: 100, category: "exotic" },
    bulbino: { price: 100, category: "exotic" },
    poison_cabbage: { price: 100, category: "exotic" },
    neon_mould: { price: 100, category: "exotic" }
  };

  // src/media/harvestedPlant.ts
  var HarvestedPlant = class extends InventoryItem {
    _species;
    _html_element;
    get species() {
      return this._species;
    }
    constructor(species, count) {
      super(count, PLANTS[species]?.price ?? 0);
      this._species = species;
      const element = document.createElement("div");
      document.getElementById("keycrop").appendChild(element);
      this._html_element = element;
      element.classList.add("harvested-plant");
      element.classList.add(species);
      element.dataset.species = species;
      const displaySpecies = species.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
      element.title = displaySpecies;
      this.createBadge(element);
    }
    useOne() {
      this._count -= 1;
      if (this._count <= 0) {
        this._html_element.remove();
        return true;
      }
      this._badge_element.textContent = String(this._count);
      this._html_element.classList.remove("in-pot");
      return false;
    }
  };

  // src/media/recipes.ts
  var RECIPES = {
    "bean+broccoli": { filename: "bean_broccoli.png", name: "Bean & Broccoli Stir Fry", price: 18 },
    "bean+bulbino": { filename: "bean_bulbino.png", name: "Bulbino Bean Stew", price: 22 },
    "bean+chili": { filename: "chili_bean.png", name: "Chili Beans", price: 16 },
    "bean+glowberry": { filename: "glowberry_beans.png", name: "Glowing Bean Salad", price: 28 },
    "bean+ivy": { filename: "beans_ivy.png", name: "Ivy Bean Wrap", price: 14 },
    "bean+jacaranda_tree": { filename: "bean_jacaranda.png", name: "Jacaranda Bean Dish", price: 26 },
    "bean+neon_mould": { filename: "bean_neon_mould.png", name: "Neon Bean Mould", price: 32 },
    "bean+poison_cabbage": { filename: "bean_poison_cabbage.png", name: "Daring Bean Slaw", price: 20 },
    "bean+raspberry": { filename: "bean_raspberry.png", name: "Berry Bean Bowl", price: 17 },
    "bean+rhubarb": { filename: "bean_rhubarb.png", name: "Rhubarb Bean Tart", price: 15 },
    "bean+strawberry": { filename: "bean_strawberry.png", name: "Strawberry Bean Compote", price: 19 },
    "bean+tomato": { filename: "bean-tomato.png", name: "Classic Tomato Beans", price: 14 },
    "bean+watermelon": { filename: "bean_watermelon.png", name: "Watermelon Bean Salsa", price: 16 },
    "broccoli+bulbino": { filename: "broccoli_bulbino.png", name: "Bulbino Broccoli Bake", price: 24 },
    "broccoli+chili": { filename: "broccoli_chili.png", name: "Chili Broccoli Saut\xE9", price: 18 },
    "broccoli+glowberry": { filename: "broccoli_glowberry.png", name: "Glowberry Broccoli Salad", price: 29 },
    "broccoli+ivy": { filename: "broccoli_ivy.png", name: "Ivy Broccoli Tangle", price: 15 },
    "broccoli+jacaranda_tree": { filename: "jacaranda_broccoli.png", name: "Jacaranda Broccoli Float", price: 27 },
    "broccoli+lettuce": { filename: "lettuce_broccoli.png", name: "Garden Green Bowl", price: 12 },
    "broccoli+neon_mould": { filename: "broccoli_neon_mould.png", name: "Neon Broccoli Spores", price: 34 },
    "broccoli+poison_cabbage": { filename: "broccoli_poison_cabbage.png", name: "Hazard Greens", price: 21 },
    "broccoli+raspberry": { filename: "broccoli_raspberry.png", name: "Raspberry Broccoli Crumble", price: 18 },
    "broccoli+rhubarb": { filename: "broccoli_rhubarb.png", name: "Rhubarb Broccoli Bake", price: 16 },
    "broccoli+strawberry": { filename: "broccoli_strawberries.png", name: "Strawberry Broccoli Drizzle", price: 20 },
    "broccoli+tomato": { filename: "broccoli_tomato.png", name: "Tomato Broccoli Pasta", price: 17 },
    "broccoli+watermelon": { filename: "broccoli_watermelon.png", name: "Watermelon Broccoli Splash", price: 17 },
    "bulbino+chili": { filename: "chili_bulbino.png", name: "Spicy Bulbino Curry", price: 28 },
    "bulbino+glowberry": { filename: "glowberry_bulbino.png", name: "Glowing Bulbino Brew", price: 38 },
    "bulbino+ivy": { filename: "bulbino_ivy.png", name: "Bulbino Ivy Wrap", price: 24 },
    "bulbino+jacaranda_tree": { filename: "bulbino_jacaranda.png", name: "Jacaranda Bulbino Stew", price: 36 },
    "bulbino+lettuce": { filename: "bulbino_lettuce.png", name: "Bulbino Lettuce Cup", price: 21 },
    "bulbino+neon_mould": { filename: "bulbino_neon_mould.png", name: "Neon Bulbino Fungus", price: 42 },
    "bulbino+poison_cabbage": { filename: "bulbino_poison_cabbage.png", name: "Dangerous Bulbino Slaw", price: 30 },
    "bulbino+rhubarb": { filename: "bulbino_rhubarb.png", name: "Bulbino Rhubarb Crumble", price: 25 },
    "bulbino+strawberry": { filename: "bulbino_strawberry.png", name: "Bulbino Strawberry Jam", price: 29 },
    "bulbino+tomato": { filename: "bulbino_tomato.png", name: "Bulbino Tomato Soup", price: 26 },
    "bulbino+watermelon": { filename: "bulbino_watermelon.png", name: "Bulbino Watermelon Punch", price: 26 },
    "chili+glowberry": { filename: "chili_glowberry.png", name: "Fire & Glow Salsa", price: 33 },
    "chili+ivy": { filename: "chili_ivy.png", name: "Ivy Chili Tangle", price: 19 },
    "chili+jacaranda_tree": { filename: "chili_jacaranda.png", name: "Jacaranda Chili Sauce", price: 31 },
    "chili+lettuce": { filename: "chili_lettuce.png", name: "Chili Lettuce Crunch", price: 16 },
    "chili+neon_mould": { filename: "chili_neon_mould.png", name: "Radioactive Chili", price: 38 },
    "chili+poison_cabbage": { filename: "chili_poison_cabbage.png", name: "Double Danger Slaw", price: 25 },
    "chili+raspberry": { filename: "chili_raspberry.png", name: "Chili Raspberry Jam", price: 23 },
    "chili+rhubarb": { filename: "chili_rhubarb.png", name: "Chili Rhubarb Compote", price: 20 },
    "chili+strawberry": { filename: "chili_strawberry.png", name: "Chili Strawberry Salsa", price: 24 },
    "chili+tomato": { filename: "tomato_chili.png", name: "Spicy Tomato Sauce", price: 21 },
    "chili+watermelon": { filename: "chili_watermelon.png", name: "Chili Watermelon Rind", price: 21 },
    "glowberry+ivy": { filename: "glowerry_ivy.png", name: "Glowing Ivy Brew", price: 30 },
    "glowberry+jacaranda_tree": { filename: "glowberry_jacaranda.png", name: "Luminous Jacaranda Tonic", price: 41 },
    "glowberry+lettuce": { filename: "lettuce_glowberry.png", name: "Glowing Garden Salad", price: 27 },
    "glowberry+neon_mould": { filename: "glowberry_neon_mould.png", name: "Radioactive Glow Mould", price: 48 },
    "glowberry+poison_cabbage": { filename: "glowberry_poison_cabbage.png", name: "Toxic Glow Slaw", price: 35 },
    "glowberry+raspberry": { filename: "raspberry_glowberry.png", name: "Glow Raspberry Juice", price: 32 },
    "glowberry+rhubarb": { filename: "glowberry_rhubarb.png", name: "Glowing Rhubarb Crumble", price: 30 },
    "glowberry+strawberry": { filename: "glowberry_strawberry.png", name: "Glowing Strawberry Jam", price: 34 },
    "glowberry+tomato": { filename: "tomato_glowberry.png", name: "Glowing Tomato Sauce", price: 31 },
    "glowberry+watermelon": { filename: "watermelon_glowberry.png", name: "Glowing Watermelon Punch", price: 31 },
    "ivy+jacaranda_tree": { filename: "jacaranda_ivy.png", name: "Jacaranda Ivy Tea", price: 27 },
    "ivy+lettuce": { filename: "lettuce_ivy.png", name: "Ivy Lettuce Wrap", price: 13 },
    "ivy+neon_mould": { filename: "neon_mould_ivy.png", name: "Neon Ivy Spores", price: 34 },
    "ivy+poison_cabbage": { filename: "ivy_poison_cabbage.png", name: "Toxic Ivy Slaw", price: 21 },
    "ivy+raspberry": { filename: "ivy_raspberry.png", name: "Ivy Raspberry Tart", price: 19 },
    "ivy+rhubarb": { filename: "ivy_rhubarb.png", name: "Ivy Rhubarb Stalk", price: 16 },
    "ivy+strawberry": { filename: "ivy_strawberry.png", name: "Ivy Strawberry Preserve", price: 20 },
    "ivy+tomato": { filename: "tomato_ivy.png", name: "Ivy Tomato Broth", price: 17 },
    "ivy+watermelon": { filename: "watermelon_ivy.png", name: "Ivy Watermelon Slush", price: 17 },
    "jacaranda_tree+lettuce": { filename: "lettuce_jacaranda.png", name: "Jacaranda Lettuce Roll", price: 25 },
    "jacaranda_tree+neon_mould": { filename: "jacaranda_neon_mould.png", name: "Radioactive Jacaranda Pudding", price: 46 },
    "jacaranda_tree+poison_cabbage": { filename: "poison_cabbage_jacaranda.png", name: "Jacaranda Poison Rolls", price: 33 },
    "jacaranda_tree+raspberry": { filename: "raspberry_jacaranda.png", name: "Jacaranda Raspberry Fizz", price: 30 },
    "jacaranda_tree+rhubarb": { filename: "rhubarb_jacaranda.png", name: "Jacaranda Rhubarb Tart", price: 28 },
    "jacaranda_tree+strawberry": { filename: "strawberry_jacaranda.png", name: "Jacaranda Strawberry Delight", price: 32 },
    "jacaranda_tree+tomato": { filename: "tomato_jacaranda.png", name: "Jacaranda Tomato Stew", price: 29 },
    "jacaranda_tree+watermelon": { filename: "jacaranda_watermelon.png", name: "Jacaranda Watermelon Ice", price: 29 },
    "lettuce+neon_mould": { filename: "neon_mould_lettuce.png", name: "Radioactive Lettuce Salad", price: 32 },
    "lettuce+poison_cabbage": { filename: "poison_cabbage_lettuce.png", name: "Danger Greens Bowl", price: 19 },
    "lettuce+raspberry": { filename: "raspberry_lettuce.png", name: "Raspberry Lettuce Salad", price: 16 },
    "lettuce+rhubarb": { filename: "lettuce_rhubarb.png", name: "Rhubarb Lettuce Wrap", price: 13 },
    "lettuce+strawberry": { filename: "strawberry_lettuce.png", name: "Strawberry Lettuce Salad", price: 17 },
    "lettuce+tomato": { filename: "tomato_lettuce.png", name: "Classic Tomato Salad", price: 14 },
    "lettuce+watermelon": { filename: "lettuce_watermelon.png", name: "Watermelon Lettuce Wrap", price: 14 },
    "neon_mould+poison_cabbage": { filename: "neon_mould_poison_cabbage.png", name: "Doubly Toxic Mould", price: 40 },
    "neon_mould+raspberry": { filename: "neon_mould_raspberry.png", name: "Radioactive Raspberry Jam", price: 37 },
    "neon_mould+rhubarb": { filename: "neon_mould_rhubarb.png", name: "Neon Rhubarb Surprise", price: 35 },
    "neon_mould+strawberry": { filename: "neon_mould_strawberry.png", name: "Glowing Strawberry Mould", price: 39 },
    "neon_mould+tomato": { filename: "tomato_neon_mould.png", name: "Neon Tomato Sauce", price: 36 },
    "neon_mould+watermelon": { filename: "neon_mould_watermelon.png", name: "Radioactive Watermelon Rind", price: 36 },
    "poison_cabbage+raspberry": { filename: "raspberry_poison_cabbage.png", name: "Poisoned Raspberry Jam", price: 24 },
    "poison_cabbage+rhubarb": { filename: "rhubarb_poison_cabbage.png", name: "Toxic Rhubarb Compote", price: 22 },
    "poison_cabbage+strawberry": { filename: "strawberry_cabbage.png", name: "Daring Strawberry Slaw", price: 26 },
    "poison_cabbage+tomato": { filename: "tomato_poison_cabbage.png", name: "Toxic Tomato Soup", price: 23 },
    "poison_cabbage+watermelon": { filename: "watermelon_poison_cabbage.png", name: "Toxic Watermelon Slush", price: 23 },
    "raspberry+rhubarb": { filename: "raspberry_rhubarb.png", name: "Raspberry Rhubarb Crumble", price: 20 },
    "raspberry+strawberry": { filename: "raspberry_strawberry.png", name: "Berry Mix Jam", price: 23 },
    "raspberry+tomato": { filename: "tomato_raspberry.png", name: "Tomato Raspberry Sauce", price: 20 },
    "raspberry+watermelon": { filename: "raspberry_watermelon.png", name: "Raspberry Watermelon Slush", price: 20 },
    "rhubarb+strawberry": { filename: "strawberry_rhubarb.png", name: "Strawberry Rhubarb Tart", price: 21 },
    "rhubarb+tomato": { filename: "tomato_rhubarb.png", name: "Tomato Rhubarb Chutney", price: 18 },
    "rhubarb+watermelon": { filename: "watermelon_rhubarb.png", name: "Rhubarb Watermelon Cooler", price: 17 },
    "strawberry+tomato": { filename: "tomato_strawberry.png", name: "Strawberry Tomato Bruschetta", price: 22 },
    "strawberry+watermelon": { filename: "strawberry_watermelon.png", name: "Strawberry Watermelon Punch", price: 22 },
    "tomato+watermelon": { filename: "tomato_watermelon.png", name: "Watermelon Tomato Gazpacho", price: 19 }
  };

  // src/media/cookedFood.ts
  var CookedFood = class extends InventoryItem {
    _recipeKey;
    _name;
    _html_element;
    get recipeKey() {
      return this._recipeKey;
    }
    constructor(recipeKey, name, imgSrc, count) {
      super(count, RECIPES[recipeKey]?.price ?? 0);
      this._recipeKey = recipeKey;
      this._name = name;
      const container = document.getElementById("food-row");
      const element = document.createElement("div");
      element.classList.add("cooked-food");
      element.dataset.recipeKey = recipeKey;
      element.title = name;
      container.appendChild(element);
      this._html_element = element;
      const img = document.createElement("img");
      img.src = imgSrc;
      img.classList.add("cooked-food-img");
      element.appendChild(img);
      this.createBadge(element);
    }
    useOne() {
      this._count -= 1;
      if (this._count <= 0) {
        this._html_element.remove();
        return true;
      }
      this._badge_element.textContent = String(this._count);
      return false;
    }
  };

  // src/media/greenhouse.ts
  var Greenhouse = class {
    plants = [];
    harvestedPlants = [];
    cookedFoods = [];
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
    consumeCookedFood(element) {
      const idx = this.cookedFoods.findIndex((f) => f._html_element === element);
      if (idx === -1) {
        return;
      }
      const fullyConsumed = this.cookedFoods[idx].useOne();
      if (fullyConsumed) {
        this.cookedFoods.splice(idx, 1);
      }
    }
    consumeHarvestedPlant(element) {
      const idx = this.harvestedPlants.findIndex((p) => p._html_element === element);
      if (idx === -1) {
        return;
      }
      const fullyConsumed = this.harvestedPlants[idx].useOne();
      if (fullyConsumed) {
        this.harvestedPlants.splice(idx, 1);
      }
    }
    addCookedFood(recipeKey, name, imgSrc) {
      const existing = this.cookedFoods.find((f) => f.recipeKey === recipeKey);
      if (existing) {
        existing.incrementCount();
        return;
      }
      this.cookedFoods.push(new CookedFood(recipeKey, name, imgSrc, 1));
    }
    loadCookedFood(recipeKey, name, imgSrc, count) {
      this.cookedFoods.push(new CookedFood(recipeKey, name, imgSrc, count));
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
  var playerMoney = 0;
  function updateMoneyDisplay() {
    const el = document.getElementById("money-display");
    if (el) {
      el.textContent = `$${playerMoney}`;
    }
  }
  function sellItem(element, species, recipeKey) {
    const price = parseInt(element.dataset.price ?? "0", 10);
    playerMoney += price;
    updateMoneyDisplay();
    vscode.postMessage({ type: "sell", amount: price, species, recipeKey });
  }
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
        break;
      case "load_cooked": {
        const recipe = RECIPES[message.recipeKey];
        if (recipe) {
          const foodBase = document.getElementById("inventory-bottom-right")?.dataset.foodBase ?? "";
          const foodRow = document.getElementById("food-row");
          if (foodRow) {
            foodRow.hidden = false;
          }
          game.greenhouse.loadCookedFood(message.recipeKey, recipe.name, `${foodBase}/${recipe.filename}`, message.count);
        }
        break;
      }
      case "load_money":
        playerMoney = message.amount ?? 0;
        updateMoneyDisplay();
        break;
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
    }, syncPotUI = function() {
      updateOverlay();
      updateCookButton();
      refreshHighlights();
    }, plantPotCount = function(plant) {
      return potContents.filter((entry) => entry.plant === plant).length;
    }, plantInventoryCount = function(plant) {
      return game.greenhouse.harvestedPlants.find((p) => p._html_element === plant)?.count ?? 1;
    }, refreshHighlights = function() {
      document.querySelectorAll("#keycrop .harvested-plant").forEach((p) => {
        const canAdd = plantPotCount(p) < plantInventoryCount(p) && potContents.length < game.greenhouse.NUM_ITEMS_PER_RECIPE;
        p.classList.toggle("highlighted", potActive && canAdd);
      });
    }, addToPot = function(plant) {
      if (potContents.length >= game.greenhouse.NUM_ITEMS_PER_RECIPE) {
        return;
      }
      const slot = document.createElement("div");
      slot.className = "pot-tray-slot";
      slot.style.backgroundImage = window.getComputedStyle(plant).backgroundImage;
      slot.addEventListener("click", (e) => {
        e.stopPropagation();
        removeFromPot(plant, slot);
      });
      tray.appendChild(slot);
      potContents.push({ plant, slot });
      if (plantPotCount(plant) >= plantInventoryCount(plant)) {
        plant.classList.add("in-pot");
      }
      syncPotUI();
    }, removeFromPot = function(plant, slot) {
      const idx = potContents.findIndex((entry) => entry.plant === plant);
      if (idx !== -1) {
        potContents.splice(idx, 1);
      }
      slot.remove();
      plant.classList.remove("in-pot");
      syncPotUI();
    }, showContextMenu = function(x, y, target) {
      contextMenuTarget = target;
      const price = parseInt(target.dataset.price ?? "0", 10);
      sellOption.textContent = `Sell ($${price})`;
      contextMenu.style.left = `${x}px`;
      contextMenu.style.top = `${y}px`;
      contextMenu.hidden = false;
    }, hideContextMenu = function() {
      contextMenu.hidden = true;
      contextMenuTarget = null;
    };
    updateOverlay2 = updateOverlay, updateCookButton2 = updateCookButton, syncPotUI2 = syncPotUI, plantPotCount2 = plantPotCount, plantInventoryCount2 = plantInventoryCount, refreshHighlights2 = refreshHighlights, addToPot2 = addToPot, removeFromPot2 = removeFromPot, showContextMenu2 = showContextMenu, hideContextMenu2 = hideContextMenu;
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
      if (!plant || plantPotCount(plant) >= plantInventoryCount(plant)) {
        return;
      }
      addToPot(plant);
    });
    let contextMenuTarget = null;
    const contextMenu = document.createElement("div");
    contextMenu.id = "item-context-menu";
    contextMenu.hidden = true;
    const sellOption = document.createElement("div");
    sellOption.className = "context-menu-option";
    sellOption.textContent = "Sell";
    contextMenu.appendChild(sellOption);
    document.body.appendChild(contextMenu);
    document.addEventListener("contextmenu", (e) => {
      const plant = e.target.closest(".harvested-plant");
      const food = e.target.closest(".cooked-food");
      const item = plant ?? food;
      if (!item) {
        return;
      }
      e.preventDefault();
      showContextMenu(e.clientX, e.clientY, item);
    });
    sellOption.addEventListener("click", () => {
      if (!contextMenuTarget) {
        return;
      }
      const target = contextMenuTarget;
      hideContextMenu();
      if (target.classList.contains("harvested-plant")) {
        sellItem(target, target.dataset.species, void 0);
        game.greenhouse.consumeHarvestedPlant(target);
      } else if (target.classList.contains("cooked-food")) {
        sellItem(target, void 0, target.dataset.recipeKey);
        game.greenhouse.consumeCookedFood(target);
      }
    });
    document.addEventListener("click", () => hideContextMenu());
    document.addEventListener("contextmenu", (e) => {
      const item = e.target.closest(".harvested-plant, .cooked-food");
      if (!item) {
        hideContextMenu();
      }
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
            const species1 = entries[0].plant.dataset.species ?? "";
            const species2 = entries[1].plant.dataset.species ?? "";
            const recipeKey = [species1, species2].sort().join("+");
            entries.forEach(({ plant: p, slot: s }) => {
              s.remove();
              p.classList.remove("in-pot");
              game.greenhouse.consumeHarvestedPlant(p);
            });
            potContents.length = 0;
            potImg.src = potImg.dataset.closedSrc;
            potActive = false;
            overlay.hidden = true;
            syncPotUI();
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
                if (cookBtn) {
                  cookBtn.disabled = false;
                }
                potImg.src = potImg.dataset.openSrc;
                const recipe = RECIPES[recipeKey];
                if (recipe) {
                  const foodBase = document.getElementById("inventory-bottom-right")?.dataset.foodBase ?? "";
                  const foodRow = document.getElementById("food-row");
                  if (foodRow) {
                    foodRow.hidden = false;
                  }
                  game.greenhouse.addCookedFood(recipeKey, recipe.name, `${foodBase}/${recipe.filename}`);
                  vscode.postMessage({ type: "cooked", recipeKey, species: [species1, species2] });
                }
              }, { once: true });
            }
          }
        }, { once: true });
      });
    });
  }
  var updateOverlay2;
  var updateCookButton2;
  var syncPotUI2;
  var plantPotCount2;
  var plantInventoryCount2;
  var refreshHighlights2;
  var addToPot2;
  var removeFromPot2;
  var showContextMenu2;
  var hideContextMenu2;
  setInterval(update, 1e3 / game.fps);
  vscode.postMessage({ type: "init" });
})();
//# sourceMappingURL=webview.js.map
