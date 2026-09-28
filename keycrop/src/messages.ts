// Messages passed between the extension and its webviews. Types only, so both the
// extension bundle and the webview bundles can import this file.
//
// Direction decides the tag: messages TO a webview are keyed by `action`,
// messages FROM a webview are keyed by `type`.

export type SpeciesOption = {
  species: string;
  label: string;
  description: string;
  price: number;
  isFree: boolean;
  locked: boolean;
};

/** A greenhouse plant as the webview reports it back for saving. */
export type PlantSnapshot = {
  key: string;
  species: string;
  size: string;
  harvested: boolean;
  hotkey_uses: number;
  num_mashes: number;
};

/** Extension → webview */
export type ToWebviewMessage =
  | { action: 'key-tracking-mode' }
  | { action: 'background'; value: string }
  | { action: 'add'; key: string; species: string }
  | { action: 'grow'; key: string }
  | { action: 'save_plants' }
  | { action: 'load'; key: string; species: string; size: string; harvested: boolean; hotkey_uses: number }
  | { action: 'achievement' }
  | { action: 'load_harvested'; species: string; count: number }
  | { action: 'load_cooked'; recipeKey: string; count: number }
  | { action: 'load_collection'; recipeKeys: string[] }
  | { action: 'load_money'; amount: number }
  | { action: 'choose_species'; key: string; options: SpeciesOption[] }
  | { action: 'update_counts'; counts: Record<string, number> };

/** Webview → extension */
export type FromWebviewMessage =
  | { type: 'init' }
  | { type: 'save_plants'; content: PlantSnapshot[] }
  | { type: 'harvested'; key: string; text: string }
  | { type: 'select_species'; key: string; species: string }
  | { type: 'locked_species_click'; species: string }
  | { type: 'sell'; amount: number; species?: string; recipeKey?: string }
  | { type: 'cooked'; recipeKey: string; species: string[] };

/** The handle a webview script gets from acquireVsCodeApi(). */
export interface VsCodeApi {
  postMessage(message: FromWebviewMessage): void;
}
