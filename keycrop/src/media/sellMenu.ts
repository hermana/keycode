export class SellMenu {
  private readonly menu: HTMLDivElement;
  private readonly sellOption: HTMLDivElement;
  private target: HTMLElement | null = null;

  constructor(private readonly onConfirm: (target: HTMLElement) => void) {
    this.menu = document.createElement('div') as HTMLDivElement;
    this.menu.id = 'item-context-menu';
    this.menu.hidden = true;

    this.sellOption = document.createElement('div') as HTMLDivElement;
    this.sellOption.className = 'context-menu-option';
    this.sellOption.textContent = 'Sell';
    this.menu.appendChild(this.sellOption);
    document.body.appendChild(this.menu);

    this.sellOption.addEventListener('click', () => this.onSellClick());
    document.addEventListener('click', () => this.hide());
  }

  show(x: number, y: number, target: HTMLElement): void {
    this.target = target;
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
