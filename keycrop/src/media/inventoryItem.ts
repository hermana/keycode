export abstract class InventoryItem {
  protected _count: number;
  protected _price: number;
  protected _badge_element!: HTMLElement;

  get count(): number { return this._count; }

  constructor(count: number, price: number) {
    this._count = count;
    this._price = price;
  }

  protected createBadge(parent: HTMLElement): void {
    parent.dataset.price = String(this._price);

    const badge = document.createElement('div');
    badge.classList.add('plant-count-badge');
    badge.textContent = String(this._count);
    parent.appendChild(badge);
    this._badge_element = badge;

    const priceBadge = document.createElement('div');
    priceBadge.classList.add('price-badge');
    priceBadge.textContent = `$${this._price}`;
    parent.appendChild(priceBadge);
  }

  incrementCount(): void {
    this._count += 1;
    this._badge_element.textContent = String(this._count);
  }
}
