interface VsCodeApi {
  postMessage(msg: unknown): void;
}

declare function acquireVsCodeApi(): VsCodeApi;

const NUM_MILLISECONDS_ALLOWED_BETWEEN_KEY_USES: number = 0; //30000; // 30 seconds

const LEVEL_ONE: string[] = [
  'tomato',
  'broccoli',
  'lettuce',
  'bean',
  'chili'
];

const vscode: VsCodeApi = acquireVsCodeApi();

interface GameState {
  div: HTMLElement;
  width: number;
  height: number;
  scale: number;
  frames: number;
  fps: number;
  plants: Plant[];
}

const game: GameState = {
  div: document.getElementById('keycrop') as HTMLElement,
  width: window.innerWidth,
  height: window.innerHeight,
  scale: 2,
  frames: 0,
  fps: 30,
  plants: []
};


class Plant {
  #init = false;
  #species = '';
  get species(): string { return this.#species; }
  #size = '';
  get size(): string { return this.#size; }
  #html_element!: HTMLElement;
  get html_element(): HTMLElement { return this.#html_element; }
  #num_hotkey_uses = 0;
  get num_hotkey_uses(): number { return this.#num_hotkey_uses; }
  #last_key_use: number = Date.now();
  get last_key_use(): number { return this.#last_key_use; }
  #num_mashes = 0;
  get num_mashes(): number { return this.#num_mashes; }

  constructor() {}

  //Init
  init(species: string): void {
    //Already initialized
    if (this.#init) {
      return;
    }

    //TODO: error handling if no type?
    if (species === '') {
      return;
    }
    this.#species = species;
    this.#size = 'start';

    //Create plant element
    const element = document.createElement('div');
    game.div.appendChild(element);
    this.#html_element = element;

    //Add classes & move to random point
    element.classList.add('plant');
    element.classList.add(this.species);
    element.classList.add(this.size);

    //Add plant to game plants list
    game.plants.push(this);
  }

  grow(): void {
    //check for mashing
    const now = Date.now();
    if (now - this.#last_key_use > NUM_MILLISECONDS_ALLOWED_BETWEEN_KEY_USES) {
      this.#num_hotkey_uses += 1;
      this.#last_key_use = now;
      if (this.#num_hotkey_uses > 8 && this.#html_element.classList.contains('harvested-plant')) {
        vscode.postMessage({ type: 'harvested', text: this.species });
      } else if (this.#num_hotkey_uses > 4) {
        this.#html_element.classList.remove('plant');
        this.#html_element.classList.add('harvested-plant');
        this.#html_element.hidden = true;
        vscode.postMessage({ type: 'harvested', text: this.species });
      } else if (this.#num_hotkey_uses > 3) {
        this.#size = 'large';
        this.#html_element.classList.remove('medium');
        this.#html_element.classList.add(this.#size);
      } else if (this.#num_hotkey_uses > 2) {
        this.#size = 'medium';
        this.#html_element.classList.remove('small');
        this.#html_element.classList.add(this.#size);
      } else if (this.#num_hotkey_uses > 1) {
        this.#size = 'small';
        this.#html_element.classList.remove('start');
        this.#html_element.classList.add(this.#size);
      }
    } else {
      this.#num_mashes += 1;
    }
  }

  setSize(s: string): void {
    this.#size = s; //FIXME: am I really doing anything with this?
    this.#html_element.classList.remove('start');
    this.#html_element.classList.remove('small');
    this.#html_element.classList.remove('medium');
    this.#html_element.classList.remove('large');
    this.#html_element.classList.add(this.#size);
  }

  setIsHarvested(h: boolean): void {
    if (h) {
      this.#html_element.classList.remove('plant');
      this.#html_element.classList.add('harvested-plant');
      this.#html_element.hidden = game.div.getAttribute('background') === 'inventory' ? false : true;
    } else {
      this.#html_element.classList.remove('harvested-plant');
      this.#html_element.classList.add('plant');
      this.#html_element.hidden = game.div.getAttribute('background') === 'inventory' ? true : false;
    }
  }

  setHotKeyUses(n: number): void {
    this.#num_hotkey_uses = n;
  }
}


class Corn extends Plant {
  constructor() { super(); this.init('corn'); }
}

class Strawberry extends Plant {
  constructor() { super(); this.init('strawberry'); }
}

class Mango extends Plant {
  constructor() { super(); this.init('mango'); }
}

class Poppy extends Plant {
  constructor() { super(); this.init('poppy'); }
}

class Sunflower extends Plant {
  constructor() { super(); this.init('sunflower'); }
}

class SnapPea extends Plant {
  constructor() { super(); this.init('snappea'); }
}

class Okra extends Plant {
  constructor() { super(); this.init('okra'); }
}

class Carrot extends Plant {
  constructor() { super(); this.init('carrot'); }
}

class Canola extends Plant {
  constructor() { super(); this.init('canola'); }
}

class AppleTree extends Plant {
  constructor() { super(); this.init('apple_tree'); }
}

class CherryTree extends Plant {
  constructor() { super(); this.init('cherry_tree'); }
}

class SphagettiFern extends Plant {
  constructor() { super(); this.init('sphagettifern'); }
}


//Messages from VSCode
window.addEventListener('message', (event: MessageEvent) => {
  const message = event.data;
  switch (message.action) {
    case 'key-tracking-mode':
      hideGameElements();
      break;
    case 'background':
      game.div.setAttribute('background', message.value);
      if (message.value === 'blackout') {
        hideGameElements();
      }
      break;
    case 'add':
      switch (message.species) {
        case 'corn':
          game.plants.push(new Corn());
          break;
        case 'strawberry':
          game.plants.push(new Strawberry());
          break;
        case 'mango':
          game.plants.push(new Mango());
          break;
        case 'poppy':
          game.plants.push(new Poppy());
          break;
        case 'sunflower':
          game.plants.push(new Sunflower());
          break;
        case 'snappea':
          game.plants.push(new SnapPea());
          break;
        case 'sphagettifern':
          game.plants.push(new SphagettiFern());
          break;
        case 'okra':
          game.plants.push(new Okra());
          break;
        case 'carrot':
          game.plants.push(new Carrot());
          break;
        case 'canola':
          game.plants.push(new Canola());
          break;
        case 'apple_tree':
          game.plants.push(new AppleTree());
          break;
        case 'cherry_tree':
          game.plants.push(new CherryTree());
          break;
      }
      break;
    case 'grow':
      switch (message.species) {
        case 'corn':
          game.plants.forEach(plant => {
            if (plant.species === 'corn') { plant.grow(); }
          });
          checkAcheivements();
          break;
        case 'mango':
          game.plants.forEach(plant => {
            if (plant.species === 'mango') { plant.grow(); }
          });
          checkAcheivements();
          break;
        case 'strawberry':
          game.plants.forEach(plant => {
            if (plant.species === 'strawberry') { plant.grow(); }
          });
          checkAcheivements();
          break;
        case 'poppy':
          game.plants.forEach(plant => {
            if (plant.species === 'poppy') { plant.grow(); }
          });
          checkAcheivements();
          break;
        case 'sunflower':
          game.plants.forEach(plant => {
            if (plant.species === 'sunflower') { plant.grow(); }
          });
          checkAcheivements();
          break;
        case 'canola':
          game.plants.forEach(plant => {
            if (plant.species === 'canola') { plant.grow(); }
          });
          checkAcheivements();
          break;
        case 'snappea':
          game.plants.forEach(plant => {
            if (plant.species === 'snappea') { plant.grow(); }
          });
          checkAcheivements();
          break;
        case 'okra':
          game.plants.forEach(plant => {
            if (plant.species === 'okra') { plant.grow(); }
          });
          checkAcheivements();
          break;
        case 'carrot':
          game.plants.forEach(plant => {
            if (plant.species === 'carrot') { plant.grow(); }
          });
          checkAcheivements();
          break;
        case 'cherry_tree':
          game.plants.forEach(plant => {
            if (plant.species === 'cherry_tree') { plant.grow(); }
          });
          checkAcheivements();
          break;
        case 'apple_tree':
          game.plants.forEach(plant => {
            if (plant.species === 'apple_tree') { plant.grow(); }
          });
          checkAcheivements();
          break;
        case 'sphagettifern':
          game.plants.forEach(plant => {
            if (plant.species === 'sphagettifern') { plant.grow(); }
          });
          checkAcheivements();
          break;
      }
      break;
    case 'save_plants': {
      const plantsString = getPlantsString();
      vscode.postMessage({ type: 'save_plants', content: plantsString });
      break;
    }
    case 'load':
      switch (message.species) {
        case 'corn': {
          const corn = new Corn();
          corn.setSize(message.size);
          corn.setIsHarvested(message.harvested);
          corn.setHotKeyUses(message.hotkey_uses);
          game.plants.push(corn);
          break;
        }
        case 'strawberry': {
          const strawberry = new Strawberry();
          strawberry.setSize(message.size);
          strawberry.setIsHarvested(message.harvested);
          strawberry.setHotKeyUses(message.hotkey_uses);
          game.plants.push(strawberry);
          break;
        }
        case 'mango': {
          const mango = new Mango();
          mango.setSize(message.size);
          mango.setIsHarvested(message.harvested);
          mango.setHotKeyUses(message.hotkey_uses);
          game.plants.push(mango);
          break;
        }
        case 'poppy': {
          const poppy = new Poppy();
          poppy.setSize(message.size);
          poppy.setIsHarvested(message.harvested);
          poppy.setHotKeyUses(message.hotkey_uses);
          game.plants.push(poppy);
          break;
        }
        case 'sunflower': {
          const sunflower = new Sunflower();
          sunflower.setSize(message.size);
          sunflower.setIsHarvested(message.harvested);
          sunflower.setHotKeyUses(message.hotkey_uses);
          game.plants.push(sunflower);
          break;
        }
        case 'snappea': {
          const snappea = new SnapPea();
          snappea.setSize(message.size);
          snappea.setIsHarvested(message.harvested);
          snappea.setHotKeyUses(message.hotkey_uses);
          game.plants.push(snappea);
          break;
        }
        case 'sphagettifern': {
          const sphagettifern = new SphagettiFern();
          sphagettifern.setSize(message.size);
          sphagettifern.setIsHarvested(message.harvested);
          sphagettifern.setHotKeyUses(message.hotkey_uses);
          game.plants.push(sphagettifern);
          break;
        }
        case 'canola': {
          const canola = new Canola();
          canola.setSize(message.size);
          canola.setIsHarvested(message.harvested);
          canola.setHotKeyUses(message.hotkey_uses);
          game.plants.push(canola);
          break;
        }
        case 'okra': {
          const okra = new Okra();
          okra.setSize(message.size);
          okra.setIsHarvested(message.harvested);
          okra.setHotKeyUses(message.hotkey_uses);
          game.plants.push(okra);
          break;
        }
        case 'carrot': {
          const carrot = new Carrot();
          carrot.setSize(message.size);
          carrot.setIsHarvested(message.harvested);
          carrot.setHotKeyUses(message.hotkey_uses);
          game.plants.push(carrot);
          break;
        }
        case 'apple_tree': {
          const apple_tree = new AppleTree();
          apple_tree.setSize(message.size);
          apple_tree.setIsHarvested(message.harvested);
          apple_tree.setHotKeyUses(message.hotkey_uses);
          game.plants.push(apple_tree);
          break;
        }
        case 'cherry_tree': {
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
    case 'scale':
      switch (message.value.toLowerCase()) {
        case 'small':
          game.scale = 1;
          break;
        case 'medium':
        default:
          game.scale = 2;
          break;
        case 'big':
          game.scale = 3;
          break;
      }
      document.body.style.setProperty('--scale', String(game.scale));
      onResize();
      break;
  }
});


function checkAcheivements(): void {
  //check that there is one of each of the "level one"
  let levelOneChecklist = 0;
  //FIXME: I'm not sure why there were duplicates in the list.
  const currentPlants = [...new Set(game.plants)];
  currentPlants.forEach(plant => {
    if (plant.html_element.classList.contains('harvested-plant')) {
      if (LEVEL_ONE.includes(plant.species)) {
        levelOneChecklist += 1;
      }
    }
  });
  if (LEVEL_ONE.length === levelOneChecklist) {
    vscode.postMessage({ type: 'level_one' });
  }
}

function hideGameElements(): void {
  (document.getElementById('generator-button') as HTMLElement).hidden = true;
  (document.getElementById('greenhouse-button') as HTMLElement).hidden = true;
}

//TODO: do I need a resize at all
function onResize(): void {
  game.width = window.innerWidth;
  game.height = window.innerHeight;
}


function getPlantsString(): object[] {
  const plantsString: object[] = [];
  //FIXME: why do I have to do this? I'm double adding plants somewhere
  const currentPlants = [...new Set(game.plants)];
  if (currentPlants.length > 0) {
    currentPlants.forEach(plant => {
      const harvested = plant.html_element.classList.contains('harvested-plant');
      const plantString = {
        'species': plant.species,
        'size': plant.size,
        'harvested': harvested,
        'hotkey_uses': plant.num_hotkey_uses,
        'num_mashes': plant.num_mashes
      };
      plantsString.push(plantString);
    });
  }
  return plantsString;
}


function update(): void {
  if (game.width !== window.innerWidth || game.height !== window.innerHeight) {
    onResize();
  }
  game.frames++;
}


//Start loop
const timer = setInterval(update, 1000 / game.fps);

//Tell vscode game loaded
//TODO: type or action here?
vscode.postMessage({ type: 'init' });
