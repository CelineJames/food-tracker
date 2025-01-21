import FetchWrapper from "./fetch-wrapper.js";
import { capitalize, calculateCalories } from "./helpers.js";
import AppData from "./app-data.js";

const API = new FetchWrapper(
  "https://firestore.googleapis.com/v1/projects/jsdemo2-3f387/databases/(default)/documents/final"
);

const appData = new AppData();

console.log(appData.food);

const form = document.querySelector("#create-form");
const name = document.querySelector("#create-name");
const carbs = document.querySelector("#create-carbs");
const protein = document.querySelector("#create-protein");
const fat = document.querySelector("#create-fat");
const foodList = document.querySelector("#food-list");
const calories = document.querySelector("#total-calories");


// Function to display food entry in the list
const displayEntry = (id, name, carbs, protein, fat) => {
  // appData.addFood(carbs, protein, fat);
  foodList.insertAdjacentHTML(
    "beforeend",
    `<li class="card" id="${id}">
        <div>
          <h3 class="name">${capitalize(name)}</h3>
          <div class="calories">${calculateCalories(
            carbs,
            protein,
            fat
          )} calories</div>
          <ul class="macros">
            <li class="carbs"><div>Carbs</div><div class="value">${carbs}g</div></li>
            <li class="protein"><div>Protein</div><div class="value">${protein}g</div></li>
            <li class="fat"><div>Fat</div><div class="value">${fat}g</div></li>
            <button type="button" class="delete-btn">Delete</button>
          </ul>
        </div>
      </li>`
  );
};

// Handle form submission
form.addEventListener("submit", (event) => {
  event.preventDefault();

  API.post("/", {
    fields: {
      name: { stringValue: name.value },
      carbs: { integerValue: carbs.value },
      protein: { integerValue: protein.value },
      fat: { integerValue: fat.value },
    },
  }).then((data) => {
    console.log(data);
    if (data.error) {
      console.error(data.error.message);
      return;
    }

    // Use addFood to assign the ID and add the food entry
    appData.addFood(carbs.value, protein.value, fat.value);

    // Get the ID of the last added food item
    const lastItem = appData.food[appData.food.length - 1];
    const id = lastItem.id;

    displayEntry(id, name.value, carbs.value, protein.value, fat.value);
    render();

    // Reset form fields
    name.value = "";
    carbs.value = "";
    protein.value = "";
    fat.value = "";
  });
});





// Initialize app by fetching saved entries and rendering them
const init = () => {
  API.get("/?pageSize=10").then((data) => {
    console.log(data);
    data.documents?.forEach((document) => {
      const field = document.fields;

       appData.addFood(
         field.carbs.integerValue,
         field.protein.integerValue,
         field.fat.integerValue
       );

       // Get the ID of the last added food item
       const lastItem = appData.food[appData.food.length - 1];
       const id = lastItem.id;

      // Display the food entry with the new ID
      displayEntry(
        id,
        field.name.stringValue,
        field.carbs.integerValue,
        field.protein.integerValue,
        field.fat.integerValue
      );
    });
    render();
  });
};



foodList.addEventListener("click", (event) => {
  if (event.target.classList.contains("delete-btn")) {
    const listItem = event.target.closest("li.card");
    const id = listItem.id;

    // Remove the item from the API
    API.delete(`/${id}`)
      .then((data) => {
        console.log("Item deleted from API:", data);

        // Remove the item from the DOM
        listItem.remove();

        // Remove the item from the appData.food arr
        appData.removeFood(id);

        // Update the UI
        render();
      })
      .catch((error) => {
        console.error("Error deleting item from API:", error);
      });
  }
});


// Render the bar chart
let chartInstance = null;
const renderChart = () => {
  // Destroy the previous chart instance if it exists
  chartInstance?.destroy();

  const context = document.querySelector("#app-chart").getContext("2d");

  chartInstance = new Chart(context, {
    type: "bar",
    data: {
      labels: ["Carbs", "Protein", "Fat"],
      datasets: [
        {
          label: "Macronutrients",
          data: [
            appData.getTotalCarbs(),
            appData.getTotalProtein(),
            appData.getTotalFat(),
          ],
          backgroundColor: ["#25AEEE", "#FECD52", "#57D269"],
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: true, // Improves performance for large charts
      aspectRatio: 2,
      animation: {
        duration: 500, // Reduce animation time
      },
      scales: {
        y: {
          beginAtZero: true,
        },
      },
    },
  });
};

const updateCalories = () => {
  calories.textContent = appData.getTotalCalories();
};

const render = () => {
  renderChart();
  updateCalories();
};

// Start the application
init();


