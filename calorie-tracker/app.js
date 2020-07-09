// Storage Controller
const storeCtrl = (function(){
  return {
    storeItem: function(item){
      let items;

      // Check for items in local storage
      if(localStorage.getItem('items') === null){
        items = [];
        items.push(item);
        localStorage.setItem('items', JSON.stringify(items));
      } 
      else{
        items = JSON.parse(localStorage.getItem('items'));
        items.push(item);
        localStorage.setItem('items', JSON.stringify(items));
      }
    },

    updateItemStorage: function(updatedItem){
      let items = JSON.parse(localStorage.getItem('items'));

      // Find and replace old item
      items.forEach(function(item, index){
        if(item.id === updatedItem.id){
          items.splice(index, 1, updatedItem);
        }
      });
      
      // Update local storage
      localStorage.setItem('items', JSON.stringify(items));
    },

    deleteItem: function(item){
      let items = JSON.parse(localStorage.getItem('items'));
      
      // Remove item
      const index = items.indexOf(item); 
      items.splice(index, 1);

      // Update Storage
      localStorage.setItem('items', JSON.stringify(items));
    },

    clear: function(item){
      localStorage.clear();
    },
    
    getItemsFromStorage: function(){
      let items;

      if(localStorage.getItem('items') === null){
        items = [];
      } 
      else{
        items = JSON.parse(localStorage.getItem('items'));
      }

      return items;
    }
  }
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
    items: storeCtrl.getItemsFromStorage(),
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

    setCurrentItem: function(item){
      data.currentItem = item;
    },

    getCurrentItem: function(){
      return data.currentItem;
    },

    updateItem: function(name, calories){
      let cal = parseInt(calories);
      let updateItem = null;

      data.items.forEach(function(item){
        if(data.currentItem.id === item.id){
          item.name = name;
          item.calories = cal;
          updateItem = item;
        }
      });

      return updateItem;
    },

    deleteItem: function(id){
      // Get ids
      ids = data.items.map(function(item){
        return item.id;
      });

      // Get index
      const index = ids.indexOf(id);

      // Remove item
      data.items.splice(index, 1);
    },

    clear: function(){
      data.items = [];
      data.currentItem = null;
      data.totalCalories = 0;
    },

    getItemByID: function(id){
      let currentItem = null;
      data.items.forEach(function(item){
        if(item.id === id){
          currentItem = item;
        }
      });

      return currentItem;
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
    updateBtn: '.update-btn',
    deleteBtn: '.delete-btn',
    backBtn: '.back-btn',
    clearAllBtn: '.clear-btn',
    itemNameInput: '#item-name',
    itemCalorieInput: '#item-calories',
    totalCalories: '.total-calories',
    listItems: '#item-list li'
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

    updateListItem: function(item){
      let listItems = document.querySelectorAll(uiSelectors.listItems);

      // Loop through nodes
      listItems = Array.from(listItems);
      listItems.forEach(function(listItem){
        const itemID = listItem.getAttribute('id');

        if(itemID === `item-${item.id}`){
          document.querySelector(`#${itemID}`).innerHTML = `<strong>${item.name}: </strong> <em>${item.calories} Calories</em>
          <a href="#" class="secondary-content">
            <i class="edit-item fa fa-pencil"></i>
          </a>
          </li>`;
        }
      });

    },

    deleteListItem: function(id){
      const itemID = `#item-${id}`;
      const item = document.querySelector(itemID);
      item.remove();
    },

    clearInput: function(){
      document.querySelector(uiSelectors.itemNameInput).value = '';
      document.querySelector(uiSelectors.itemCalorieInput).value = '';
    },

    addItemToForm: function(){
      document.querySelector(uiSelectors.itemNameInput).value = itemCtrl.getCurrentItem().name;
      document.querySelector(uiSelectors.itemCalorieInput).value = itemCtrl.getCurrentItem().calories;
      uiCtrl.showEditState();
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

    clearEditState: function(){
      uiCtrl.clearInput();
      document.querySelector(uiSelectors.updateBtn).style.display = 'none';
      document.querySelector(uiSelectors.deleteBtn).style.display = 'none';
      document.querySelector(uiSelectors.backBtn).style.display = 'none';
      document.querySelector(uiSelectors.addBtn).style.display = 'inline';
    },

    showEditState: function(){
      document.querySelector(uiSelectors.updateBtn).style.display = 'inline';
      document.querySelector(uiSelectors.deleteBtn).style.display = 'inline';
      document.querySelector(uiSelectors.backBtn).style.display = 'inline';
      document.querySelector(uiSelectors.addBtn).style.display = 'none';
    },

    getSelectors: () => uiSelectors
  }
})();

// App Controller
const appCtrl = (function(itemCtrl, uiCtrl, storeCtrl){
  // Load Event Listeners
  const loadEventListeners = function(){
    const selectors = uiCtrl.getSelectors();

    // Add item event
    document.querySelector(selectors.addBtn).addEventListener('click', itemAddSubmit);

    // Disable submit on enter
    document.addEventListener('keypress', function(e){
      if(e.keyCode === 13 || e.which === 13){
        e.preventDefault();
        return false;
      }
    });

    // Edit icon click event
    document.querySelector(selectors.itemList).addEventListener('click', itemEditClick);

    // Update Item event
    document.querySelector(selectors.updateBtn).addEventListener('click', itemUpdateSubmit);

    // Delete Item Event
    document.querySelector(selectors.deleteBtn).addEventListener('click', itemDeleteSubmit);

    // Clear All
    document.querySelector(selectors.clearAllBtn).addEventListener('click',clearAllSubmit);
    
    // Back event
    document.querySelector(selectors.backBtn).addEventListener('click', uiCtrl.clearEditState);
  };

  const clearAllSubmit = function(e){
    // Get all items
    const allItems = itemCtrl.getItems();

    // Remove all items
    allItems.forEach(function(item){
      // Delete Item from backend
      itemCtrl.clear();

      // Delete item from ui
      uiCtrl.deleteListItem(item.id);
    });

    // Update Total Calories
    const totalCalories = itemCtrl.getTotalCalories();
    uiCtrl.showTotalCalories(totalCalories);

    // Clear Local Storage
    storeCtrl.clear();

    uiCtrl.clearEditState();
    uiCtrl.hideList();
    e.preventDefault();
  }

  // Item delete submit
  const itemDeleteSubmit = function(e){
    // Get current item
    const currentItem = itemCtrl.getCurrentItem();

    // Delete Item from backend
    itemCtrl.deleteItem(currentItem.id);

    // Delete item from ui
    uiCtrl.deleteListItem(currentItem.id);

    // Update Total Calories
    const totalCalories = itemCtrl.getTotalCalories();
    uiCtrl.showTotalCalories(totalCalories);

    // Update Local Storage
    storeCtrl.deleteItem(currentItem);

    uiCtrl.clearEditState();
    e.preventDefault();
  }

  // Item update submit
  const itemUpdateSubmit = function(e){
    // Get item input
    const input = uiCtrl.getItemInput();

    // Update Item
    const updatedItem = itemCtrl.updateItem(input.name, input.calories);
    uiCtrl.updateListItem(updatedItem);

    // Update Total Calories
    const totalCalories = itemCtrl.getTotalCalories();
    uiCtrl.showTotalCalories(totalCalories);

    // Update Local Storage
    storeCtrl.updateItemStorage(updatedItem);

    uiCtrl.clearEditState();
    e.preventDefault();
  }

  // Edit Item Click
  const itemEditClick = function(e){
    if(e.target.classList.contains('edit-item')){
      // Get list item id
      let listID = e.target.parentNode.parentNode.id;
      listID = parseInt(listID.split('-')[1]);

      // Get item and update current item
      const itemToEdit = itemCtrl.getItemByID(listID);
      itemCtrl.setCurrentItem(itemToEdit);

      // Add item to form
      uiCtrl.addItemToForm();
    }

    e.preventDefault();
  }

  // Add item submit
  const itemAddSubmit = function(e){
    // Get Input
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

      // Store in localStorage
      storeCtrl.storeItem(newItem);

      // Clear Input
      uiCtrl.clearInput();
    }

    e.preventDefault();
  }

  // Public methods
  return {
    init: function(){
      // Set initial state
      uiCtrl.clearEditState();

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
  
})(itemCtrl, uiCtrl, storeCtrl);

// Initialize app
appCtrl.init();