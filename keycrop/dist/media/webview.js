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
          vscode2.postMessage({ type: "harvested", text: this.species, key: this._key });
        } else if (this._num_hotkey_uses > 14) {
          this._html_element.classList.remove("plant");
          this._html_element.classList.add("harvested-plant");
          this._html_element.hidden = true;
          vscode2.postMessage({ type: "harvested", text: this.species, key: this._key });
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
    updateBadgeDisplay() {
      this._badge_element.textContent = String(this._count);
      this._price_badge_element.textContent = `$${this._price * this._count}`;
    }
    incrementCount() {
      this._count += 1;
      this.updateBadgeDisplay();
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
    ivy: { price: 25, category: "decorative" },
    jacaranda_tree: { price: 25, category: "decorative" },
    raspberry: { price: 4, category: "fruit" },
    strawberry: { price: 4, category: "fruit" },
    watermelon: { price: 4, category: "fruit" },
    glowberry: { price: 50, category: "exotic" },
    bulbino: { price: 50, category: "exotic" },
    poison_cabbage: { price: 50, category: "exotic" },
    neon_mould: { price: 50, category: "exotic" }
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
      this.updateBadgeDisplay();
      this._html_element.classList.remove("in-pot");
      return false;
    }
  };

  // src/media/recipes.ts
  var RECIPES = {
    "bean+bean": { filename: "bean_bean.png", name: "Refried Beans", price: 6 },
    "bean+lettuce": { filename: "bean_lettuce.png", name: "Bean Salad", price: 6 },
    "bean+broccoli": { filename: "bean_broccoli.png", name: "Vegetable Stir Fry", price: 6 },
    "bean+bulbino": { filename: "bean_bulbino.png", name: "Farmer Bulbino", price: 70 },
    "bean+chili": { filename: "chili_bean.png", name: "Spicy Bean Jar", price: 6 },
    "bean+glowberry": { filename: "glowberry_beans.png", name: "Glowing Bean Salad", price: 70 },
    "bean+ivy": { filename: "beans_ivy.png", name: "Decorative Pickled Beans", price: 20 },
    "bean+jacaranda_tree": { filename: "bean_jacaranda.png", name: "Purple Pickled Beans", price: 20 },
    "bean+neon_mould": { filename: "bean_neon_mould.png", name: "Indestructible Beans", price: 70 },
    "bean+poison_cabbage": { filename: "bean_poison_cabbage.png", name: "Deadly Bean Soup", price: 70 },
    "bean+raspberry": { filename: "bean_raspberry.png", name: "Experimental Vegetable Medley", price: 10 },
    "bean+rhubarb": { filename: "bean_rhubarb.png", name: "Pickled Beans with Rhubarb Chunks", price: 6 },
    "bean+strawberry": { filename: "bean_strawberry.png", name: "Strawberry Flavoured Can of Beans", price: 10 },
    "bean+tomato": { filename: "bean-tomato.png", name: "Spring Vegetable Medley", price: 6 },
    "bean+watermelon": { filename: "bean_watermelon.png", name: "Summer Beans", price: 10 },
    "broccoli+broccoli": { filename: "broccoli_broccoli.png", name: "Broccolini", price: 6 },
    "broccoli+bulbino": { filename: "broccoli_bulbino.png", name: "Broccoli-haired Bulbino", price: 70 },
    "broccoli+chili": { filename: "broccoli_chili.png", name: "Spicy Charred Broccoli", price: 6 },
    "broccoli+glowberry": { filename: "broccoli_glowberry.png", name: "Spellbound stir-fry", price: 70 },
    "broccoli+ivy": { filename: "broccoli_ivy.png", name: "Broccoli Crown", price: 20 },
    "broccoli+jacaranda_tree": { filename: "jacaranda_broccoli.png", name: "Texas-sized Purple Broccoli", price: 20 },
    "broccoli+lettuce": { filename: "lettuce_broccoli.png", name: "Green Crunch Salad", price: 6 },
    "broccoli+neon_mould": { filename: "broccoli_neon_mould.png", name: "Green Mould Soup", price: 70 },
    "broccoli+poison_cabbage": { filename: "broccoli_poison_cabbage.png", name: "Scary Roasted Broccoli", price: 70 },
    "broccoli+raspberry": { filename: "broccoli_raspberry.png", name: "Tangy Vegetable Medley", price: 10 },
    "broccoli+rhubarb": { filename: "broccoli_rhubarb.png", name: "Broccoli Salad with Rhubarb Dressing", price: 6 },
    "broccoli+strawberry": { filename: "broccoli_strawberries.png", name: "Fruit and Vegetable Slaw", price: 10 },
    "broccoli+tomato": { filename: "broccoli_tomato.png", name: "Macaroni Salad with Veggies", price: 6 },
    "broccoli+watermelon": { filename: "broccoli_watermelon.png", name: "Green Gazpacho", price: 10 },
    "bulbino+bulbino": { filename: "bulbino-bulbino.png", name: "Royal Bulbino", price: 100 },
    "bulbino+raspberry": { filename: "raspberry_bulbino.png", name: "Berry Bulbino", price: 100 },
    "bulbino+chili": { filename: "chili_bulbino.png", name: "Flame Bulbino", price: 100 },
    "bulbino+glowberry": { filename: "glowberry_bulbino.png", name: "Blue Bulbino", price: 100 },
    "bulbino+ivy": { filename: "bulbino_ivy.png", name: "Fancy Bulbino", price: 100 },
    "bulbino+jacaranda_tree": { filename: "bulbino_jacaranda.png", name: "Purple Bulbino", price: 100 },
    "bulbino+lettuce": { filename: "bulbino_lettuce.png", name: "Bunny Bulbino", price: 100 },
    "bulbino+neon_mould": { filename: "bulbino_neon_mould.png", name: "Neon Bulbino", price: 100 },
    "bulbino+poison_cabbage": { filename: "bulbino_poison_cabbage.png", name: "Sinister Bulbino", price: 100 },
    "bulbino+rhubarb": { filename: "bulbino_rhubarb.png", name: "Rustic Bulbino", price: 100 },
    "bulbino+strawberry": { filename: "bulbino_strawberry.png", name: "Sweet Bulbino", price: 100 },
    "bulbino+tomato": { filename: "bulbino_tomato.png", name: "Bulbino with Spaghetti", price: 100 },
    "bulbino+watermelon": { filename: "bulbino_watermelon.png", name: "Summer Bulbino", price: 100 },
    "chili+chili": { filename: "chili-chili.png", name: "Chili Flakes", price: 6 },
    "chili+glowberry": { filename: "chili_glowberry.png", name: "Blue Chili Jam", price: 70 },
    "chili+ivy": { filename: "chili_ivy.png", name: "Decorative Pickled Peppers", price: 20 },
    "chili+jacaranda_tree": { filename: "chili_jacaranda.png", name: "Purple Pickled Peppers", price: 20 },
    "chili+lettuce": { filename: "chili_lettuce.png", name: "Spicy Lettuce Bowl", price: 6 },
    "chili+neon_mould": { filename: "chili_neon_mould.png", name: "Radioactive Salsa", price: 70 },
    "chili+poison_cabbage": { filename: "chili_poison_cabbage.png", name: "Hot Mystery Cabbage Soup", price: 70 },
    "chili+raspberry": { filename: "chili_raspberry.png", name: "Fruit Salsa", price: 10 },
    "chili+rhubarb": { filename: "chili_rhubarb.png", name: "Spicy Rhubarb Margarita", price: 6 },
    "chili+strawberry": { filename: "chili_strawberry.png", name: "Spicy Strawberry Preserve", price: 10 },
    "chili+tomato": { filename: "tomato_chili.png", name: "Hot Salsa", price: 6 },
    "chili+watermelon": { filename: "chili_watermelon.png", name: "Spicy Watermelon Lemonade", price: 10 },
    "glowberry+glowberry": { filename: "glowberry-glowberry.png", name: "Glowsticks", price: 100 },
    "glowberry+ivy": { filename: "glowerry_ivy.png", name: "Glowberry Tart with Garnish", price: 80 },
    "glowberry+jacaranda_tree": { filename: "glowberry_jacaranda.png", name: "Purple Raspberry Lavender Iced Tea", price: 80 },
    "glowberry+lettuce": { filename: "lettuce_glowberry.png", name: "Divine Salad", price: 100 },
    "glowberry+neon_mould": { filename: "glowberry_neon_mould.png", name: "Gossamer Berry", price: 80 },
    "glowberry+poison_cabbage": { filename: "glowberry_poison_cabbage.png", name: "Midnight Coleslaw", price: 80 },
    "glowberry+raspberry": { filename: "raspberry_glowberry.png", name: "Berry Sorbet", price: 80 },
    "glowberry+rhubarb": { filename: "glowberry_rhubarb.png", name: "Florescent Rhubarb Pie", price: 100 },
    "glowberry+strawberry": { filename: "glowberry_strawberry.png", name: "Sparkling Lemonade", price: 80 },
    "glowberry+tomato": { filename: "tomato_glowberry.png", name: "Enchanted Salsa", price: 70 },
    "glowberry+watermelon": { filename: "watermelon_glowberry.png", name: "Tropical Slush", price: 80 },
    "ivy+ivy": { filename: "ivy-ivy.png", name: "Leafy Party Hat", price: 80 },
    "ivy+jacaranda_tree": { filename: "jacaranda_ivy.png", name: "Violet Wreath", price: 80 },
    "ivy+lettuce": { filename: "lettuce_ivy.png", name: "Fancy Salad", price: 70 },
    "ivy+neon_mould": { filename: "neon_mould_ivy.png", name: "Glowing garland", price: 80 },
    "ivy+poison_cabbage": { filename: "ivy_poison_cabbage.png", name: "Poison Slaw with Fancy Garnish", price: 80 },
    "ivy+raspberry": { filename: "ivy_raspberry.png", name: "Decorative Raspberry Crumble", price: 30 },
    "ivy+rhubarb": { filename: "ivy_rhubarb.png", name: "Fancy Rhubarb Punch", price: 70 },
    "ivy+strawberry": { filename: "ivy_strawberry.png", name: "Strawberry Lemonade with Decorative Leaf", price: 30 },
    "ivy+tomato": { filename: "tomato_ivy.png", name: "Decorative Vine Tomatoes", price: 20 },
    "ivy+watermelon": { filename: "watermelon_ivy.png", name: "Watermelon Punch with Decorate Leaf", price: 30 },
    "jacaranda_tree+jacaranda_tree": { filename: "jacaranda-jacaranda.png", name: "Purple Pi\xF1ata", price: 80 },
    "jacaranda_tree+lettuce": { filename: "lettuce_jacaranda.png", name: "Purple Salad", price: 70 },
    "jacaranda_tree+neon_mould": { filename: "jacaranda_neon_mould.png", name: "Fairy Dust", price: 36 },
    "jacaranda_tree+poison_cabbage": { filename: "poison_cabbage_jacaranda.png", name: "Poison Purple Pho", price: 80 },
    "jacaranda_tree+raspberry": { filename: "raspberry_jacaranda.png", name: "Purple Raspberry Souffl\xE9", price: 30 },
    "jacaranda_tree+rhubarb": { filename: "rhubarb_jacaranda.png", name: "Purple Rhubarb Crumble", price: 70 },
    "jacaranda_tree+strawberry": { filename: "strawberry_jacaranda.png", name: "Purple Strawberry Pie", price: 30 },
    "jacaranda_tree+tomato": { filename: "tomato_jacaranda.png", name: "Tomato Soup with Edible Flowers", price: 20 },
    "jacaranda_tree+watermelon": { filename: "jacaranda_watermelon.png", name: "Purple Watermelon Lemonade", price: 30 },
    "lettuce+lettuce": { filename: "lettuce_lettuce.png", name: "Bowl of Lettuce", price: 6 },
    "lettuce+neon_mould": { filename: "neon_mould_lettuce.png", name: "Radioactive Salad", price: 70 },
    "lettuce+poison_cabbage": { filename: "poison_cabbage_lettuce.png", name: "Noxious Coleslaw", price: 70 },
    "lettuce+raspberry": { filename: "raspberry_lettuce.png", name: "Tangy Fruit Salad", price: 10 },
    "lettuce+rhubarb": { filename: "lettuce_rhubarb.png", name: "Mixed Greens with Rhubarb Vinagrette", price: 6 },
    "lettuce+strawberry": { filename: "strawberry_lettuce.png", name: "Pink Salad", price: 10 },
    "lettuce+tomato": { filename: "tomato_lettuce.png", name: "Garden Salad", price: 6 },
    "lettuce+watermelon": { filename: "lettuce_watermelon.png", name: "Glass of Water", price: 10 },
    "neon_mould+neon_mould": { filename: "neon_mould-neon_mould.png", name: "Alien Creature", price: 80 },
    "neon_mould+poison_cabbage": { filename: "neon_mould_poison_cabbage.png", name: "Nuclear Waste", price: 80 },
    "neon_mould+raspberry": { filename: "neon_mould_raspberry.png", name: "Neon Raspberry Lemonade", price: 80 },
    "neon_mould+rhubarb": { filename: "neon_mould_rhubarb.png", name: "Neon Rhubarb Punch", price: 100 },
    "neon_mould+strawberry": { filename: "neon_mould_strawberry.png", name: "Neon Strawberry Sorbet", price: 80 },
    "neon_mould+tomato": { filename: "tomato_neon_mould.png", name: "Strangely Glowing Rotten Tomato", price: 70 },
    "neon_mould+watermelon": { filename: "neon_mould_watermelon.png", name: "Neon Granita", price: 80 },
    "poison_cabbage+poison_cabbage": { filename: "poison_cabbage-poison_cabbage.png", name: "Deadly Potion", price: 80 },
    "poison_cabbage+raspberry": { filename: "raspberry_poison_cabbage.png", name: "Disgusting Tart", price: 80 },
    "poison_cabbage+rhubarb": { filename: "rhubarb_poison_cabbage.png", name: "Poison Red Coleslaw", price: 100 },
    "poison_cabbage+strawberry": { filename: "strawberry_cabbage.png", name: "Strawberry Cabbage Sludge", price: 80 },
    "poison_cabbage+tomato": { filename: "tomato_poison_cabbage.png", name: "Sentient Cabbage Rolls", price: 70 },
    "poison_cabbage+watermelon": { filename: "watermelon_poison_cabbage.png", name: "Putrid Watermelon", price: 80 },
    "raspberry+raspberry": { filename: "raspberry-raspberry.png", name: "Raspberry Syrup", price: 16 },
    "raspberry+rhubarb": { filename: "raspberry_rhubarb.png", name: "Raspberry Rhubarb Crumble", price: 10 },
    "raspberry+strawberry": { filename: "raspberry_strawberry.png", name: "Berry Bowl", price: 16 },
    "raspberry+tomato": { filename: "tomato_raspberry.png", name: "Tangy Gazpacho", price: 10 },
    "raspberry+watermelon": { filename: "raspberry_watermelon.png", name: "Raspberry Watermelon Splash", price: 16 },
    "rhubarb+rhubarb": { filename: "rhubarb-rhubarb.png", name: "Rhubarb Jam", price: 6 },
    "rhubarb+strawberry": { filename: "strawberry_rhubarb.png", name: "Strawberry Rhubarb Pie", price: 10 },
    "rhubarb+tomato": { filename: "tomato_rhubarb.png", name: "Tomato Rhubarb Chutney", price: 6 },
    "rhubarb+watermelon": { filename: "watermelon_rhubarb.png", name: "Rhubarb Watermelon Punch", price: 15 },
    "strawberry+strawberry": { filename: "strawberry-strawberry.png", name: "Strawberry Jam", price: 16 },
    "strawberry+tomato": { filename: "tomato_strawberry.png", name: "Tomato-Strawberry Basalmic Vinagrette", price: 10 },
    "strawberry+watermelon": { filename: "strawberry_watermelon.png", name: "Pink Lemonade", price: 16 },
    "tomato+tomato": { filename: "tomato_tomato.png", name: "Passata", price: 6 },
    "tomato+watermelon": { filename: "tomato_watermelon.png", name: "Tomato Watermelon Gazpacho", price: 10 },
    "watermelon+watermelon": { filename: "watermelon-watermelon.png", name: "Agua Fresca", price: 16 }
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
      this.updateBadgeDisplay();
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
    grow(key, vscode2) {
      this.plants.forEach((plant) => {
        if (plant.key === key && !plant.html_element.classList.contains("harvested-plant")) {
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
    consumeHarvestedPlant(element) {
      this.consumeItem(this.harvestedPlants, element);
    }
    consumeCookedFood(element) {
      this.consumeItem(this.cookedFoods, element);
    }
    consumeItem(list, element) {
      const idx = list.findIndex((item) => item._html_element === element);
      if (idx === -1) {
        return;
      }
      if (list[idx].useOne()) {
        list.splice(idx, 1);
      }
    }
    addCookedFood(recipeKey, name, imgSrc, count = 1) {
      const existing = this.cookedFoods.find((f) => f.recipeKey === recipeKey);
      if (existing) {
        existing.incrementCount();
        return;
      }
      this.cookedFoods.push(new CookedFood(recipeKey, name, imgSrc, count));
    }
    serialize() {
      return [...new Set(this.plants)].map((plant) => ({
        key: plant.key,
        species: plant.species,
        size: plant.size,
        harvested: plant.html_element.classList.contains("harvested-plant"),
        hotkey_uses: plant.num_hotkey_uses,
        num_mashes: plant.num_mashes
      }));
    }
  };

  // src/media/sellMenu.ts
  var SellMenu = class {
    constructor(onConfirm) {
      this.onConfirm = onConfirm;
      this.menu = document.createElement("div");
      this.menu.id = "item-context-menu";
      this.menu.hidden = true;
      this.sellOption = document.createElement("div");
      this.sellOption.className = "context-menu-option";
      this.sellOption.textContent = "Sell";
      this.menu.appendChild(this.sellOption);
      document.body.appendChild(this.menu);
      this.sellOption.addEventListener("click", () => this.onSellClick());
      document.addEventListener("click", () => this.hide());
    }
    menu;
    sellOption;
    target = null;
    show(x, y, target) {
      this.target = target;
      const price = parseInt(target.dataset.price ?? "0", 10);
      this.sellOption.textContent = `Sell ($${price})`;
      this.menu.style.left = `${x}px`;
      this.menu.style.top = `${y}px`;
      this.menu.hidden = false;
    }
    hide() {
      this.menu.hidden = true;
      this.target = null;
    }
    onSellClick() {
      if (!this.target) {
        return;
      }
      const target = this.target;
      this.hide();
      this.onConfirm(target);
    }
  };

  // src/media/potController.ts
  var PotController = class {
    constructor(potWrapper2, gameDiv, greenhouse, vscode2, onSell) {
      this.potWrapper = potWrapper2;
      this.gameDiv = gameDiv;
      this.greenhouse = greenhouse;
      this.vscode = vscode2;
      this.onSell = onSell;
      this.overlay = potWrapper2.querySelector(".inventory-pot-overlay");
      this.cookBtn = document.getElementById("cook-btn");
      this.progressWrapper = document.getElementById("cook-progress-wrapper");
      this.progressBar = document.getElementById("cook-progress-bar");
      this.potImg = potWrapper2.querySelector(".inventory-pot");
      this.tray = document.createElement("div");
      this.tray.className = "pot-tray";
      potWrapper2.appendChild(this.tray);
      this.sellMenu = new SellMenu((target) => {
        if (target.classList.contains("harvested-plant")) {
          this.greenhouse.consumeHarvestedPlant(target);
          this.onSell(target, target.dataset.species, void 0);
        } else if (target.classList.contains("cooked-food")) {
          this.greenhouse.consumeCookedFood(target);
          this.onSell(target, void 0, target.dataset.recipeKey);
        }
      });
      this.setupEventListeners();
    }
    overlay;
    cookBtn;
    tray;
    progressWrapper;
    progressBar;
    potImg;
    sellMenu;
    potActive = false;
    potContents = [];
    setupEventListeners() {
      this.potWrapper.addEventListener("click", () => this.onPotWrapperClick());
      this.cookBtn?.addEventListener("click", () => this.startCooking());
      this.gameDiv.addEventListener("click", (e) => this.onGameDivClick(e));
      document.getElementById("food-row")?.addEventListener("click", (e) => this.onFoodRowClick(e));
    }
    // --- Overlay / cook button sync ---
    updateOverlay() {
      this.overlay.textContent = `${this.potContents.length}/${this.greenhouse.NUM_ITEMS_PER_RECIPE}`;
    }
    updateCookButton() {
      if (this.cookBtn) {
        this.cookBtn.hidden = this.potContents.length < this.greenhouse.NUM_ITEMS_PER_RECIPE;
      }
    }
    syncPotUI() {
      this.updateOverlay();
      this.updateCookButton();
      this.refreshHighlights();
    }
    // --- Plant display helpers ---
    plantPotCount(plant) {
      return this.potContents.filter((e) => e.plant === plant).length;
    }
    plantInventoryCount(plant) {
      return this.greenhouse.harvestedPlants.find((p) => p._html_element === plant)?.count ?? 1;
    }
    updatePlantDisplay(plant) {
      const unitPrice = parseInt(plant.dataset.price ?? "0", 10);
      const displayCount = this.plantInventoryCount(plant) - this.plantPotCount(plant);
      plant.querySelector(".plant-count-badge").textContent = String(displayCount);
      plant.querySelector(".price-badge").textContent = `$${unitPrice * displayCount}`;
    }
    refreshHighlights() {
      document.querySelectorAll("#keycrop .harvested-plant").forEach((p) => {
        const canAdd = this.plantPotCount(p) < this.plantInventoryCount(p) && this.potContents.length < this.greenhouse.NUM_ITEMS_PER_RECIPE;
        p.classList.toggle("highlighted", this.potActive && canAdd);
      });
    }
    // --- Tray management ---
    addToPot(plant) {
      if (this.potContents.length >= this.greenhouse.NUM_ITEMS_PER_RECIPE) {
        return;
      }
      const slot = document.createElement("div");
      slot.className = "pot-tray-slot";
      slot.style.backgroundImage = window.getComputedStyle(plant).backgroundImage;
      slot.addEventListener("click", (e) => {
        e.stopPropagation();
        this.removeFromPot(plant, slot);
      });
      this.tray.appendChild(slot);
      this.potContents.push({ plant, slot });
      this.updatePlantDisplay(plant);
      if (this.plantPotCount(plant) >= this.plantInventoryCount(plant)) {
        plant.classList.add("in-pot");
      }
      this.syncPotUI();
    }
    removeFromPot(plant, slot) {
      const idx = this.potContents.findIndex((e) => e.plant === plant);
      if (idx !== -1) {
        this.potContents.splice(idx, 1);
      }
      slot.remove();
      plant.classList.remove("in-pot");
      this.updatePlantDisplay(plant);
      this.syncPotUI();
    }
    // --- Event handlers ---
    onPotWrapperClick() {
      const isCooking = this.progressWrapper && !this.progressWrapper.hidden;
      const hasEnough = this.greenhouse.harvestedPlants.length >= this.greenhouse.NUM_ITEMS_PER_RECIPE;
      if (isCooking || this.potContents.length > 0 || !hasEnough) {
        return;
      }
      this.potActive = !this.potActive;
      this.overlay.hidden = !this.potActive;
      if (this.potActive) {
        this.updateOverlay();
      }
      this.refreshHighlights();
    }
    onGameDivClick(e) {
      const plant = e.target.closest(".harvested-plant");
      if (!plant) {
        return;
      }
      if (this.potActive && this.plantPotCount(plant) < this.plantInventoryCount(plant)) {
        this.addToPot(plant);
      } else if (!this.potActive) {
        e.stopPropagation();
        this.sellMenu.show(e.clientX, e.clientY, plant);
      }
    }
    onFoodRowClick(e) {
      const food = e.target.closest(".cooked-food");
      if (!food) {
        return;
      }
      e.stopPropagation();
      this.sellMenu.show(e.clientX, e.clientY, food);
    }
    // --- Cooking ---
    startCooking() {
      if (this.potContents.length < this.greenhouse.NUM_ITEMS_PER_RECIPE) {
        return;
      }
      if (this.cookBtn) {
        this.cookBtn.disabled = true;
      }
      this.potWrapper.style.pointerEvents = "none";
      const entries = [...this.potContents];
      let completed = 0;
      entries.forEach(({ slot }, i) => {
        slot.style.animationDelay = `${i * 80}ms`;
        slot.classList.add("falling");
        slot.addEventListener("animationend", () => {
          completed++;
          if (completed === entries.length) {
            this.onAllSlotsAnimated(entries);
          }
        }, { once: true });
      });
    }
    onAllSlotsAnimated(entries) {
      const species1 = entries[0].plant.dataset.species ?? "";
      const species2 = entries[1].plant.dataset.species ?? "";
      const recipeKey = [species1, species2].sort().join("+");
      entries.forEach(({ plant: p, slot: s }) => {
        s.remove();
        p.classList.remove("in-pot");
        this.greenhouse.consumeHarvestedPlant(p);
      });
      this.potContents.length = 0;
      this.potImg.src = this.potImg.dataset.closedSrc;
      this.potActive = false;
      this.overlay.hidden = true;
      this.syncPotUI();
      this.potWrapper.style.pointerEvents = "";
      if (this.cookBtn) {
        this.cookBtn.hidden = true;
      }
      this.startProgressBar(recipeKey, species1, species2);
    }
    startProgressBar(recipeKey, species1, species2) {
      if (!this.progressWrapper || !this.progressBar) {
        return;
      }
      this.progressWrapper.hidden = false;
      this.progressBar.style.transition = "none";
      this.progressBar.style.width = "100%";
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          this.progressBar.style.transition = `width ${this.greenhouse.COOK_DURATION_MS}ms linear`;
          this.progressBar.style.width = "0%";
        });
      });
      this.progressBar.addEventListener("transitionend", () => {
        this.onCookComplete(recipeKey, species1, species2);
      }, { once: true });
    }
    onCookComplete(recipeKey, species1, species2) {
      this.progressWrapper.hidden = true;
      if (this.cookBtn) {
        this.cookBtn.disabled = false;
      }
      this.potImg.src = this.potImg.dataset.openSrc;
      const recipe = RECIPES[recipeKey];
      if (recipe) {
        const foodBase = document.getElementById("inventory-bottom-right")?.dataset.foodBase ?? "";
        const foodRow = document.getElementById("food-row");
        if (foodRow) {
          foodRow.hidden = false;
        }
        this.greenhouse.addCookedFood(recipeKey, recipe.name, `${foodBase}/${recipe.filename}`);
        this.vscode.postMessage({ type: "cooked", recipeKey, species: [species1, species2] });
      }
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
  function updateEmptyMessage() {
    const el = document.getElementById("empty-inventory-message");
    if (!el) {
      return;
    }
    el.hidden = game.greenhouse.harvestedPlants.length > 0 || game.greenhouse.cookedFoods.length > 0;
  }
  function sellItem(element, species, recipeKey) {
    const price = parseInt(element.dataset.price ?? "0", 10);
    playerMoney += price;
    updateMoneyDisplay();
    vscode.postMessage({ type: "sell", amount: price, species, recipeKey });
    updateEmptyMessage();
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
        game.greenhouse.grow(message.key, vscode);
        checkAcheivements();
        break;
      case "save_plants":
        vscode.postMessage({ type: "save_plants", content: game.greenhouse.serialize() });
        break;
      case "load":
        game.greenhouse.loadPlant(message, game.div.getAttribute("background"));
        break;
      case "achievement":
        launchConfetti();
        break;
      case "load_harvested":
        game.greenhouse.loadHarvestedPlant(message.species, message.count);
        updateEmptyMessage();
        break;
      case "load_cooked": {
        const recipe = RECIPES[message.recipeKey];
        if (recipe) {
          const foodBase = document.getElementById("inventory-bottom-right")?.dataset.foodBase ?? "";
          const foodRow = document.getElementById("food-row");
          if (foodRow) {
            foodRow.hidden = false;
          }
          game.greenhouse.addCookedFood(message.recipeKey, recipe.name, `${foodBase}/${recipe.filename}`, message.count);
          updateEmptyMessage();
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
  function update() {
    if (game.width !== window.innerWidth || game.height !== window.innerHeight) {
      onResize();
    }
    game.frames++;
  }
  var potWrapper = document.getElementById("inventory-pot-wrapper");
  if (potWrapper) {
    new PotController(potWrapper, game.div, game.greenhouse, vscode, sellItem);
  }
  var plantDetailPanel = document.createElement("div");
  plantDetailPanel.id = "plant-detail";
  plantDetailPanel.hidden = true;
  document.body.appendChild(plantDetailPanel);
  game.div.addEventListener("click", (e) => {
    const plant = e.target.closest(".plant:not(.harvested-plant)");
    if (!plant || !plant.title) {
      return;
    }
    e.stopPropagation();
    plantDetailPanel.textContent = plant.title;
    plantDetailPanel.style.left = `${e.clientX + 8}px`;
    plantDetailPanel.style.top = `${e.clientY + 8}px`;
    plantDetailPanel.hidden = false;
  });
  document.addEventListener("click", () => {
    plantDetailPanel.hidden = true;
  });
  setInterval(update, 1e3 / game.fps);
  vscode.postMessage({ type: "init" });
})();
//# sourceMappingURL=webview.js.map
