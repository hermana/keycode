import { InventoryItem } from './inventoryItem';
import { PLANTS } from './plants';

export class HarvestedPlant extends InventoryItem {
  _species: string;
  _html_element: HTMLElement;

  get species(): string { return this._species; }

  constructor(species: string, count: number) {
    super(count, PLANTS[species]?.price ?? 0);
    this._species = species;

    const element = document.createElement('div');
    (document.getElementById('keycrop') as HTMLElement).appendChild(element);
    this._html_element = element;

    element.classList.add('harvested-plant');
    element.classList.add(species);
    element.dataset.species = species;

    const displaySpecies = species.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
    element.title = displaySpecies;

    this.createBadge(element);
  }

  useOne(): boolean {
    this._count -= 1;
    if (this._count <= 0) {
      this._html_element.remove();
      return true;
    }
    this._badge_element.textContent = String(this._count);
    this._html_element.classList.remove('in-pot');
    return false;
  }
}
