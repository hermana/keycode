import { Plant } from './plant';

export class Greenhouse {
  plants: Plant[] = [];

  constructor() {
  }

  addPlant(species: string): void {
    this.plants.push(new Plant(species));
  }

  grow(species: string, vscode: { postMessage(msg: unknown): void }): void {
    this.plants.forEach(plant => {
      if (plant.species === species) { plant.grow(vscode); }
    });
  }

  loadPlant(message: any, background: string | null): void {
    let p = new Plant(message.species);
    p.setSize(message.size);
    p.setIsHarvested(message.harvested, background);
    p.setHotKeyUses(message.hotkey_uses);
    this.plants.push(p);
  }
}
