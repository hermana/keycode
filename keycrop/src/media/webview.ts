import { Greenhouse } from './greenhouse';

interface VsCodeApi {
  postMessage(msg: unknown): void;
}

declare function acquireVsCodeApi(): VsCodeApi;

const vscode: VsCodeApi = acquireVsCodeApi();

interface GameState {
  div: HTMLElement;
  width: number;
  height: number;
  scale: number;
  frames: number;
  fps: number;
  greenhouse: Greenhouse;
}

const game: GameState = {
  div: document.getElementById('keycrop') as HTMLElement,
  width: window.innerWidth,
  height: window.innerHeight,
  scale: 2,
  frames: 0,
  fps: 30,
  greenhouse: new Greenhouse(),
};


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
      game.greenhouse.addPlant(message.key,message.species);
      break;
    case 'grow':
      game.greenhouse.grow(message.species, vscode);
      checkAcheivements();
      break;
    case 'save_plants': {
      const plantsString = getPlantsString();
      vscode.postMessage({ type: 'save_plants', content: plantsString });
      break;
    }
    case 'load':
      game.greenhouse.loadPlant(message, game.div.getAttribute('background'));
      break;
    case 'load_harvested':
      game.greenhouse.loadHarvestedPlant(message.species, message.count);
      (document.getElementById('empty-inventory-message') as HTMLElement | null)?.remove();
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
        'key': plant.key,
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
