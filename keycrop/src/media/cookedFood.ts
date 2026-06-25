import { InventoryItem } from './inventoryItem';
import { RECIPES } from './recipes';

export class CookedFood extends InventoryItem {
  _recipeKey: string;
  _name: string;
  _html_element: HTMLElement;

  get recipeKey(): string { return this._recipeKey; }

  constructor(recipeKey: string, name: string, imgSrc: string, count: number) {
    super(count, RECIPES[recipeKey]?.price ?? 0);
    this._recipeKey = recipeKey;
    this._name = name;

    const container = document.getElementById('food-row') as HTMLElement;

    const element = document.createElement('div');
    element.classList.add('cooked-food');
    element.dataset.recipeKey = recipeKey;
    element.title = name;
    container.appendChild(element);
    this._html_element = element;

    const img = document.createElement('img');
    img.src = imgSrc;
    img.classList.add('cooked-food-img');
    element.appendChild(img);

    this.createBadge(element);
  }

  useOne(): boolean {
    this._count -= 1;
    if (this._count <= 0) {
      this._html_element.remove();
      return true;
    }
    this.updateBadgeDisplay();
    return false;
  }
}
