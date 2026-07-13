export type SpeciesOption = {
  species: string;
  label: string;
  description: string;
  price: number;
  isFree: boolean;
  locked: boolean;
};

export class SpeciesPicker {
  private readonly overlay: HTMLDivElement;
  private readonly list: HTMLDivElement;
  private key = '';

  constructor(
    private readonly onSelect: (key: string, species: string) => void,
    private readonly onLockedClick: (species: string) => void
  ) {
    this.overlay = document.createElement('div');
    this.overlay.id = 'species-picker-overlay';
    this.overlay.hidden = true;

    const panel = document.createElement('div');
    panel.id = 'species-picker';

    const title = document.createElement('div');
    title.id = 'species-picker-title';
    title.textContent = 'Choose a species for your new plant';
    panel.appendChild(title);

    this.list = document.createElement('div');
    this.list.id = 'species-picker-list';
    panel.appendChild(this.list);

    this.overlay.appendChild(panel);
    document.body.appendChild(this.overlay);

    this.overlay.addEventListener('click', (e) => {
      if (e.target === this.overlay) { this.hide(); }
    });
  }

  show(key: string, options: SpeciesOption[]): void {
    this.key = key;
    this.list.innerHTML = '';

    let sawLocked = false;
    for (const opt of options) {
      if (opt.locked && !sawLocked) {
        const sep = document.createElement('div');
        sep.className = 'species-picker-separator';
        sep.textContent = 'Locked';
        this.list.appendChild(sep);
        sawLocked = true;
      }
      this.list.appendChild(this.buildCard(opt));
    }

    this.overlay.hidden = false;
  }

  hide(): void {
    this.overlay.hidden = true;
    this.key = '';
  }

  private buildCard(opt: SpeciesOption): HTMLDivElement {
    const card = document.createElement('div');
    card.className = 'species-card' + (opt.locked ? ' locked' : '');

    const thumb = document.createElement('div');
    if (opt.locked) {
      thumb.className = 'species-card-thumb locked-thumb';
      thumb.textContent = '\u{1F512}';
    } else {
      thumb.className = `species-card-thumb ${opt.species} stage-1`;
    }
    card.appendChild(thumb);

    const info = document.createElement('div');
    info.className = 'species-card-info';

    const label = document.createElement('div');
    label.className = 'species-card-label';
    label.textContent = opt.locked ? `\u{1F512} ${opt.label}` : opt.label;
    info.appendChild(label);

    const desc = document.createElement('div');
    desc.className = 'species-card-desc';
    desc.textContent = opt.isFree ? opt.description : `$${opt.price} · ${opt.description}`;
    info.appendChild(desc);

    card.appendChild(info);

    card.addEventListener('click', () => {
      if (opt.locked) {
        this.onLockedClick(opt.species);
        return;
      }
      this.onSelect(this.key, opt.species);
      this.hide();
    });

    return card;
  }
}
