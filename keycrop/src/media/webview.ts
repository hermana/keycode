interface VsCodeApi {
  postMessage(msg: unknown): void;
}

declare function acquireVsCodeApi(): VsCodeApi;

const NUM_MILLISECONDS_ALLOWED_BETWEEN_KEY_USES: number = 0; //30000; // 30 seconds


class Greenhouse {
  plants: Plant[] = [];

  constructor() {
  }

  addPlant(species: string): void {
    this.plants.push(new Plant(species));
  }

  grow(species: string): void {
    this.plants.forEach(plant => {
      if (plant.species === species) { plant.grow(); }
    });
  }

  loadPlant(message: any): void {
    let p = new Plant(message.species);
    p.setSize(message.size);
    p.setIsHarvested(message.harvested);
    p.setHotKeyUses(message.hotkey_uses);
    this.plants.push(p);
  }

 }

const vscode: VsCodeApi = acquireVsCodeApi();

interface GameState {
  div: HTMLElement;
  width: number;
  height: number;
  scale: number;
  frames: number;
  fps: number;
  greenhouse: Greenhouse; 
  // plants: Plant[];
}

const game: GameState = {
  div: document.getElementById('keycrop') as HTMLElement,
  width: window.innerWidth,
  height: window.innerHeight,
  scale: 2,
  frames: 0,
  fps: 30,
  greenhouse: new Greenhouse(),
  //plants: []
};


class Plant {
  constructor(species: string) {
    this.init(species);
  }
  _init = false;
  _species = '';
  get species(): string { return this._species; }
  _size = '';
  get size(): string { return this._size; }
  _html_element!: HTMLElement;
  get html_element(): HTMLElement { return this._html_element; }
  _num_hotkey_uses = 0;
  get num_hotkey_uses(): number { return this._num_hotkey_uses; }
  _last_key_use: number = Date.now();
  get last_key_use(): number { return this._last_key_use; }
  _num_mashes = 0;
  get num_mashes(): number { return this._num_mashes; }

  init(species: string): void {
    //Already initialized
    if (this._init) {
      return;
    }

    //TODO: error handling if no type?
    if (species === '') {
      return;
    }
    this._species = species;
    this._size = 'start';

    //Create plant element
    const element = document.createElement('div');
    game.div.appendChild(element);
    this._html_element = element;

    //Add classes & move to random point
    element.classList.add('plant');
    element.classList.add(this.species);
    element.classList.add(this.size);

    //Add plant to game plants list
    //game.plants.push(this);
  }

  grow(): void {
    //check for mashing
    const now = Date.now();
    if (now - this._last_key_use > NUM_MILLISECONDS_ALLOWED_BETWEEN_KEY_USES) {
      this._num_hotkey_uses += 1;
      this._last_key_use = now;
      if (this._num_hotkey_uses > 8 && this._html_element.classList.contains('harvested-plant')) {
        vscode.postMessage({ type: 'harvested', text: this.species });
      } else if (this._num_hotkey_uses > 4) {
        this._html_element.classList.remove('plant');
        this._html_element.classList.add('harvested-plant');
        this._html_element.hidden = true;
        vscode.postMessage({ type: 'harvested', text: this.species });
      } else if (this._num_hotkey_uses > 3) {
        this._size = 'large';
        this._html_element.classList.remove('medium');
        this._html_element.classList.add(this._size);
      } else if (this._num_hotkey_uses > 2) {
        this._size = 'medium';
        this._html_element.classList.remove('small');
        this._html_element.classList.add(this._size);
      } else if (this._num_hotkey_uses > 1) {
        this._size = 'small';
        this._html_element.classList.remove('start');
        this._html_element.classList.add(this._size);
      }
    } else {
      this._num_mashes += 1;
    }
  }

  setSize(s: string): void {
    this._size = s; //FIXME: am I really doing anything with this?
    this._html_element.classList.remove('start');
    this._html_element.classList.remove('small');
    this._html_element.classList.remove('medium');
    this._html_element.classList.remove('large');
    this._html_element.classList.add(this._size);
  }

  setIsHarvested(h: boolean): void {
    if (h) {
      this._html_element.classList.remove('plant');
      this._html_element.classList.add('harvested-plant');
      this._html_element.hidden = game.div.getAttribute('background') === 'inventory' ? false : true;
    } else {
      this._html_element.classList.remove('harvested-plant');
      this._html_element.classList.add('plant');
      this._html_element.hidden = game.div.getAttribute('background') === 'inventory' ? true : false;
    }
  }

  setHotKeyUses(n: number): void {
    this._num_hotkey_uses = n;
  }
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
      game.greenhouse.addPlant(message.species);
      break;
    case 'grow':
      game.greenhouse.grow(message.species); 
      checkAcheivements();
      break;
    case 'save_plants': {
      const plantsString = getPlantsString();
      vscode.postMessage({ type: 'save_plants', content: plantsString });
      break;
    }
    case 'load':
      game.greenhouse.loadPlant(message);
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
  const currentPlants = [...new Set(game.greenhouse.plants)];
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
