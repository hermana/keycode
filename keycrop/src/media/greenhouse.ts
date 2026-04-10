import { Plant } from './plant';
import { HarvestedPlant } from './harvestedPlant';

export class Greenhouse {
  plants: Plant[] = [];
  harvestedPlants: HarvestedPlant[] = [];

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
    let p = new Plant(message.key, message.species);
    p.setSize(message.size);
    p.setIsHarvested(message.harvested, background);
    p.setHotKeyUses(message.hotkey_uses);
    this.plants.push(p);
  }

  loadHarvestedPlant(species: string, count: number): void {
    const existing = this.harvestedPlants.find(p => p.species === species);
    if (existing) {
      existing.incrementCount();
      return;
    }
    this.harvestedPlants.push(new HarvestedPlant(species, count));
  }
}
