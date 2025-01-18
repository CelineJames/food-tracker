import FetchWrapper from "./fetch-wrapper.js";
import { capitalize, calculateCalories } from "./helpers.js";
import AppData from "./app-data.js";

// Chart.js is now included via CDN, so no need to import it here

const API = new FetchWrapper(
  "https://firestore.googleapis.com/v1/projects/jsdemo2-3f387/databases/(default)/documents/kaytorah"
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
const deleteBtns = document.querySelectorAll(".delete-btn");

// Function to display food entry in the list
const displayEntry = (name, carbs, protein, fat) => {
  appData.addFood(Number(carbs), Number(protein), Number(fat));
  foodList.insertAdjacentHTML(
    "beforeend",
    `<li class="card">
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

// Handle delete button click
deleteBtns.forEach((btn) => {
  btn.addEventListener("click", (event) => {
    const entry = event.target.closest(".card");
    const id = entry.dataset.id;
    deleteEntry(id);
  });
});

const deleteEntry = (id) => {
  API.delete(`/${id}`)
    .then((response) => {
      if (response.error) {
        console.error("Error deleting entry:", response.error.message);
        alert("Failed to delete the entry from the API.");
        return;
      }

      const entryElement = foodList.querySelector(`.card[data-id="${id}"]`);
      if (entryElement) {
        const carbs = parseInt(
          entryElement.querySelector(".carbs .value").textContent
        );
        const protein = parseInt(
          entryElement.querySelector(".protein .value").textContent
        );
        const fat = parseInt(
          entryElement.querySelector(".fat .value").textContent
        );

        // Update appData by removing the food item
        appData.removeFood(carbs, protein, fat);

        // Remove from DOM
        entryElement.remove();
      }

      // Re-render chart and calorie count
      render();
      alert("Entry deleted successfully.");
    })
    .catch((error) => {
      console.error("Error deleting entry:", error);
      alert("An error occurred while deleting the entry.");
    });
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

    displayEntry(name.value, carbs.value, protein.value, fat.value);
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

      displayEntry(
        field.name.stringValue,
        field.carbs.integerValue,
        field.protein.integerValue,
        field.fat.integerValue
      );
    });
    render();
  });
};

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
