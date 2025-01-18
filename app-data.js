import { calculateCalories } from "./helpers.js";

export default class AppData {
  constructor() {
    this.food = [];
  }

  addFood(carbs, protein, fat) {
    this.food.push({
      carbs: Number.parseInt(carbs, 10),
      protein: Number.parseInt(protein, 10),
      fat: Number.parseInt(fat, 10),
    });
  }

  removeFood(carbs, protein, fat) {
    // Find the index of the food item to remove
    const index = this.food.findIndex(
      (item) =>
        item.carbs === Number.parseInt(carbs, 10) &&
        item.protein === Number.parseInt(protein, 10) &&
        item.fat === Number.parseInt(fat, 10)
    );

    // If the food item exists, remove it
    if (index !== -1) {
      this.food.splice(index, 1);
    } else {
      console.warn("Food item not found in the list.");
    }
  }

  getTotalCarbs() {
    return this.food.reduce((total, current) => {
      return total + current.carbs;
    }, 0);
  }

  getTotalProtein() {
    return this.food.reduce((total, current) => {
      return total + current.protein;
    }, 0);
  }

  getTotalFat() {
    return this.food.reduce((total, current) => {
      return total + current.fat;
    }, 0);
  }

  getTotalCalories() {
    return this.food.reduce((total, current) => {
      return (
        total + calculateCalories(current.carbs, current.protein, current.fat)
      );
    }, 0);
  }
}
