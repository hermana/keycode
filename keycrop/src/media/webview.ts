import { Greenhouse } from './greenhouse';
import { RECIPES } from './recipes';
import { PotController } from './potController';
import { SpeciesPicker } from './speciesPicker';

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

let playerMoney = 0;

const speciesPicker = new SpeciesPicker(
  (key, species) => vscode.postMessage({ type: 'select_species', key, species }),
  (species) => vscode.postMessage({ type: 'locked_species_click', species })
);

function updateMoneyDisplay(): void {
  const el = document.getElementById('money-display');
  if (el) { el.textContent = `$${playerMoney}`; }
}

function updateEmptyMessage(): void {
  const el = document.getElementById('empty-inventory-message');
  if (!el) { return; }
  el.hidden = game.greenhouse.harvestedPlants.length > 0 || game.greenhouse.cookedFoods.length > 0;
}

function sellItem(element: HTMLElement, species?: string, recipeKey?: string): void {
  const price = parseInt(element.dataset.price ?? '0', 10);
  playerMoney += price;
  updateMoneyDisplay();
  vscode.postMessage({ type: 'sell', amount: price, species, recipeKey });
  updateEmptyMessage();
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
      } else if (message.value === 'dirt') {
        spawnBottomDecorations();
      } else if (message.value === 'inventory') {
        renderShelfRow();
      }
      break;
    case 'add':
      game.greenhouse.addPlant(message.key,message.species);
      break;
    case 'grow':
      game.greenhouse.grow(message.key, vscode);
      checkAcheivements();
      break;
    case 'save_plants':
      vscode.postMessage({ type: 'save_plants', content: game.greenhouse.serialize() });
      break;
    case 'load':
      game.greenhouse.loadPlant(message, game.div.getAttribute('background'));
      break;
    case 'achievement':
      launchConfetti();
      break;
    case 'load_harvested':
      game.greenhouse.loadHarvestedPlant(message.species, message.count);
      updateEmptyMessage();
      break;
    case 'load_cooked': {
      const recipe = RECIPES[message.recipeKey];
      if (recipe) {
        const foodBase = document.getElementById('inventory-bottom-right')?.dataset.foodBase ?? '';
        const foodRow = document.getElementById('food-row');
        if (foodRow) { foodRow.hidden = false; }
        game.greenhouse.addCookedFood(message.recipeKey, recipe.name, `${foodBase}/${recipe.filename}`, message.count);
        updateEmptyMessage();
      }
      break;
    }
    case 'load_money':
      playerMoney = message.amount ?? 0;
      updateMoneyDisplay();
      break;
    case 'choose_species':
      speciesPicker.show(message.key, message.options);
      break;
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

function launchConfetti(): void {
  const colors = ['#f44336', '#e91e63', '#9c27b0', '#3f51b5', '#2196f3', '#4caf50', '#ffeb3b', '#ff9800'];
  const count = 80;
  for (let i = 0; i < count; i++) {
    const piece = document.createElement('div');
    piece.classList.add('confetti-piece');
    piece.style.left = Math.random() * 100 + 'vw';
    piece.style.background = colors[Math.floor(Math.random() * colors.length)];
    piece.style.animationDuration = (1.5 + Math.random() * 2) + 's';
    piece.style.animationDelay = (Math.random() * 1.5) + 's';
    piece.style.width = (6 + Math.random() * 6) + 'px';
    piece.style.height = (6 + Math.random() * 6) + 'px';
    document.body.appendChild(piece);
    piece.addEventListener('animationend', () => piece.remove());
  }
}

function renderShelfRow(): void {
  const strip = document.getElementById('shelf-strip');
  if (!strip) { return; }
  strip.innerHTML = '';
  const TILE_WIDTH = 64;
  const OVERLAP = 10;
  const step = TILE_WIDTH - OVERLAP;
  const count = Math.ceil(window.innerWidth / step) + 1;
  for (let i = 0; i < count; i++) {
    const tile = document.createElement('div');
    tile.className = 'shelf-tile';
    if (i > 0) { tile.style.marginLeft = `-${OVERLAP}px`; }
    strip.appendChild(tile);
  }
}

function spawnBottomDecorations(): void {
  const strip = document.getElementById('decoration-strip');
  if (!strip || strip.childElementCount > 0) { return; }
  const kinds = ['flower', 'bush', 'shrub'];
  const DECORATION_WIDTH = 48;
  const maxLeft = Math.max(window.innerWidth - DECORATION_WIDTH, 0);
  for (const kind of kinds) {
    const count = 1 + Math.floor(Math.random() * 5);
    for (let i = 0; i < count; i++) {
      const el = document.createElement('div');
      el.className = `bottom-decoration ${kind}`;
      el.style.left = `${Math.random() * maxLeft}px`;
      strip.appendChild(el);
    }
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
  renderShelfRow();
}



function update(): void {
  if (game.width !== window.innerWidth || game.height !== window.innerHeight) {
    onResize();
  }
  game.frames++;
}


const potWrapper = document.getElementById('inventory-pot-wrapper');
if (potWrapper) {
  new PotController(potWrapper, game.div, game.greenhouse, vscode, sellItem);
}

//Start loop
// Plant detail panel — greenhouse only (.plant elements don't exist in inventory)
const plantDetailPanel = document.createElement('div');
plantDetailPanel.id = 'plant-detail';
plantDetailPanel.hidden = true;
document.body.appendChild(plantDetailPanel);

game.div.addEventListener('click', (e) => {
  const plant = (e.target as HTMLElement).closest('.plant:not(.harvested-plant)') as HTMLElement | null;
  if (!plant || !plant.title) { return; }
  e.stopPropagation();
  plantDetailPanel.textContent = plant.title;
  plantDetailPanel.style.left = `${e.clientX + 8}px`;
  plantDetailPanel.style.top = `${e.clientY + 8}px`;
  plantDetailPanel.hidden = false;
});

document.addEventListener('click', () => { plantDetailPanel.hidden = true; });

setInterval(update, 1000 / game.fps);

//Tell vscode game loaded
//TODO: type or action here?
vscode.postMessage({ type: 'init' });
