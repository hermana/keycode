export type PlantData = {
  price: number;
  category: string;
};

export const PLANTS: Record<string, PlantData> = {
  bean:            { price: 2,  category: 'vegetable' },
  tomato:          { price: 2,  category: 'vegetable' },
  broccoli:        { price: 2,  category: 'vegetable' },
  chili:           { price: 2,  category: 'vegetable' },
  lettuce:         { price: 2,  category: 'vegetable' },
  rhubarb:         { price: 2,  category: 'vegetable' },
  ivy:             { price: 25,  category: 'decorative' },
  jacaranda_tree:  { price: 25, category: 'decorative' },
  raspberry:       { price: 4,  category: 'fruit' },
  strawberry:      { price: 4, category: 'fruit' },
  watermelon:      { price: 4,  category: 'fruit' },
  glowberry:       { price: 50, category: 'exotic' },
  bulbino:         { price: 50, category: 'exotic' },
  poison_cabbage:  { price: 50, category: 'exotic' },
  neon_mould:      { price: 50, category: 'exotic' },
};
