export abstract class InventoryItem {
  protected _count: number;
  protected _badge_element!: HTMLElement;

  get count(): number { return this._count; }

  constructor(count: number) {
    this._count = count;
  }

  protected createBadge(parent: HTMLElement): void {
    const badge = document.createElement('div');
    badge.classList.add('plant-count-badge');
    badge.textContent = String(this._count);
    parent.appendChild(badge);
    this._badge_element = badge;
  }

  incrementCount(): void {
    this._count += 1;
    this._badge_element.textContent = String(this._count);
  }
}
