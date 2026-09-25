import { RECIPES } from './recipes';

/** One slot per recipe. Each shows the mystery image until that recipe has been cooked. */
export class Collection {
  private readonly slots = new Map<string, HTMLImageElement>();

  constructor(container: HTMLElement, private readonly foodBase: string) {
    for (const recipeKey of Object.keys(RECIPES)) {
      const slot = document.createElement('img');
      slot.className = 'collection-slot';
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
}
