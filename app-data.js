import { calculateCalories } from "./helpers.js";

export default class AppData {
  constructor() {
    this.food = [];
  }

  addFood(carbs, protein, fat) {
    // Ensure the food array exists
    if (!this.food) {
      this.food = [];
    }

    // Generate the next unique ID
    const id = this.food.length + 1;

    // Add the new food item
    this.food.push({
      id: id,
      carbs: Number.parseInt(carbs, 10),
      protein: Number.parseInt(protein, 10),
      fat: Number.parseInt(fat, 10),
    });

    // Log the updated food array
    console.log(this.food);
  }

  removeFood(id) {
    const numericId = Number(id); // Convert string to number
    const index = this.food.findIndex((item) => item.id === numericId);
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
    return (
      this.getTotalCarbs() * 4 +
      this.getTotalProtein() * 4 +
      this.getTotalFat() * 9
    );
  }
}
