// Menu data (array of objects)
const menuItems = [
  { id: 1, name: "Sourdough Loaf", category: "Breads", price: 8 },
  { id: 2, name: "Whole Wheat Loaf", category: "Breads", price: 7 },
  { id: 3, name: "Rustic Baguette", category: "Breads", price: 5 },
  { id: 4, name: "Butter Croissant", category: "Pastries", price: 4 },
  { id: 5, name: "Cinnamon Roll", category: "Pastries", price: 5 },
  { id: 6, name: "Seasonal Fruit Tart", category: "Pastries", price: 6 }
];

let favorites = loadFavorites();
let currentFilter = "all";

// Load saved favorites from localStorage when the page opens
function loadFavorites() {
  return JSON.parse(localStorage.getItem("favorites")) || [];
}

// Save favorites to localStorage whenever they change
function saveFavorites() {
  localStorage.setItem("favorites", JSON.stringify(favorites));
}

// Add or remove an item from favorites
function toggleFavorite(id) {
  if (favorites.includes(id)) {
    favorites = favorites.filter(favId => favId !== id);
  } else {
    favorites.push(id);
  }
  saveFavorites();
  renderMenu();
}

// Return the items that match the current filter
function getFilteredItems() {
  if (currentFilter === "all") return menuItems;
  if (currentFilter === "favorites") {
    return menuItems.filter(item => favorites.includes(item.id));
  }
  return menuItems.filter(item => item.category === currentFilter);
}

// Rebuild the menu list on the page
function renderMenu() {
  const list = document.getElementById("menu-list");
  const items = getFilteredItems();

  if (items.length === 0) {
    list.innerHTML = "<li>No items to show yet. Tap ♡ on a treat to save it!</li>";
    return;
  }

  list.innerHTML = items.map(item => `
    <li>
      ${item.name} - $${item.price}
      <button data-id="${item.id}" aria-pressed="${favorites.includes(item.id)}">
        ${favorites.includes(item.id) ? "♥ Saved" : "♡ Favorite"}
      </button>
    </li>`).join("");
}

// Filter buttons
document.getElementById("filter-buttons").addEventListener("click", e => {
  if (e.target.dataset.filter) {
    currentFilter = e.target.dataset.filter;
    renderMenu();
  }
});

// Favorite buttons
document.getElementById("menu-list").addEventListener("click", e => {
  if (e.target.dataset.id) {
    toggleFavorite(Number(e.target.dataset.id));
  }
});

renderMenu();
