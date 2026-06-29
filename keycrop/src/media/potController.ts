import { Greenhouse } from './greenhouse';
import { RECIPES } from './recipes';
import { SellMenu } from './sellMenu';

interface VsCodeApi {
  postMessage(msg: unknown): void;
}

export class PotController {
  private readonly overlay: HTMLElement;
  private readonly cookBtn: HTMLButtonElement | null;
  private readonly tray: HTMLDivElement;
  private readonly progressWrapper: HTMLElement | null;
  private readonly progressBar: HTMLElement | null;
  private readonly potImg: HTMLImageElement;
  private readonly sellMenu: SellMenu;

  private potActive = false;
  private potContents: { plant: HTMLElement; slot: HTMLElement }[] = [];

  constructor(
    private readonly potWrapper: HTMLElement,
    private readonly gameDiv: HTMLElement,
    private readonly greenhouse: Greenhouse,
    private readonly vscode: VsCodeApi,
    private readonly onSell: (element: HTMLElement, species?: string, recipeKey?: string) => void
  ) {
    this.overlay = potWrapper.querySelector('.inventory-pot-overlay') as HTMLElement;
    this.cookBtn = document.getElementById('cook-btn') as HTMLButtonElement | null;
    this.progressWrapper = document.getElementById('cook-progress-wrapper');
    this.progressBar = document.getElementById('cook-progress-bar');
    this.potImg = potWrapper.querySelector('.inventory-pot') as HTMLImageElement;

    this.tray = document.createElement('div');
    this.tray.className = 'pot-tray';
    potWrapper.appendChild(this.tray);

    this.sellMenu = new SellMenu((target) => {
      if (target.classList.contains('harvested-plant')) {
        this.greenhouse.consumeHarvestedPlant(target);
        this.onSell(target, target.dataset.species, undefined);
      } else if (target.classList.contains('cooked-food')) {
        this.greenhouse.consumeCookedFood(target);
        this.onSell(target, undefined, target.dataset.recipeKey);
      }
    });

    this.setupEventListeners();
  }

  private setupEventListeners(): void {
    this.potWrapper.addEventListener('click', () => this.onPotWrapperClick());
    this.cookBtn?.addEventListener('click', () => this.startCooking());
    this.gameDiv.addEventListener('click', (e) => this.onGameDivClick(e));
    document.getElementById('food-row')?.addEventListener('click', (e) => this.onFoodRowClick(e));
  }

  // --- Overlay / cook button sync ---

  private updateOverlay(): void {
    this.overlay.textContent = `${this.potContents.length}/${this.greenhouse.NUM_ITEMS_PER_RECIPE}`;
  }

  private updateCookButton(): void {
    if (this.cookBtn) {
      this.cookBtn.hidden = this.potContents.length < this.greenhouse.NUM_ITEMS_PER_RECIPE;
    }
  }

  private syncPotUI(): void {
    this.updateOverlay();
    this.updateCookButton();
    this.refreshHighlights();
  }

  // --- Plant display helpers ---

  private plantPotCount(plant: HTMLElement): number {
    return this.potContents.filter(e => e.plant === plant).length;
  }

  private plantInventoryCount(plant: HTMLElement): number {
    return this.greenhouse.harvestedPlants.find(p => p._html_element === plant)?.count ?? 1;
  }

  private updatePlantDisplay(plant: HTMLElement): void {
    const unitPrice = parseInt(plant.dataset.price ?? '0', 10);
    const displayCount = this.plantInventoryCount(plant) - this.plantPotCount(plant);
    (plant.querySelector('.plant-count-badge') as HTMLElement).textContent = String(displayCount);
    (plant.querySelector('.price-badge') as HTMLElement).textContent = `$${unitPrice * displayCount}`;
  }

  private refreshHighlights(): void {
    document.querySelectorAll<HTMLElement>('#keycrop .harvested-plant').forEach(p => {
      const canAdd = this.plantPotCount(p) < this.plantInventoryCount(p)
        && this.potContents.length < this.greenhouse.NUM_ITEMS_PER_RECIPE;
      p.classList.toggle('highlighted', this.potActive && canAdd);
    });
  }

  // --- Tray management ---

  private addToPot(plant: HTMLElement): void {
    if (this.potContents.length >= this.greenhouse.NUM_ITEMS_PER_RECIPE) { return; }
    const slot = document.createElement('div');
    slot.className = 'pot-tray-slot';
    slot.style.backgroundImage = window.getComputedStyle(plant).backgroundImage;
    slot.addEventListener('click', (e) => { e.stopPropagation(); this.removeFromPot(plant, slot); });
    this.tray.appendChild(slot);
    this.potContents.push({ plant, slot });
    this.updatePlantDisplay(plant);
    if (this.plantPotCount(plant) >= this.plantInventoryCount(plant)) {
      plant.classList.add('in-pot');
    }
    this.syncPotUI();
  }

  private removeFromPot(plant: HTMLElement, slot: HTMLElement): void {
    const idx = this.potContents.findIndex(e => e.plant === plant);
    if (idx !== -1) { this.potContents.splice(idx, 1); }
    slot.remove();
    plant.classList.remove('in-pot');
    this.updatePlantDisplay(plant);
    this.syncPotUI();
  }

  // --- Event handlers ---

  private onPotWrapperClick(): void {
    const isCooking = this.progressWrapper && !this.progressWrapper.hidden;
    const hasEnough = this.greenhouse.harvestedPlants.length >= this.greenhouse.NUM_ITEMS_PER_RECIPE;
    if (isCooking || this.potContents.length > 0 || !hasEnough) { return; }
    this.potActive = !this.potActive;
    this.overlay.hidden = !this.potActive;
    if (this.potActive) { this.updateOverlay(); }
    this.refreshHighlights();
  }

  private onGameDivClick(e: MouseEvent): void {
    const plant = (e.target as HTMLElement).closest('.harvested-plant') as HTMLElement | null;
    if (!plant) { return; }
    if (this.potActive && this.plantPotCount(plant) < this.plantInventoryCount(plant)) {
      this.addToPot(plant);
    } else if (!this.potActive) {
      e.stopPropagation();
      this.sellMenu.show(e.clientX, e.clientY, plant);
    }
  }

  private onFoodRowClick(e: MouseEvent): void {
    const food = (e.target as HTMLElement).closest('.cooked-food') as HTMLElement | null;
    if (!food) { return; }
    e.stopPropagation();
    this.sellMenu.show(e.clientX, e.clientY, food);
  }

  // --- Cooking ---

  private startCooking(): void {
    if (this.potContents.length < this.greenhouse.NUM_ITEMS_PER_RECIPE) { return; }
    if (this.cookBtn) { this.cookBtn.disabled = true; }
    this.potWrapper.style.pointerEvents = 'none';

    const entries = [...this.potContents];
    let completed = 0;
    entries.forEach(({ slot }, i) => {
      slot.style.animationDelay = `${i * 80}ms`;
      slot.classList.add('falling');
      slot.addEventListener('animationend', () => {
        completed++;
        if (completed === entries.length) { this.onAllSlotsAnimated(entries); }
      }, { once: true });
    });
  }

  private onAllSlotsAnimated(entries: { plant: HTMLElement; slot: HTMLElement }[]): void {
    const species1 = entries[0].plant.dataset.species ?? '';
    const species2 = entries[1].plant.dataset.species ?? '';
    const recipeKey = [species1, species2].sort().join('+');

    entries.forEach(({ plant: p, slot: s }) => {
      s.remove();
      p.classList.remove('in-pot');
      this.greenhouse.consumeHarvestedPlant(p);
    });
    this.potContents.length = 0;

    this.potImg.src = this.potImg.dataset.closedSrc!;
    this.potActive = false;
    this.overlay.hidden = true;
    this.syncPotUI();
    this.potWrapper.style.pointerEvents = '';

    if (this.cookBtn) { this.cookBtn.hidden = true; }
    this.startProgressBar(recipeKey, species1, species2);
  }

  private startProgressBar(recipeKey: string, species1: string, species2: string): void {
    if (!this.progressWrapper || !this.progressBar) { return; }
    this.progressWrapper.hidden = false;
    this.progressBar.style.transition = 'none';
    this.progressBar.style.width = '100%';
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        this.progressBar!.style.transition = `width ${this.greenhouse.COOK_DURATION_MS}ms linear`;
        this.progressBar!.style.width = '0%';
      });
    });
    this.progressBar.addEventListener('transitionend', () => {
      this.onCookComplete(recipeKey, species1, species2);
    }, { once: true });
  }

  private onCookComplete(recipeKey: string, species1: string, species2: string): void {
    this.progressWrapper!.hidden = true;
    if (this.cookBtn) { this.cookBtn.disabled = false; }
    this.potImg.src = this.potImg.dataset.openSrc!;

    const recipe = RECIPES[recipeKey];
    if (recipe) {
      const foodBase = document.getElementById('inventory-bottom-right')?.dataset.foodBase ?? '';
      const foodRow = document.getElementById('food-row');
      if (foodRow) { foodRow.hidden = false; }
      this.greenhouse.addCookedFood(recipeKey, recipe.name, `${foodBase}/${recipe.filename}`);
      this.vscode.postMessage({ type: 'cooked', recipeKey, species: [species1, species2] });
    }
  }
}
