import { Greenhouse } from './greenhouse';
import { RECIPES } from './recipes';

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

function updateMoneyDisplay(): void {
  const el = document.getElementById('money-display');
  if (el) { el.textContent = `$${playerMoney}`; }
}

function sellItem(element: HTMLElement, species?: string, recipeKey?: string): void {
  const price = parseInt(element.dataset.price ?? '0', 10);
  playerMoney += price;
  updateMoneyDisplay();
  vscode.postMessage({ type: 'sell', amount: price, species, recipeKey });
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
      game.greenhouse.addPlant(message.key,message.species);
      break;
    case 'grow':
      game.greenhouse.grow(message.key, vscode);
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
    case 'achievement':
      launchConfetti();
      break;
    case 'load_harvested':
      game.greenhouse.loadHarvestedPlant(message.species, message.count);
      (document.getElementById('empty-inventory-message') as HTMLElement | null)?.remove();
      break;
    case 'load_cooked': {
      const recipe = RECIPES[message.recipeKey];
      if (recipe) {
        const foodBase = document.getElementById('inventory-bottom-right')?.dataset.foodBase ?? '';
        const foodRow = document.getElementById('food-row');
        if (foodRow) { foodRow.hidden = false; }
        game.greenhouse.loadCookedFood(message.recipeKey, recipe.name, `${foodBase}/${recipe.filename}`, message.count);
      }
      break;
    }
    case 'load_money':
      playerMoney = message.amount ?? 0;
      updateMoneyDisplay();
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


const potWrapper = document.getElementById('inventory-pot-wrapper');
if (potWrapper) {
  const overlay = potWrapper.querySelector('.inventory-pot-overlay') as HTMLElement;
  const cookBtn = document.getElementById('cook-btn') as HTMLButtonElement | null;
  let potActive = false;
  const potContents: { plant: HTMLElement; slot: HTMLElement }[] = [];

  const tray = document.createElement('div');
  tray.className = 'pot-tray';
  potWrapper.appendChild(tray);

  function updateOverlay(): void {
    overlay.textContent = `${potContents.length}/${game.greenhouse.NUM_ITEMS_PER_RECIPE}`;
  }

  function updateCookButton(): void {
    if (cookBtn) {
      cookBtn.hidden = potContents.length < game.greenhouse.NUM_ITEMS_PER_RECIPE;
    }
  }

  function syncPotUI(): void {
    updateOverlay();
    updateCookButton();
    refreshHighlights();
  }

  function plantPotCount(plant: HTMLElement): number {
    return potContents.filter(entry => entry.plant === plant).length;
  }

  function plantInventoryCount(plant: HTMLElement): number {
    return game.greenhouse.harvestedPlants.find(p => p._html_element === plant)?.count ?? 1;
  }

  function updatePlantDisplay(plant: HTMLElement): void {
    const unitPrice = parseInt(plant.dataset.price ?? '0', 10);
    const displayCount = plantInventoryCount(plant) - plantPotCount(plant);
    (plant.querySelector('.plant-count-badge') as HTMLElement).textContent = String(displayCount);
    (plant.querySelector('.price-badge') as HTMLElement).textContent = `$${unitPrice * displayCount}`;
  }

  function refreshHighlights(): void {
    document.querySelectorAll<HTMLElement>('#keycrop .harvested-plant').forEach(p => {
      const canAdd = plantPotCount(p) < plantInventoryCount(p) && potContents.length < game.greenhouse.NUM_ITEMS_PER_RECIPE;
      p.classList.toggle('highlighted', potActive && canAdd);
    });
  }

  function addToPot(plant: HTMLElement): void {
    if (potContents.length >= game.greenhouse.NUM_ITEMS_PER_RECIPE) { return; }
    const slot = document.createElement('div');
    slot.className = 'pot-tray-slot';
    slot.style.backgroundImage = window.getComputedStyle(plant).backgroundImage;
    slot.addEventListener('click', (e) => {
      e.stopPropagation();
      removeFromPot(plant, slot);
    });
    tray.appendChild(slot);
    potContents.push({ plant, slot });
    updatePlantDisplay(plant);
    if (plantPotCount(plant) >= plantInventoryCount(plant)) {
      plant.classList.add('in-pot');
    }
    syncPotUI();
  }

  function removeFromPot(plant: HTMLElement, slot: HTMLElement): void {
    const idx = potContents.findIndex(entry => entry.plant === plant);
    if (idx !== -1) { potContents.splice(idx, 1); }
    slot.remove();
    plant.classList.remove('in-pot');
    updatePlantDisplay(plant);
    syncPotUI();
  }

  let contextMenuTarget: HTMLElement | null = null;

  const contextMenu = document.createElement('div');
  contextMenu.id = 'item-context-menu';
  contextMenu.hidden = true;
  const sellOption = document.createElement('div');
  sellOption.className = 'context-menu-option';
  sellOption.textContent = 'Sell';
  contextMenu.appendChild(sellOption);
  document.body.appendChild(contextMenu);

  function showContextMenu(x: number, y: number, target: HTMLElement): void {
    contextMenuTarget = target;
    const price = parseInt(target.dataset.price ?? '0', 10);
    sellOption.textContent = `Sell ($${price})`;
    contextMenu.style.left = `${x}px`;
    contextMenu.style.top = `${y}px`;
    contextMenu.hidden = false;
  }

  function hideContextMenu(): void {
    contextMenu.hidden = true;
    contextMenuTarget = null;
  }

  game.div.addEventListener('click', (e) => {
    const plant = (e.target as HTMLElement).closest('.harvested-plant') as HTMLElement | null;
    if (!plant) { return; }
    if (potActive && plantPotCount(plant) < plantInventoryCount(plant)) {
      addToPot(plant);
    } else if (!potActive) {
      e.stopPropagation();
      showContextMenu(e.clientX, e.clientY, plant);
    }
  });

  document.getElementById('food-row')?.addEventListener('click', (e) => {
    const food = (e.target as HTMLElement).closest('.cooked-food') as HTMLElement | null;
    if (!food) { return; }
    e.stopPropagation();
    showContextMenu(e.clientX, e.clientY, food);
  });

  sellOption.addEventListener('click', () => {
    if (!contextMenuTarget) { return; }
    const target = contextMenuTarget;
    hideContextMenu();
    if (target.classList.contains('harvested-plant')) {
      sellItem(target, target.dataset.species, undefined);
      game.greenhouse.consumeHarvestedPlant(target);
    } else if (target.classList.contains('cooked-food')) {
      sellItem(target, undefined, target.dataset.recipeKey);
      game.greenhouse.consumeCookedFood(target);
    }
  });

  document.addEventListener('click', () => hideContextMenu());

  potWrapper.addEventListener('click', () => {
    const isCooking = progressWrapper && !progressWrapper.hidden;
    if (isCooking || potContents.length > 0) { return; }
    potActive = !potActive;
    overlay.hidden = !potActive;
    if (potActive) { updateOverlay(); }
    refreshHighlights();
  });

  const progressWrapper = document.getElementById('cook-progress-wrapper') as HTMLElement | null;
  const progressBar = document.getElementById('cook-progress-bar') as HTMLElement | null;

  cookBtn?.addEventListener('click', () => {
    if (potContents.length < game.greenhouse.NUM_ITEMS_PER_RECIPE) { return; }

    const potImg = potWrapper.querySelector('.inventory-pot') as HTMLImageElement;
    if (cookBtn) { cookBtn.disabled = true; }
    potWrapper.style.pointerEvents = 'none';

    const entries = [...potContents];
    let completed = 0;

    entries.forEach(({ slot }, i) => {
      slot.style.animationDelay = `${i * 80}ms`;
      slot.classList.add('falling');
      slot.addEventListener('animationend', () => {
        completed++;
        if (completed === entries.length) {
          const species1 = entries[0].plant.dataset.species ?? '';
          const species2 = entries[1].plant.dataset.species ?? '';
          const recipeKey = [species1, species2].sort().join('+');

          entries.forEach(({ plant: p, slot: s }) => {
            s.remove();
            p.classList.remove('in-pot');
            game.greenhouse.consumeHarvestedPlant(p);
          });
          potContents.length = 0;

          potImg.src = potImg.dataset.closedSrc!;
          potActive = false;
          overlay.hidden = true;
          syncPotUI();
          potWrapper.style.pointerEvents = '';

          if (cookBtn) { cookBtn.hidden = true; }
          if (progressWrapper && progressBar) {
            progressWrapper.hidden = false;
            progressBar.style.transition = 'none';
            progressBar.style.width = '100%';
            requestAnimationFrame(() => {
              requestAnimationFrame(() => {
                progressBar.style.transition = `width ${game.greenhouse.COOK_DURATION_MS}ms linear`;
                progressBar.style.width = '0%';
              });
            });
            progressBar.addEventListener('transitionend', () => {
              progressWrapper.hidden = true;
              if (cookBtn) { cookBtn.disabled = false; }
              potImg.src = potImg.dataset.openSrc!;
              const recipe = RECIPES[recipeKey];
              if (recipe) {
                const foodBase = document.getElementById('inventory-bottom-right')?.dataset.foodBase ?? '';
                const foodRow = document.getElementById('food-row');
                if (foodRow) { foodRow.hidden = false; }
                game.greenhouse.addCookedFood(recipeKey, recipe.name, `${foodBase}/${recipe.filename}`);
                vscode.postMessage({ type: 'cooked', recipeKey, species: [species1, species2] });
              }
            }, { once: true });
          }
        }
      }, { once: true });
    });
  });
}

//Start loop
setInterval(update, 1000 / game.fps);

//Tell vscode game loaded
//TODO: type or action here?
vscode.postMessage({ type: 'init' });
