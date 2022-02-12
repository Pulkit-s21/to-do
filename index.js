// * Select items
const alert = document.querySelector(".alert");
const form = document.querySelector(".grocery-form");
const grocery = document.getElementById("grocery");
const submitBtn = document.querySelector(".submit-btn");
const container = document.querySelector(".grocery-container");
const list = document.querySelector(".grocery-list");
const clearBtn = document.querySelector(".clear-btn");
var taskList = [];

// * edit options
let editElement;
let editFlag = false;
let editID = "";

// * Event listeners

// submit form
form.addEventListener("submit", addItem);

// clear list
clearBtn.addEventListener("click", clearItems);

// load items
window.addEventListener("DOMContentLoaded", setupItems);

// * Functions
function addItem(e) {
    // preventing the form from submitting form to internet
    e.preventDefault();
    const value = grocery.value;
    const id = new Date().getTime().toString();

    // if value is true and editFlag is false/not true
    if (value && !editFlag) {
        
        // function created at last
        createListItem(id,value);
        // display alert
        displayAlert("item added to the list", "success");
        // show conainer
        container.classList.add("show-container");
        // add to local storage
        addToLocalStorage(id, value);
        // set back to default
        setBackToDefault();

    }

    // if there is an edit input/true and editFlag is true
    else if (value && editFlag) { 
        editElement.innerHTML = value;
        displayAlert("value edited", "success");
        // edit local storage
        editLocalStorage(editID, value);
        setBackToDefault();
    }
        
    else {
        displayAlert("please enter a value", "danger");
    }
}

// display alert
function displayAlert(text, action) {
    alert.textContent = text;
    alert.classList.add(`alert-${action}`);

    // remove alert
    setTimeout(function () {
        alert.textContent = "";
        alert.classList.remove(`alert-${action}`);
    }, 900);
}

// clear items
function clearItems() {
    const items = document.querySelectorAll(".grocery-item");

    // only do it when the list has items in it
    if (items.length > 0) {
        items.forEach(function (item) {
            list.removeChild(item);
        });
    }

    // dont want to show clear list button anymore
    container.classList.remove("show-container");

    // display alert that task is done..action is ur choice
    displayAlert("list cleared", "danger");
    localStorage.removeItem("list");
    setBackToDefault();
}

// delete function
function deleteItem(e) {
    // parentElement of the parentElement of the task we click on
    const element = e.currentTarget.parentElement.parentElement;
    const id = element.dataset.id; //cz we named it id above
    list.removeChild(element);
    if (list.children.length === 0) {
        container.classList.remove("show-container");
    }
    displayAlert("item removed", "danger");
    setBackToDefault();

    // remove from local storage
    removeFromLocalStorage(id);
}
// edit function
function editItem(e) {
    // parentElement of the parentElement of the task we click on
    const element = e.currentTarget.parentElement.parentElement;
    // set edit item

    // we are going to the parentElement and then accessing the title in that parentElement 

    editElement = e.currentTarget.parentElement.previousElementSibling;
    // set form value
    grocery.value = editElement.innerHTML;
    editFlag = true;
    editID = element.dataset.id;
    submitBtn.innerHTML = "edit";
}
// set back to default
function setBackToDefault() {
    grocery.value = "";
    editFlag = false;
    editID = "";
    submitBtn.textContent = "submit";
}

// * Local storage
function addToLocalStorage(id, value) {
    const grocery = { id, value };
    let items = getLocalStorage();
    items.push(grocery);
    localStorage.setItem("list", JSON.stringify(items));
  }

function removeFromLocalStorage(id) {
    let items = getLocalStorage();
    items = items.filter(function (item) {
        if (item.id !== id) {
            return item;
        }
    })
    localStorage.setItem("list",JSON.stringify(items));
}

// the editLocalStorage function didnt work earlier cz I used editId instead of id
function editLocalStorage(id, value) {
    let items = getLocalStorage();
    // we knw it will return an array so we can use methods associated with array
    items = items.map(function (item) {
        if (item.id === id) {
            item.value = value;
        }
        return item;
    })
    localStorage.setItem("list",JSON.stringify(items));
}

function getLocalStorage() {
    return localStorage.getItem("list") ? JSON.parse(localStorage.getItem("list")) : [];
}

// localStorage.setItem("orange", JSON.stringify(["item1", "item2"]));
// const oranges = JSON.parse(localStorage.getItem("orange"));
// console.log(oranges);
// localStorage.removeItem("orange");

// * Setup items
function setupItems() {
    let items = getLocalStorage();
    if (items.length > 0) {
        items.forEach(function (item) {
            createListItem(item.id,item.value);
        })
        container.classList.add("show-container");
    }
}

function createListItem(id, value) {
    const element = document.createElement("article");
        // add class
        element.classList.add("grocery-item");
        // add id
        const attr = document.createAttribute("data-id");
        attr.value = id;
        // adding the attr to the element
        element.setAttributeNode(attr);
        element.innerHTML = 

        `<p class="title">${value}</p>
        <div class="btn-container">
            <button type="button" class="edit-btn">
            <i class="fas fa-edit">
            </i></button>
            <button type="button" class="delete-btn">
            <i class="fas fa-trash">
            </i></button>
        </div>`;

        // taskList.push(value);
        
        // * We accessed them here and not in the start because the edit and delete btn arent available in the start are only present after user enters an item in the list
        const deleteBtn = element.querySelector(".delete-btn");
        const editBtn = element.querySelector(".edit-btn");

        deleteBtn.addEventListener("click", deleteItem);
        editBtn.addEventListener("click", editItem);

        // append child 
        list.appendChild(element);
}