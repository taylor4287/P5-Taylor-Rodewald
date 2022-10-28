// get price from search params
const params = new URLSearchParams(window.location.search);

// get dataURL
const dataURL = 'http://localhost:3000/api/products/';

// create priceData element
const priceDataURL = new URLSearchParams('http://localhost:3000/api/products/');

// need a price object to store the prices by id - {productId: price}
// function to initialize price object
const priceObj = {
};

// get cart
let cartJSON = localStorage.getItem('cart') || '[]';
let cart = JSON.parse(cartJSON);

// use fetch
fetch(dataURL)
  .then((res) => res.json())
  .then((data) => {
    initializePriceObj(data);
    // return if needed
  })
  // building the cart items
  .then(() => {
    buildCartItems(cart);
  })
  // adding the listeners
  .then(() => {
    if (cart.length !== 0) {
      addEventListeners();
      updateQuantities();
      updatePrice();
      orderInput();
      initOrderItems(cart);
    }
  })
  .catch((error) => console.log(error));

// build cart item function
function buildCartItems(dataArray) {
  // running the for-loop
  for (let i=0; i<dataArray.length; i++) {
    // use template literal 
    let item =
    `
      <article class="cart__item" data-id=${dataArray[i]._id} data-color=${dataArray[i].color}>
        <div class="cart__item__img">
          <img src=${dataArray[i].imageUrl} alt=${dataArray[i].altTxt}>
        </div>
        <div class="cart__item__content">
          <div class="cart__item__content__description">
            <h2>${dataArray[i].name}</h2>
            <p>${dataArray[i].color}</p>
            <p>${priceObj[dataArray[i]._id]/100}</p>
          </div>
          <div class="cart__item__content__settings">
            <div class="cart__item__content__settings__quantity">
              <p>Qté : </p>
              <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value=${cart[i].qty}>
            </div>
            <div class="cart__item__content__settings__delete">
              <p class="deleteItem">Delete</p>
            </div>
          </div>
        </div>
      </article>
    `;
    // grabing and inserting the cart items
    const cartItemList = document.getElementById('cart__items');
    cartItemList.insertAdjacentHTML('afterbegin', item);
  }
}

// adding listeners function
function addEventListeners() {
  const deleteBtn = document.getElementsByClassName('deleteItem');
  for(let i=0; i<deleteBtn.length; i++) {
    deleteBtn[i].addEventListener('click', deleteFunction);
  }
  
  const qtyBtn = document.getElementsByClassName('itemQuantity');
  for(let i=0; i<qtyBtn.length; i++) {
    qtyBtn[i].addEventListener('change', handleQtyBtn);
  }
}

function deleteFunction(e) {
  // find and delete item from cart array
  const cartItem = e.target.parentElement.parentElement.parentElement.parentElement;
 
  const dataId = cartItem.dataset.id;
  const dataColor = cartItem.dataset.color;

  for(let i = 0; i < cart.length; i++){ 
    if (cart[i]._id === dataId && 
        cart[i].color === dataColor) { 
        cart.splice(i, 1); 
    }
  }
  // update the localStorage
  syncCart();

  // update total  quantity and total price
  updateQuantities();
  updatePrice();

  // remove the cart item from the view
  cartItem.remove();
}

// function to handle the quantity button
function handleQtyBtn (data) {
  const input = data.target;
  const value = input.value;
  const cartItem = input.parentElement.parentElement.parentElement.parentElement;
  const dataId = cartItem.dataset.id;
  const dataColor = cartItem.dataset.color;

  // for loop to update quantity for correct product
  for (let i=0; i<cart.length; i++) {
    if (cart[i]._id === dataId &&
      cart[i].color === dataColor) {
        cart[i].qty = value;
      }
  }
  syncCart();
  updateQuantities();
  updatePrice();
}

// function to update total quantity
function updateQuantities() {
  let total = document.getElementById('totalQuantity');
  let totalQty = 0;
  for (let i = 0; i < cart.length; i++) {
    totalQty += parseInt(cart[i].qty, 10);
  }
  total.innerHTML = totalQty;
};

// function to update total price
function updatePrice() {
  let totals = document.getElementById('totalPrice');
  let totalPrice = 0;
  for(let i=0; i<cart.length; i++) {
    totalPrice += parseInt(cart[i].qty, 10) * priceObj[cart[i]._id]/100;
  };
  totals.innerHTML = totalPrice;
};

// function to initialize priceObj
function initializePriceObj(dataArray) {
  for(let i = 0; i<cart.length; i++) {
    // id of product = value of product
    priceObj[cart[i]._id] = dataArray[i].price;
  }
  syncCart();
}

// function to sync cart and localStorage
function syncCart () {
  localStorage.setItem('cart', JSON.stringify(cart));
  cart = JSON.parse(localStorage.getItem('cart'));
}

// object to store order
const order = {
  contact: {
   firstName: '',
   lastName: '',
   address: '',
   city: '',
   email: ''
 },
 products: []
}

// function to initialize order items
function initOrderItems (cart) {
  let lastName = order.contact.lastName;
  let address = order.contact.address;
  let city = order.contact.city; 
  let email = order.contact.email;

  for (let i=0; i<cart.length; i++) {
    order.products.push(cart[i]._id);
  }
}

// function to get the input items
function orderInput () {
  const firstName = document.getElementById('firstName');
  firstName.addEventListener('input', handleFirstName);

  const lastName = document.getElementById('lastName');
  lastName.addEventListener('input', handleLastName);

  const address = document.getElementById('address');
  address.addEventListener('input', handleAddress);

  const city = document.getElementById('city');
  city.addEventListener('input', handleCity);

  const email = document.getElementById('email');
  email.addEventListener('input', handleEmail);

  const order = document.getElementById('order');
  order.addEventListener('click', submitOrder);
};

// functions to handle the input items
function handleFirstName(e) {
  const firstName = document.getElementById('firstName');
  order.contact.firstName = firstName.value;
  checkFirstName();
}

function handleLastName(e) {
  const lastName = document.getElementById('lastName');
  order.contact.lastName = lastName.value;
  checkLastName();
}

function handleAddress(e) {
  const address = document.getElementById('address');
  order.contact.address = address.value;
  checkAddress();
}

function handleCity(e) {
  const city = document.getElementById('city');
  order.contact.city = city.value;
  checkCity();
}

function handleEmail(e) {
  const email = document.getElementById('email');
  order.contact.email = email.value;
  checkEmail();
}

// form data 
// regular expressions for validation
let emailRegExp = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i; 
let charAlphaRegExp = /^[A-Za-z -]{3,32}$/;
let addressRegExp = /^[A-Za-z0-9 ]{7,32}$/; 

//getting access to form data in the DOM
let form = document.querySelector('.cart__order__form');
let firstNameErrorMsg = document.getElementById('firstNameErrorMsg');
let lastNameErrorMsg = document.getElementById('lastNameErrorMsg');
let addressErrorMsg = document.getElementById('addressErrorMsg');
let cityErrorMsg = document.getElementById('cityErrorMsg');
let emailErrorMsg = document.getElementById('emailErrorMsg');

// boolean for form data
let validFirstName = false;
let validLastName = false;
let validAddress = false;
let validCity = false;
let validEmail = false;

// functions to check form data
function checkFirstName() {
  if (charAlphaRegExp.test(firstName.value)) {
    firstNameErrorMsg.innerHTML = null;
    firstName.style.border = '2px solid green';
    validFirstName = true;
  } else if (charAlphaRegExp.test(firstName.value) === false||firstName.value === '') {
    firstNameErrorMsg.innerHTML = 'Please enter a valid first name';
    firstName.style.border = '2px solid red';
    validFirstName = false;
  }
};

function checkLastName() {
  if (charAlphaRegExp.test(lastName.value)) {
    lastNameErrorMsg.innerHTML = null;
    lastName.style.border = '2px solid green';
    validLastName = true;
  } else if (charAlphaRegExp.test(lastName.value) === false||lastName.value === '') {
    lastNameErrorMsg.innerHTML = 'Please enter a valid last name';
    lastName.style.border = '2px solid red';
    validLastName = false;
  }
};

function checkAddress() {
  if (addressRegExp.test(address.value)) {
    addressErrorMsg.innerHTML = null;
    address.style.border = '2px solid green';
    validAddress = true;
  } else if (addressRegExp.test(address.value) === false||address.value === '') {
    addressErrorMsg.innerHTML = 'Please enter a valid address';
    address.style.border = '2px solid red';
    validAddress = false;
  }
};

function checkCity() {
  if (charAlphaRegExp.test(city.value)) {
    cityErrorMsg.innerHTML = null;
    city.style.border = '2px solid green';
    validCity = true;
  } else if (charAlphaRegExp.test(city.value) === false||city.value === '') {
    cityErrorMsg.innerHTML = 'Please enter a valid city';
    city.style.border = '2px solid red';
    validCity = false;
  }
};

function checkEmail() {
  if (emailRegExp.test(email.value)) {
    emailErrorMsg.innerHTML = null;
    email.style.border = '2px solid green';
    validEmail = true;
  } else if (emailRegExp.test(email.value) === false||email.value === '') {
    emailErrorMsg.innerHTML = 'Please enter a valid email';
    email.style.border = '2px solid red';
    validEmail = false;
  }
};

// function for submit button
function submitOrder(e) {
  e.preventDefault();
  if (validFirstName && validLastName && validAddress && validCity && validEmail) {
    fetch('http://localhost:3000/api/products/order', {
      method: 'POST',
      headers: {
      'Content-Type': 'application/json'
      },
      body: JSON.stringify(order)
    }) .then(function (response) {
      return response.json();
    }).then(function (data) {
      localStorage.clear();
      pageRedirect(data);
    }).catch(function (error) {
      console.log(error);
    })
  }
};

// function to redirect user to confirmation page
function pageRedirect(data) {
  const newPage = './confirmation.html?id=' + data.orderId;
  window.location.href = newPage;
}