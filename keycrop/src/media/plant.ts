const NUM_MILLISECONDS_ALLOWED_BETWEEN_KEY_USES: number = 0; //30000; // 30 seconds

export class Plant {
  constructor(key: string, species: string) {
    this.init(key, species);
  }
  _init = false;
  _key = '';
  get key(): string { return this._key; }
  _species = '';
  get species(): string { return this._species; }
  _size = '';
  get size(): string { return this._size; }
  _html_element!: HTMLElement;
  get html_element(): HTMLElement { return this._html_element; }
  _num_hotkey_uses = 0;
  get num_hotkey_uses(): number { return this._num_hotkey_uses; }
  _last_key_use: number = Date.now();
  get last_key_use(): number { return this._last_key_use; }
  _num_mashes = 0;
  get num_mashes(): number { return this._num_mashes; }

  init( key: string, species: string): void {
    //Already initialized
    if (this._init) {
      return;
    }

    //TODO: error handling if no type?
    if (species === '' || key === '') {
      return;
    }
    this._key = key;
    this._species = species;
    this._size = 'start';

    //Create plant element
    const element = document.createElement('div');
    (document.getElementById('keycrop') as HTMLElement).appendChild(element);
    this._html_element = element;

    //Add classes & move to random point
    element.classList.add('plant');
    element.classList.add(this.species);
    element.classList.add(this.size);
    element.title = this.species;
  }

  grow(vscode: { postMessage(msg: unknown): void }): void {
    //check for mashing
    const now = Date.now();
    if (now - this._last_key_use > NUM_MILLISECONDS_ALLOWED_BETWEEN_KEY_USES) {
      this._num_hotkey_uses += 1;
      this._last_key_use = now;
      if (this._num_hotkey_uses > 8 && this._html_element.classList.contains('harvested-plant')) {
        vscode.postMessage({ type: 'harvested', text: this.species });
      } else if (this._num_hotkey_uses > 4) {
        this._html_element.classList.remove('plant');
        this._html_element.classList.add('harvested-plant');
        this._html_element.hidden = true;
        vscode.postMessage({ type: 'harvested', text: this.species });
      } else if (this._num_hotkey_uses > 3) {
        this._size = 'large';
        this._html_element.classList.remove('medium');
        this._html_element.classList.add(this._size);
      } else if (this._num_hotkey_uses > 2) {
        this._size = 'medium';
        this._html_element.classList.remove('small');
        this._html_element.classList.add(this._size);
      } else if (this._num_hotkey_uses > 1) {
        this._size = 'small';
        this._html_element.classList.remove('start');
        this._html_element.classList.add(this._size);
      }
    } else {
      this._num_mashes += 1;
    }
  }

  setSize(s: string): void {
    this._size = s; //FIXME: am I really doing anything with this?
    this._html_element.classList.remove('start');
    this._html_element.classList.remove('small');
    this._html_element.classList.remove('medium');
    this._html_element.classList.remove('large');
    this._html_element.classList.add(this._size);
  }

  setIsHarvested(h: boolean, background: string | null): void {
    if (h) {
      this._html_element.classList.remove('plant');
      this._html_element.classList.add('harvested-plant');
      this._html_element.hidden = background === 'inventory' ? false : true;
    } else {
      this._html_element.classList.remove('harvested-plant');
      this._html_element.classList.add('plant');
      this._html_element.hidden = background === 'inventory' ? true : false;
    }
  }

  setHotKeyUses(n: number): void {
    this._num_hotkey_uses = n;
  }
}
