export type PlantData = {
  price: number;
  category: string;
  description: string;
};

export const PLANTS: Record<string, PlantData> = {
  bean:            { price: 2,  category: 'vegetable',  description: 'A humble unassuming legume.' },
  tomato:          { price: 2,  category: 'vegetable',  description: 'This crop has a wide variety of culinary uses.' },
  broccoli:        { price: 2,  category: 'vegetable',  description: 'Nutritious' },
  chili:           { price: 2,  category: 'vegetable',  description: 'Spicy and flavorful.' },
  lettuce:         { price: 2,  category: 'vegetable',  description: 'Great in salads' },
  rhubarb:         { price: 2,  category: 'vegetable',  description: 'The stalks are edible.' },
  ivy:             { price: 25,  category: 'decorative', description: 'A decorative ground cover.' },
  jacaranda_tree:  { price: 25, category: 'decorative', description: 'A tree with purple leaves.' },
  raspberry:       { price: 4,  category: 'fruit',       description: 'A sweet and tart fruit.' },
  strawberry:      { price: 4, category: 'fruit',        description: 'A sweet and juicy fruit.' },
  watermelon:      { price: 4,  category: 'fruit',       description: 'Great with hotkeys in the summer.' },
  glowberry:       { price: 50, category: 'exotic',      description: 'Glowberries emit a soft bioluminescent hue.' },
  bulbino:         { price: 50, category: 'exotic',      description: 'A mysterious plant.' },
  poison_cabbage:  { price: 50, category: 'exotic',      description: 'Closely related to regular cabbage.' },
  neon_mould:      { price: 50, category: 'exotic',      description: 'Radioactive mould.' },
};

export const ALL_SPECIES = Object.keys(PLANTS);
