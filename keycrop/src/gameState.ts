import * as fs from 'fs';
import * as path from 'path';
import { ALL_SPECIES, plantingCost } from './media/plants';
import type { PlantSnapshot } from './messages';

export type SavedPlant = {
  key: string;
  species: string;
  size: string;
  harvested: boolean;
  hotkey_uses: number;
};

export type HarvestResult = {
  species: string;
  /** The player already had this species in their inventory before this harvest. */
  alreadyOwned: boolean;
  /** This harvest completed the set of every species. */
  completedAllSpecies: boolean;
};

/**
 * Everything the game saves to plants.json: greenhouse plants, inventory counts,
 * money and discovered recipes, plus the rules that change them.
 */
export class GameState {
  private plants: SavedPlant[] = [];
  private harvestedCounts = new Map<string, number>();
  private cookedFoodCounts = new Map<string, number>();
  private discoveredRecipes = new Set<string>();
  private money = 0;

  constructor(private readonly filePath: string) {}

  get playerMoney(): number { return this.money; }
  get allPlants(): readonly SavedPlant[] { return this.plants; }
  get harvested(): ReadonlyMap<string, number> { return this.harvestedCounts; }
  get cooked(): ReadonlyMap<string, number> { return this.cookedFoodCounts; }
  get discovered(): ReadonlySet<string> { return this.discoveredRecipes; }

  load(): void {
    this.plants = [];
    if (!fs.existsSync(this.filePath)) { return; }
    try {
      const saved = JSON.parse(fs.readFileSync(this.filePath, 'utf8'));
      const savedPlants: any[] = saved.plants ?? saved;
      this.harvestedCounts = new Map(Object.entries(saved.harvestedCounts ?? {}));
      this.cookedFoodCounts = new Map(Object.entries(saved.cookedFoodCounts ?? {}));
      this.money = saved.playerMoney ?? 0;
      // Older saves have no discoveredRecipes; anything cooked and still held counts as discovered
      this.discoveredRecipes = new Set([...(saved.discoveredRecipes ?? []), ...this.cookedFoodCounts.keys()]);
      // Deduplicate by key — prefer non-harvested if there are conflicting entries
      const seen = new Map<string, SavedPlant>();
      for (const p of savedPlants) {
        const existing = seen.get(p.key);
        if (!existing || (!p.harvested && existing.harvested)) {
          seen.set(p.key, { key: p.key, species: p.species, size: p.size, harvested: p.harvested, hotkey_uses: p.hotkey_uses });
        }
      }
      this.plants = Array.from(seen.values());
    } catch (e) {
      console.error('Saved plants could not be loaded');
      console.error(e);
      this.plants = [];
    }
  }

  save(): void {
    fs.mkdirSync(path.dirname(this.filePath), { recursive: true });
    fs.writeFileSync(this.filePath, JSON.stringify({
      plants: this.plants,
      harvestedCounts: Object.fromEntries(this.harvestedCounts),
      cookedFoodCounts: Object.fromEntries(this.cookedFoodCounts),
      discoveredRecipes: [...this.discoveredRecipes],
      playerMoney: this.money
    }));
  }

  /** The growing (not yet harvested) plant on this hotkey, if any. */
  growingPlant(key: string): SavedPlant | undefined {
    return this.plants.find(p => p.key === key && !p.harvested);
  }

  /** Frees a hotkey so a new species can be planted on it. */
  clearKey(key: string): void {
    this.plants = this.plants.filter(p => p.key !== key);
  }

  /** Plants a new species on a hotkey, paying for it unless it's a free vegetable. */
  plant(key: string, species: string): SavedPlant {
    this.money -= plantingCost(species);
    const plant: SavedPlant = { key, species, size: 'start', harvested: false, hotkey_uses: 1 };
    this.plants.push(plant);
    return plant;
  }

  /**
   * Copies growth progress reported by the greenhouse webview. Never adds or removes
   * plants: the extension decides which keys are assigned, and the webview can lag
   * behind after a reload.
   */
  updateGrowth(snapshots: PlantSnapshot[]): void {
    for (const snapshot of snapshots) {
      const existing = this.plants.find(p => p.key === snapshot.key);
      if (existing) {
        existing.size = snapshot.size;
        existing.hotkey_uses = snapshot.hotkey_uses;
      }
    }
  }

  /** Moves a fully grown plant into the inventory. Undefined if nothing is growing on that key. */
  harvest(key: string): HarvestResult | undefined {
    const plant = this.growingPlant(key);
    if (!plant) { return undefined; }
    const alreadyOwned = this.harvestedCounts.has(plant.species);
    const speciesBefore = this.harvestedCounts.size;
    plant.harvested = true;
    this.harvestedCounts.set(plant.species, (this.harvestedCounts.get(plant.species) ?? 0) + 1);
    const completedAllSpecies = speciesBefore < ALL_SPECIES.length && this.harvestedCounts.size === ALL_SPECIES.length;
    return { species: plant.species, alreadyOwned, completedAllSpecies };
  }

  sell(amount: number, species?: string, recipeKey?: string): void {
    this.money += amount;
    if (species) {
      GameState.decrement(this.harvestedCounts, species);
    } else if (recipeKey) {
      GameState.decrement(this.cookedFoodCounts, recipeKey);
    }
  }

  /** Uses up the ingredients and adds the dish. Returns true the first time this recipe is made. */
  cook(recipeKey: string, ingredients: string[]): boolean {
    this.cookedFoodCounts.set(recipeKey, (this.cookedFoodCounts.get(recipeKey) ?? 0) + 1);
    for (const species of ingredients) {
      GameState.decrement(this.harvestedCounts, species);
    }
    const newlyDiscovered = !this.discoveredRecipes.has(recipeKey);
    this.discoveredRecipes.add(recipeKey);
    return newlyDiscovered;
  }

  private static decrement(counts: Map<string, number>, key: string): void {
    const count = counts.get(key) ?? 0;
    if (count <= 1) {
      counts.delete(key);
    } else {
      counts.set(key, count - 1);
    }
  }
}
