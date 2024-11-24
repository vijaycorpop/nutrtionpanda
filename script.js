// Menu Items Data
const menuItems = {
    "Sides": {
        "Chow Mein": { calories: 510, protein: 13, carbs: 80, fat: 20 },
        "Fried Rice": { calories: 520, protein: 11, carbs: 85, fat: 16 },
        "Brown Steamed Rice": { calories: 420, protein: 9, carbs: 86, fat: 4 },
        "White Steamed Rice": { calories: 380, protein: 7, carbs: 87, fat: 0 },
        "Super Greens": { calories: 90, protein: 6, carbs: 10, fat: 3 },
        "Chow Fun": { calories: 410, protein: 9, carbs: 73, fat: 9 }
    },
    "Chicken": {
        "Black Pepper Chicken": { calories: 280, protein: 13, carbs: 15, fat: 19 },
        "Kung Pao Chicken": { calories: 290, protein: 16, carbs: 14, fat: 19 },
        "Grilled Teriyaki Chicken": { calories: 275, protein: 33, carbs: 14, fat: 10 },
        "Grilled Asian Chicken": { calories: 275, protein: 33, carbs: 14, fat: 10 },
        "Teriyaki Chicken": { calories: 340, protein: 41, carbs: 14, fat: 13 },
        "Asian Chicken": { calories: 340, protein: 41, carbs: 14, fat: 13 },
        "Mushroom Chicken": { calories: 220, protein: 13, carbs: 10, fat: 14 },
        "Orange Chicken": { calories: 490, protein: 25, carbs: 51, fat: 23 },
        "Potato Chicken": { calories: 190, protein: 8, carbs: 18, fat: 10 }
    },
    "Chicken Breast": {
        "Honey Sesame Chicken Breast": { calories: 340, protein: 16, carbs: 35, fat: 15 },
        "String Bean Chicken Breast": { calories: 210, protein: 12, carbs: 13, fat: 12 },
        "Sweetfire Chicken Breast": { calories: 360, protein: 15, carbs: 40, fat: 15 },
        "Sweet & Sour Chicken Breast": { calories: 300, protein: 10, carbs: 40, fat: 10 }
    },
    "Beef": {
        "Beijing Beef": { calories: 480, protein: 14, carbs: 46, fat: 27 },
        "Black Pepper Angus Steak": { calories: 210, protein: 19, carbs: 13, fat: 10 },
        "Broccoli Beef": { calories: 150, protein: 9, carbs: 13, fat: 7 }
    },
    "Seafood": {
        "Honey Walnut Shrimp": { calories: 360, protein: 11, carbs: 27, fat: 24 },
        "Wok-Fried Shrimp": { calories: 190, protein: 17, carbs: 19, fat: 5 },
        "Golden Treasure Shrimp": { calories: 360, protein: 14, carbs: 35, fat: 18 },
        "Steamed Ginger Fish": { calories: 200, protein: 15, carbs: 8, fat: 12 }
    },
    "Appetizers": {
        "Chicken Egg Roll (1 Roll)": { calories: 200, protein: 6, carbs: 20, fat: 10 },
        "Chicken Potstickers (3 Pcs)": { calories: 160, protein: 6, carbs: 20, fat: 6 },
        "Cream Cheese Rangoon (3 Pcs)": { calories: 190, protein: 5, carbs: 24, fat: 8 },
        "Vegetable Spring Roll (2 Rolls)": { calories: 240, protein: 4, carbs: 24, fat: 14 }
    }
};

// State Management
let selectedItems = JSON.parse(localStorage.getItem('selectedItems')) || {};

// DOM Elements
const mainContent = document.querySelector('.main-content');
const totalCaloriesEl = document.getElementById('total-calories');
const totalProteinEl = document.getElementById('total-protein');
const totalCarbsEl = document.getElementById('total-carbs');
const totalFatEl = document.getElementById('total-fat');

// Create Menu Item Card
function createMenuItem(item, category) {
    const div = document.createElement('div');
    div.className = 'menu-item';
    div.setAttribute('data-name', item.name);
    
    const isSelected = selectedItems[item.name] > 0;
    if (isSelected) {
        div.classList.add('selected');
    }

    div.innerHTML = `
        <div class="menu-item-content">
            <h3 class="menu-item-name">${item.name}</h3>
            <div class="menu-item-nutrition">
                <div class="nutrition-stat">
                    <span>${item.calories}</span>
                    <small>Cal</small>
                </div>
                <div class="nutrition-stat">
                    <span>${item.protein}g</span>
                    <small>Protein</small>
                </div>
                <div class="nutrition-stat">
                    <span>${item.carbs}g</span>
                    <small>Carbs</small>
                </div>
                <div class="nutrition-stat">
                    <span>${item.fat}g</span>
                    <small>Fat</small>
                </div>
            </div>
            <div class="select-circle">
                <i class="fas fa-plus"></i>
            </div>
            ${isSelected ? `
                <div class="item-count">${selectedItems[item.name]}</div>
                <button class="minus-btn">
                    <i class="fas fa-minus"></i>
                </button>
            ` : ''}
        </div>
    `;

    // Event Listeners
    div.addEventListener('click', (e) => {
        if (!e.target.closest('.minus-btn')) {
            handleItemSelection(item);
        }
    });

    const minusBtn = div.querySelector('.minus-btn');
    if (minusBtn) {
        minusBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            handleItemDeselection(item);
        });
    }

    return div;
}

// Handle Item Selection
function handleItemSelection(item) {
    const count = selectedItems[item.name] || 0;
    selectedItems[item.name] = count + 1;
    
    updateUI();
    saveToLocalStorage();
}

// Handle Item Deselection
function handleItemDeselection(item) {
    const count = selectedItems[item.name] || 0;
    if (count > 0) {
        selectedItems[item.name] = count - 1;
        if (selectedItems[item.name] === 0) {
            delete selectedItems[item.name];
        }
        
        updateUI();
        saveToLocalStorage();
    }
}

// Calculate Totals
function calculateTotals() {
    const totals = {
        calories: 0,
        protein: 0,
        carbs: 0,
        fat: 0
    };

    Object.entries(selectedItems).forEach(([itemName, count]) => {
        const item = findMenuItem(itemName);
        if (item) {
            totals.calories += item.calories * count;
            totals.protein += item.protein * count;
            totals.carbs += item.carbs * count;
            totals.fat += item.fat * count;
        }
    });

    return totals;
}

// Find Menu Item
function findMenuItem(name) {
    for (const category of Object.values(menuItems)) {
        const item = Object.values(category).find(item => item.name === name);
        if (item) return item;
    }
    return null;
}

// Update UI
function updateUI() {
    const totals = calculateTotals();
    
    // Update summary
    totalCaloriesEl.textContent = totals.calories;
    totalProteinEl.textContent = `${totals.protein}`;
    totalCarbsEl.textContent = `${totals.carbs}`;
    totalFatEl.textContent = `${totals.fat}`;

    // Update menu items
    document.querySelectorAll('.menu-item').forEach(menuItem => {
        const name = menuItem.getAttribute('data-name');
        const count = selectedItems[name] || 0;
        
        if (count > 0) {
            menuItem.classList.add('selected');
            
            let countEl = menuItem.querySelector('.item-count');
            if (!countEl) {
                countEl = document.createElement('div');
                countEl.className = 'item-count';
                menuItem.appendChild(countEl);
            }
            countEl.textContent = count;

            let minusBtn = menuItem.querySelector('.minus-btn');
            if (!minusBtn) {
                minusBtn = document.createElement('button');
                minusBtn.className = 'minus-btn';
                minusBtn.innerHTML = '<i class="fas fa-minus"></i>';
                menuItem.appendChild(minusBtn);
                
                minusBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    const item = findMenuItem(name);
                    if (item) handleItemDeselection(item);
                });
            }
        } else {
            menuItem.classList.remove('selected');
            menuItem.querySelector('.item-count')?.remove();
            menuItem.querySelector('.minus-btn')?.remove();
        }
    });
}

// Save to Local Storage
function saveToLocalStorage() {
    localStorage.setItem('selectedItems', JSON.stringify(selectedItems));
}

// Reset functionality
function resetAllSelections() {
    selectedItems = {};
    updateUI();
    saveToLocalStorage();
    
    // Reset all menu items
    document.querySelectorAll('.menu-item').forEach(item => {
        item.classList.remove('selected');
        const countDisplay = item.querySelector('.item-count');
        if (countDisplay) {
            countDisplay.remove();
        }
    });

    // Add animation to nutrition summary
    const summaryCard = document.querySelector('.summary-card');
    summaryCard.style.animation = 'resetPulse 0.5s ease';
    setTimeout(() => {
        summaryCard.style.animation = '';
    }, 500);
}

// Initialize
function initialize() {
    // Create menu sections
    Object.entries(menuItems).forEach(([category, items]) => {
        const container = document.getElementById(category);
        if (container) {
            Object.entries(items).forEach(([name, item]) => {
                item.name = name;
                container.appendChild(createMenuItem(item, category));
            });
        }
    });

    // Initialize totals
    updateUI();
}

// Add reset button event listener after components are loaded
document.addEventListener('DOMContentLoaded', () => {
    // Wait for components to load
    setTimeout(() => {
        const resetButton = document.getElementById('resetButton');
        if (resetButton) {
            resetButton.addEventListener('click', () => {
                resetAllSelections();
                // Add rotation animation to reset icon
                const resetIcon = resetButton.querySelector('i');
                resetIcon.style.animation = 'spin 0.5s ease';
                setTimeout(() => {
                    resetIcon.style.animation = '';
                }, 500);
            });
        }
    }, 100);
});

// Add new animation keyframes
const styleSheet = document.createElement('style');
styleSheet.textContent = `
@keyframes resetPulse {
    0% { transform: scale(1); }
    50% { transform: scale(1.02); }
    100% { transform: scale(1); }
}

@keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
}`;
document.head.appendChild(styleSheet);

// Start the app
document.addEventListener('DOMContentLoaded', initialize);
