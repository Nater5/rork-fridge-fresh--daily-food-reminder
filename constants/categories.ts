export type Category =
  | "Vegetable"
  | "Fruit"
  | "Dairy"
  | "Meat"
  | "Seafood"
  | "Grain"
  | "Bakery"
  | "Condiment"
  | "Beverage"
  | "Other";

export const CATEGORIES: Category[] = [
  "Vegetable",
  "Fruit",
  "Dairy",
  "Meat",
  "Seafood",
  "Grain",
  "Bakery",
  "Condiment",
  "Beverage",
  "Other",
];

export const CATEGORY_COLORS: Record<Category, string> = {
  Vegetable: "#22c55e",
  Fruit: "#ef4444",
  Dairy: "#60a5fa",
  Meat: "#f43f5e",
  Seafood: "#06b6d4",
  Grain: "#eab308",
  Bakery: "#f59e0b",
  Condiment: "#a78bfa",
  Beverage: "#34d399",
  Other: "#9ca3af",
};