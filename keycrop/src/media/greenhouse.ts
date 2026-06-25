import { Plant } from './plant';
import { HarvestedPlant } from './harvestedPlant';
import { CookedFood } from './cookedFood';

export class Greenhouse {
  plants: Plant[] = [];
  harvestedPlants: HarvestedPlant[] = [];
  cookedFoods: CookedFood[] = [];

  NUM_ITEMS_PER_RECIPE = 2;
  COOK_DURATION_MS = 5000;

  constructor() {
  }

  addPlant(key: string, species: string): void {
    this.plants.push(new Plant(key, species));
  }

  grow(species: string, vscode: { postMessage(msg: unknown): void }): void {
    this.plants.forEach(plant => {
      if (plant.species === species && !plant.html_element.classList.contains('harvested-plant')) {
        plant.grow(vscode);
      }
    });
  }

  loadPlant(message: any, background: string | null): void {
    // Remove any existing plant for this key so reloads don't accumulate duplicates
    const existingIndex = this.plants.findIndex(p => p.key === message.key);
    if (existingIndex !== -1) {
      this.plants[existingIndex].remove();
      this.plants.splice(existingIndex, 1);
    }
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

  consumeHarvestedPlant(element: HTMLElement): void {
    const idx = this.harvestedPlants.findIndex(p => p._html_element === element);
    if (idx === -1) { return; }
    const fullyConsumed = this.harvestedPlants[idx].useOne();
    if (fullyConsumed) {
      this.harvestedPlants.splice(idx, 1);
    }
  }

  addCookedFood(recipeKey: string, name: string, imgSrc: string): void {
    const existing = this.cookedFoods.find(f => f.recipeKey === recipeKey);
    if (existing) {
      existing.incrementCount();
      return;
    }
    this.cookedFoods.push(new CookedFood(recipeKey, name, imgSrc, 1));
  }

  loadCookedFood(recipeKey: string, name: string, imgSrc: string, count: number): void {
    this.cookedFoods.push(new CookedFood(recipeKey, name, imgSrc, count));
  }
}
