import { RECIPES } from './recipes';
import { toLabel } from './plants';

/** One slot per recipe. Each shows the mystery image until that recipe has been cooked. */
export class Collection {
  private readonly slots = new Map<string, HTMLImageElement>();
  private readonly detailPanel: HTMLDivElement;

  constructor(container: HTMLElement, private readonly foodBase: string) {
    this.detailPanel = document.createElement('div');
    this.detailPanel.id = 'collection-detail';
    this.detailPanel.hidden = true;
    document.body.appendChild(this.detailPanel);
    document.addEventListener('click', () => { this.detailPanel.hidden = true; });
    document.addEventListener('scroll', () => { this.detailPanel.hidden = true; }, true);

    for (const recipeKey of Object.keys(RECIPES)) {
      const slot = document.createElement('img');
      slot.className = 'collection-slot';
      slot.dataset.recipeKey = recipeKey;
      slot.addEventListener('click', (e) => this.showDetails(e, slot));
      slot.src = `${foodBase}/mystery_item.png`;
      slot.title = '???';
      container.appendChild(slot);
      this.slots.set(recipeKey, slot);
    }
  }

  discover(recipeKey: string): void {
    const slot = this.slots.get(recipeKey);
    const recipe = RECIPES[recipeKey];
    if (!slot || !recipe) { return; }
    slot.src = `${this.foodBase}/${recipe.filename}`;
    slot.title = recipe.name;
    slot.classList.add('discovered');
  }

  /** Shows name, ingredients and sell price. Undiscovered recipes stay a mystery. */
  private showDetails(e: MouseEvent, slot: HTMLImageElement): void {
    e.stopPropagation();
    const recipeKey = slot.dataset.recipeKey!;
    const recipe = RECIPES[recipeKey];
    if (slot.classList.contains('discovered') && recipe) {
      const ingredients = recipeKey.split('+').map(toLabel).join(' + ');
      this.detailPanel.textContent = `${recipe.name}\n${ingredients}\nSells for $${recipe.price}`;
    } else {
      this.detailPanel.textContent = '???';
    }
    this.detailPanel.hidden = false;
    this.positionDetails(e.clientX, e.clientY);
  }

  /** Flips the detail panel to the other side if it's going to go offscreen */
  private positionDetails(x: number, y: number): void {
    const offset = 8;
    const margin = 4;
    const { width, height } = this.detailPanel.getBoundingClientRect();
    const place = (pos: number, size: number, limit: number) => {
      const preferred = pos + offset + size <= limit - margin ? pos + offset : pos - offset - size;
      return Math.max(margin, Math.min(preferred, limit - size - margin));
    };
    this.detailPanel.style.left = `${place(x, width, window.innerWidth)}px`;
    this.detailPanel.style.top = `${place(y, height, window.innerHeight)}px`;
  }
}
