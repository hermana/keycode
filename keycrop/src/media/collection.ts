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
    this.detailPanel.style.left = `${e.clientX + 8}px`;
    this.detailPanel.style.top = `${e.clientY + 8}px`;
    this.detailPanel.hidden = false;
  }
}
