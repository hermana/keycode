export class CookedFood {
  _recipeKey: string;
  _name: string;
  _count: number;
  _badge_element: HTMLElement;

  get recipeKey(): string { return this._recipeKey; }
  get count(): number { return this._count; }

  constructor(recipeKey: string, name: string, imgSrc: string, count: number) {
    this._recipeKey = recipeKey;
    this._name = name;
    this._count = count;

    const container = document.getElementById('food-row') as HTMLElement;

    const element = document.createElement('div');
    element.classList.add('cooked-food');
    element.title = name;
    container.appendChild(element);

    const img = document.createElement('img');
    img.src = imgSrc;
    img.classList.add('cooked-food-img');
    element.appendChild(img);

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
