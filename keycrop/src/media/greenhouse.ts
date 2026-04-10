import { Plant } from './plant';

export class Greenhouse {
  plants: Plant[] = [];

  constructor() {
  }

  addPlant(key: string, species: string): void {
    this.plants.push(new Plant(key, species));
  }

  grow(species: string, vscode: { postMessage(msg: unknown): void }): void {
    this.plants.forEach(plant => {
      if (plant.species === species) { plant.grow(vscode); }
    });
  }

  loadPlant(message: any, background: string | null): void {
    const existing = this.plants.find(p => p.species === message.species);
    if (existing) {
      existing.incrementCount();
      return;
    }
    let p = new Plant(message.key, message.species);
    p.setSize(message.size);
    p.setIsHarvested(message.harvested, background);
    p.setHotKeyUses(message.hotkey_uses);
    this.plants.push(p);
  }
}
