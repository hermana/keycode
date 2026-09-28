import { RECIPES } from './recipes';
import { toLabel } from './plants';

export class SellMenu {
  private readonly menu: HTMLDivElement;
  private readonly nameLabel: HTMLDivElement;
  private readonly sellOption: HTMLDivElement;
  private target: HTMLElement | null = null;

  constructor(private readonly onConfirm: (target: HTMLElement) => void) {
    this.menu = document.createElement('div') as HTMLDivElement;
    this.menu.id = 'item-context-menu';
    this.menu.hidden = true;

    this.nameLabel = document.createElement('div') as HTMLDivElement;
    this.nameLabel.className = 'context-menu-name';
    this.menu.appendChild(this.nameLabel);

    this.sellOption = document.createElement('div') as HTMLDivElement;
    this.sellOption.className = 'context-menu-option';
    this.sellOption.textContent = 'Sell';
    this.menu.appendChild(this.sellOption);
    document.body.appendChild(this.menu);

    this.sellOption.addEventListener('click', () => this.onSellClick());
    document.addEventListener('click', () => this.hide());
    // Scrolling inside the scroll area also closes the tooltip
    document.addEventListener('scroll', () => this.hide(), true);
  }

  show(x: number, y: number, target: HTMLElement): void {
    this.target = target;
    const { recipeKey, species } = target.dataset;
    const name = recipeKey ? RECIPES[recipeKey]?.name : species ? toLabel(species) : undefined;
    this.nameLabel.textContent = name ?? '';
    this.nameLabel.hidden = !name;
    const price = parseInt(target.dataset.price ?? '0', 10);
    this.sellOption.textContent = `Sell ($${price})`;
    this.menu.style.left = `${x}px`;
    this.menu.style.top = `${y}px`;
    this.menu.hidden = false;
  }

  hide(): void {
    this.menu.hidden = true;
    this.target = null;
  }

  private onSellClick(): void {
    if (!this.target) { return; }
    const target = this.target;
    this.hide();
    this.onConfirm(target);
  }
}
