export class HarvestedPlant {
  _species: string;
  _count: number;
  _html_element: HTMLElement;
  _badge_element: HTMLElement;

  get species(): string { return this._species; }
  get count(): number { return this._count; }

  constructor(species: string, count: number) {
    this._species = species;
    this._count = count;

    const element = document.createElement('div');
    (document.getElementById('keycrop') as HTMLElement).appendChild(element);
    this._html_element = element;

    element.classList.add('harvested-plant');
    element.classList.add(species);
    element.dataset.species = species;

    const displaySpecies = species.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
    element.title = displaySpecies;

    const badge = document.createElement('div');
    badge.classList.add('plant-count-badge');
    badge.textContent = String(count);
    element.appendChild(badge);
    this._badge_element = badge;
  }

  incrementCount(): void {
    this._count += 1;
    this._badge_element.textContent = String(this._count);
  }
}
