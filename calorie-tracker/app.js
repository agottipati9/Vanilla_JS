// Storage Controller
const storeCtrl = (function(){
  
})();


// Item Controller
const itemCtrl = (function(){
  // Item Constructor
  const Item = function(id, name, calories){
    this.id = id;
    this.name = name;
    this.calories = calories;
  }

  // Data Elements
  const data = {
    items: [],
    currentItem: null,
    totalCalories: 0
  }

  return {
    getItems: function(){
        return data.items;
    },

    addItem: function(name, calories){
      // Create ID
      if(data.items.length > 0){
        id = data.items[data.items.length - 1].id + 1;
      } else{
        id = 0;
      }

      // Parse Calories
      calories = parseInt(calories);

      // Create new item
      const newItem = new Item(id, name, calories);
      data.items.push(newItem);

      return newItem;
    },

    getTotalCalories: function(){
      // Get total calories
      let total = 0;
      data.items.forEach(function(item){
        total += item.calories;
      });

      data.totalCalories = total;
      return data.totalCalories;
    },

    logData: function(){
      return data;
    }
  }
})();

// UI Controller
const uiCtrl = (function(){
  // Element identifiers
  const uiSelectors = {
    itemList: '#item-list',
    addBtn: '.add-btn',
    itemNameInput: '#item-name',
    itemCalorieInput: '#item-calories',
    totalCalories: '.total-calories'
  }

  return {
    populateItemList: function(itemList){
      let html = ``;

      // Create HTML
      itemList.forEach(function(item){
        html += `<li class="collection-item" id="item-${item.id}">
        <strong>${item.name}: </strong> <em>${item.calories} Calories</em>
        <a href="#" class="secondary-content">
          <i class="edit-item fa fa-pencil"></i>
        </a>
      </li>`;
      });

      // Insert items into HTML
      document.querySelector(uiSelectors.itemList).innerHTML = html;
    },

    getItemInput: function(){
      return{
        name: document.querySelector(uiSelectors.itemNameInput).value,
        calories: document.querySelector(uiSelectors.itemCalorieInput).value
      }
    },

    addListItem: function(item){
      // Create li element
      const li = document.createElement('li');
      li.className = 'collection-item';
      li.id = `item-${item.id}`;
      li.innerHTML = `<strong>${item.name}: </strong> <em>${item.calories} Calories</em>
      <a href="#" class="secondary-content">
        <i class="edit-item fa fa-pencil"></i>
      </a>
    </li>`;

      // Insert item
      document.querySelector(uiSelectors.itemList).insertAdjacentElement('beforeend', li);

      // Show List 
      this.showList();
    },

    clearInput: function(){
      document.querySelector(uiSelectors.itemNameInput).value = '';
      document.querySelector(uiSelectors.itemCalorieInput).value = '';
    },

    hideList: function(){
      document.querySelector(uiSelectors.itemList).style.display = 'none';
    },

    showList: function(){
      document.querySelector(uiSelectors.itemList).style.display = 'block';
    },

    showTotalCalories: function(calories){
      document.querySelector(uiSelectors.totalCalories).textContent = calories;
    },

    getSelectors: () => uiSelectors
  }
})();

// App Controller
const appCtrl = (function(itemCtrl, uiCtrl){
  // Load Event Listeners
  const loadEventListeners = function(){
    const selectors = uiCtrl.getSelectors();

    // Add item submit
    const itemAddSubmit = function(e){
      const input = uiCtrl.getItemInput();
      
      // Validate Input
      if(input.name !== '' && input.calories !== ''){
        // Add item
        const newItem = itemCtrl.addItem(input.name, input.calories);

        // Update UI
        uiCtrl.addListItem(newItem);

        // Get Total Calories
        const totalCalories = itemCtrl.getTotalCalories();
        uiCtrl.showTotalCalories(totalCalories);

        // Clear Input
        uiCtrl.clearInput();
      }

      e.preventDefault();
    };

    // Add item event
    document.querySelector(selectors.addBtn).addEventListener('click', itemAddSubmit);

  }

  // Public methods
  return {
    init: function(){
      // Load Items from Local Storage
      const items = itemCtrl.getItems();

      // Check if any items
      if(items.length === 0){
        uiCtrl.hideList();
      }
      else{
        uiCtrl.populateItemList(items);
      }

      // Get Total Calories
      const totalCalories = itemCtrl.getTotalCalories();
      uiCtrl.showTotalCalories(totalCalories);

      // Load Event Listeners
      loadEventListeners();
    }
  }
  
})(itemCtrl, uiCtrl);

// Initialize app
appCtrl.init();