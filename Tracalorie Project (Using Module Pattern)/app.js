// Storage controller
const StorageCtrl = (function(){
    // Public methods
    return {
        storeItem: function(item){
            let items
            // Check if any items in LS
            if (localStorage.getItem('items')===null) {
                items = [];
                // Push new item;
                items.push(item);
                // Set ls
                localStorage.setItem('items', JSON.stringify(items));
            } else {
                items = JSON.parse(localStorage.getItem('items'));

                // push new item;
                items.push(item);

                // reset LS
                localStorage.setItem('items', JSON.stringify(items));
            }
        },
        getItemsFromStorage: function(){
            let items;
            if(localStorage.getItem('items') === null){
                items = [];
            } else {
                items = JSON.parse(localStorage.getItem('items'));
            }
            return items;
        },
        updateItemStorage: function(updatedItem){
            let items = JSON.parse(localStorage.getItem('items'));

            items.forEach((item, index) => {
                if (updatedItem.id === item.id){
                    items.splice(index, 1, updatedItem);
                }
            });
            localStorage.setItem('items', JSON.stringify(items));
        },
        deleteItemFromStorage: function(id){
            let items = JSON.parse(localStorage.getItem('items'));
            
            items.forEach(function(item, index){
            if(id === item.id){
                items.splice(index, 1);
            }
            });
            localStorage.setItem('items', JSON.stringify(items));
        },
        clearItemsFromStorage: function(){
            localStorage.removeItem('items');
        }
    }
})();

// Item controller
const ItemCtrl = (function(){
// Item constructor
const Item = function(id, name, calories){
    this.id = id;
    this.name = name;
    this.calories = calories
}

// Data Structure / State
const data = {
    items: StorageCtrl.getItemsFromStorage(),
    currentItems: null,
    totalCalories: 0
}

return {
    getItems: function(){
        return data.items;
    },
    addItem: function(name, calories){
        let ID;
        // Create Id
        if(data.items.length > 0){
            ID = data.items[data.items.length - 1].id + 1
        }else{
            ID = 0
        }

        // Calories to number
        calories = parseInt(calories);

        // Create new Item
        newItem = new Item (ID, name, calories)

        // Add to item arr
        data.items.push(newItem)

        return newItem
    },
    getItemById: function(id){
        let found = null;
        // Loop through data
        data.items.forEach(item => {
            if(item.id === id){
                found = item;
            }
        });
        return found;
    },
    updateItem: function(name, calories){
        // parse calories
        calories = parseInt(calories);
        
        let found = null;

        data.items.forEach(item => {
            if(item.id === data.currentItems.id){
                item.name = name;
                item.calories = calories;
                found = item
            }
        });
        return found;
    },
    deleteItem: function(id){
        // get it
        ids = data.items.map(function(item){
            return item.id
        });

        // Get index
        const index = ids.indexOf(id);

        // Remove item
        data.items.splice(index, 1);
    },
    clearAllItems: function(){
        data.items = [];
    },
    setCurItem: function(item){
        data.currentItems = item;
    },
    getCurItem: function(){
        return data.currentItems
    },
    getTotalCalories: function(){
        let totalCalories = 0;
        data.items.forEach(item => {
            totalCalories += item.calories;
        });

        data.totalCalories = totalCalories;

        return data.totalCalories;
    },
    logData: function(){
        return data;
    }
}
})();

// UI controller
const UICtrl = (function(){
    const UISelectors = {
        itemList: '#item-list',
        addBtn: '.add-btn',
        itemNameInput: '#item-name',
        itemCaloriesInput: '#item-calories',
        totalCalories: '.total-calories',
        updateBtn: '.update-btn',
        deleteBtn: '.delete-btn',
        backBtn: '.back-btn',
        listItems: '#item-list li',
        clearBtn: '.clear-btn'
    }

    // Public medthods
    return {
        populateItemList: function(items){ 
            let html = '';
            items.forEach(item => {
                html += `<li class="collection-item" id="item-${item.id}">
                <strong>${item.name}: </strong><em> ${item.calories} Calories</em>
                <a href="#" class="secondary-content">
                    <i class="edit-item fa fa-pencil"></i>
                </a>
            </li>`
            });
            // Insert list items
            document.querySelector(UISelectors.itemList).innerHTML = html;
        },
        getItemInput: function(){
            return {
                name: document.querySelector(UISelectors.itemNameInput).value,
                calories: document.querySelector(UISelectors.itemCaloriesInput).value,
            }
        },
        addListItem: function(item){
            // Show list
            document.querySelector(UISelectors.itemList).style.display = 'block';
            // Create li element
            const li = document.createElement('li');
            li.className = 'collection-item';
            li.id = `item-${item.id}`
            // add Html
            li.innerHTML = `                
            <strong>${item.name}: </strong><em> ${item.calories} Calories</em>
            <a href="#" class="secondary-content">
                <i class="edit-item fa fa-pencil"></i>
            </a>`;
            // insert Item
            document.querySelector(UISelectors.itemList).insertAdjacentElement('beforeend',li)
        },
        updateListItem: function(item){
            let listItems = document.querySelectorAll(UISelectors.listItems);

            // Turn Node list into array
            listItems = Array.from(listItems);

            listItems.forEach(listItem => {
                const itemID = listItem.getAttribute('id');

                if(itemID === `item-${item.id}`){
                    document.querySelector(`#${itemID}`).innerHTML = `<strong>${item.name}: </strong><em> ${item.calories} Calories</em>
                    <a href="#" class="secondary-content">
                        <i class="edit-item fa fa-pencil"></i>
                    </a>`
                }
            })
        },
        deleteListItem: function(id){
            const itemID = `#item-${id}`;
            const item = document.querySelector(itemID);
            item.remove();
        },
        clearInput: function(){
            document.querySelector(UISelectors.itemNameInput).value='';
            document.querySelector(UISelectors.itemCaloriesInput).value='';
        },
        addItemToForm: function(){
            document.querySelector(UISelectors.itemNameInput).value= ItemCtrl.getCurItem().name;
            document.querySelector(UISelectors.itemCaloriesInput).value=ItemCtrl.getCurItem().calories;
            UICtrl.showEditState();
        },
        removeItems: function(){
            let listItems = document.querySelectorAll(UISelectors.listItems);

            // Turn node list into array
            listItems = Array.from(listItems);

            listItems.forEach(item => {
                item.remove();
            })
        },
        hideList: function(){
            document.querySelector(UISelectors.itemList).style.display = 'none';
        },
        showTotalCalories: function(totalCalories){
            document.querySelector(UISelectors.totalCalories).textContent = totalCalories
            
        },
        clearEditState: function(){
            UICtrl.clearInput();
            document.querySelector(UISelectors.updateBtn).style.display = 'none';
            document.querySelector(UISelectors.deleteBtn).style.display = 'none';
            document.querySelector(UISelectors.backBtn).style.display = 'none';
            document.querySelector(UISelectors.addBtn).style.display = 'inline';
        },
        showEditState: function(){
            document.querySelector(UISelectors.updateBtn).style.display = 'inline';
            document.querySelector(UISelectors.deleteBtn).style.display = 'inline';
            document.querySelector(UISelectors.backBtn).style.display = 'inline';
            document.querySelector(UISelectors.addBtn).style.display = 'none';
        },
        getSelectors: function(){
            return UISelectors;
        }
    }
})();

// App controller
const App = (function(ItemCtrl, StorageCtrl, UICtrl){
    // Load event listeners
    const loadEventListeners = function(){
        // get UI selectors
        const UISelectors = UICtrl.getSelectors();

        // Add Item event
        document.querySelector(UISelectors.addBtn).addEventListener('click', itemAddSubmit);

        // Disable submit on Enter
        document.addEventListener('keypress', function(e){
            if(e.keyCode === 13 || e.which === 13){
                e.preventDefault();
                return false
            }
        })

        // Edit icon click
        document.querySelector(UISelectors.itemList).addEventListener('click', itemEditClick);

        // Updata item
        document.querySelector(UISelectors.updateBtn).addEventListener('click', itemUpdateSubmit);

        // Delete item
        document.querySelector(UISelectors.deleteBtn).addEventListener('click', itemDeleteSubmit);

        // Back button event
        document.querySelector(UISelectors.backBtn).addEventListener('click', e => {
            UICtrl.clearEditState();
            e.preventDefault();
        });

        // clear item
        document.querySelector(UISelectors.clearBtn).addEventListener('click', clearAllItemClick);
    }

    // Add item submit
    const itemAddSubmit = function(e){
        // get form input from UI controller
        const input = UICtrl.getItemInput()

        // Check for form
        if(input.name !== '' && input.calories !== ''){
            // add item
            const newItem = ItemCtrl.addItem(input.name, input.calories)
            // add item to UI
            UICtrl.addListItem(newItem)
            // Get total calories
            const totalCalories = ItemCtrl.getTotalCalories()
            // Add total calories to the UI
            UICtrl.showTotalCalories(totalCalories)
            // Store to local storage
            StorageCtrl.storeItem(newItem)
            // Clear input
            UICtrl.clearInput()
        }
        e.preventDefault();
    }
    // Edit Item
    const itemEditClick = function(e){
        if(e.target.classList.contains('edit-item')){
            // get list item id (item-0, item-1)
            const listId = e.target.parentNode.parentNode.id;
            // break into and array
            const listIdArr = listId.split('-');

            // get the id 
            const id = parseInt(listIdArr[1]);

            // get item
            const itemToEdit = ItemCtrl.getItemById(id);

            // set cur Item
            ItemCtrl.setCurItem(itemToEdit)

            // Add Item to form
            UICtrl.addItemToForm()
        }

        e.preventDefault();
    }

    // Update item submit
    const itemUpdateSubmit = function(e){
        // get item input
        const input = UICtrl.getItemInput();
        
        //Update Item
        const updatedItem = ItemCtrl.updateItem(input.name, input.calories);

        //Update UI
        UICtrl.updateListItem(updatedItem);

        // Get total calories
        const totalCalories = ItemCtrl.getTotalCalories()

        // Add total calories to the UI
        UICtrl.showTotalCalories(totalCalories);

        // Update local storage
        StorageCtrl.updateItemStorage(updatedItem);

        UICtrl.clearEditState();

        e.preventDefault();
    }

    // Delete button event
    const itemDeleteSubmit = function(e){
        // get current item
        const currentItem = ItemCtrl.getCurItem();

        // Delete from data structure
        ItemCtrl.deleteItem(currentItem.id);

        // Delete from UI
        UICtrl.deleteListItem(currentItem.id);

        // Get total calories
        const totalCalories = ItemCtrl.getTotalCalories()

        // Add total calories to the UI
        UICtrl.showTotalCalories(totalCalories)

        // Delete from local storage
        StorageCtrl.deleteItemFromStorage(currentItem.id)

        UICtrl.clearEditState();

        e.preventDefault();
    }
    
    // Clear all item
    clearAllItemClick = function(){
        // Delete all items from data structure
        ItemCtrl.clearAllItems();

        // Remove from UI
        UICtrl.removeItems();

        // Get total calories
        const totalCalories = ItemCtrl.getTotalCalories()

        // Add total calories to the UI
        UICtrl.showTotalCalories(totalCalories)

        // Clear from Local storage
        StorageCtrl.clearItemsFromStorage();

        // hide the ul
        UICtrl.hideList()
    }
    
    // Public Methods
    return{
        init: function(){
            // Set initial state
            UICtrl.clearEditState();
            //fetch Items from data structure
            const items = ItemCtrl.getItems();

            //check if any items
            if(items.length === 0){
                UICtrl.hideList()    
            }else{
                //populate list w/ items
                UICtrl.populateItemList(items)
            }

            // Get total calories
            const totalCalories = ItemCtrl.getTotalCalories()
            // Add total calories to the UI
            UICtrl.showTotalCalories(totalCalories)

            //load event listeners
            loadEventListeners();
        }
    }

})(ItemCtrl,StorageCtrl, UICtrl);

// Initialize App
App.init()