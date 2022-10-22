// get price from search params
const params = new URLSearchParams(window.location.search);
// console.log(params);

// let prices = params.get('price');
// console.log(prices);

// get dataURL
// const dataURL = 'http://localhost:3000/api/products/';
const dataURL = 'http://localhost:3000/api/products/';
// const prices = dataURL.getAll('price');
// console.log(dataURL);

const priceDataURL = new URLSearchParams('http://localhost:3000/api/products/');


// console.log(prices);

// need a price object to store the prices by id - {productId: price}
// function to initialize price object
const priceObj = {
  
};
console.log(priceObj);

// get cart
let cartJSON = localStorage.getItem('cart') || '[]';
let cart = JSON.parse(cartJSON);





// use fetch
fetch(dataURL)
  .then((res) => res.json())
  .then((data) => {
    console.log(data);
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
      console.log('cart has stuff in it');
      addEventListeners();
      updateQuantities();
      updatePrice();
      orderInput();
      initOrderItems(cart);
    }
  })
  .catch((error) => console.log(error))



// build cart item function
function buildCartItems(dataArray) {
  // TODO go get the spots in the DDOM I need
  // const cartItemList = document.getElementById('cart__items');
  // dataArray.imageUrl = dataURL.imageUrl;
  console.log(dataArray);
  // running the for-loop
  for (let i=0; i<dataArray.length; i++) {
    // TODO use template literals
    
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
    `
    // console.log(priceObj[dataArray[i]._id]);
    const cartItemList = document.getElementById('cart__items');
    cartItemList.insertAdjacentHTML('afterbegin', item);

    // cartItemList.appendChild(item);
  }
  
}

// adding listeners function
function addEventListeners() {
  const deleteBtn = document.getElementsByClassName('deleteItem');
  for(let i=0; i<deleteBtn.length; i++) {
    deleteBtn[i].addEventListener('click', deleteFunction);
  }
  
  const qtyBtn = document.getElementsByClassName('itemQuantity');
  console.log(qtyBtn);
  for(let i=0; i<qtyBtn.length; i++) {
    qtyBtn[i].addEventListener('change', handleQtyBtn);
  }
  

  // const total = document.getElementById('totalQuantity');
  // total.addEventListener('load', updateQuantities);
  

  // const totalPrice = document.getElementById('totalPrice');
  // totalPrice.addEventListener('mouseover', updatePrice);

}

function deleteFunction(e) {
  // remove the cart item from the view
  // update the local storage
  // update total quantity and total price
  // find and delete item from cart array
  const cartItem = e.target.parentElement.parentElement.parentElement.parentElement;
  // console.log(cartItem);
  console.log('in the delete function');
  const dataId = cartItem.dataset.id;
  const dataColor = cartItem.dataset.color;

  for(let i = 0; i < cart.length; i++){ 
    if (cart[i]._id === dataId && 
        cart[i].color === dataColor) { 
        cart.splice(i, 1); 
    }
}
  syncCart();
  updateQuantities();
  updatePrice();
  cartItem.remove();
}

function handleQtyBtn (data) {
  const input = data.target;
  const value = input.value;
  const cartItem = input.parentElement.parentElement.parentElement.parentElement;
  const dataId = cartItem.dataset.id;
  const dataColor = cartItem.dataset.color;
  console.log(dataId);
  console.log(dataColor);
  console.log(cartItem);
  for (let i=0; i<cart.length; i++) {
    if (cart[i]._id === dataId &&
      cart[i].color === dataColor) {
        cart[i].qty = value;
        console.log('made it');
      }
    
    console.log(cart[i].qty);
  
  }
  // console.log(cart.qty);

  console.log('qty btn touched');
  // cart.qty = value;
  // console.log(cart);
  syncCart();
  updateQuantities();
  updatePrice();
}

function updateQuantities(dataArray) {
  let total = document.getElementById('totalQuantity');
  // total.innerText = 0;
  // console.log(total);
  totalQty = 0;
  for (let i = 0; i < cart.length; i++) {
    totalQty += parseInt(cart[i].qty, 10);
  //  total.innerText = totalQty;
  //  console.log(totalQty);
  };
  total.innerHTML = totalQty;
  // console.log(total);
};

/* <div class="cart__price">
      <p>Total (<span id="totalQuantity"><!-- 2 --></span> articles) : €<span id="totalPrice"><!-- 84.00 --></span></p>
    </div> */

function updatePrice(dataArray) {
  let totals = document.getElementById('totalPrice');
  totalPrice = 0;
  equal = 0;
  // console.log(cart.qty);
  for(let i=0; i<cart.length; i++) {
    totalPrice += parseInt(cart[i].qty, 10) * priceObj[cart[i]._id]/100;
    // console.log(priceObj[cart[i]._id]/100);
    // console.log(equal += parseInt(cart[i].qty, 10));
  };
  totals.innerHTML = totalPrice;
  // console.log(totals);
  // return totalPrice;

  // totalPrice.innerText = 0.00;
};

// 1st
function initializePriceObj(dataArray) {
  
  for(let i = 0; i<cart.length; i++) {
    // id of product = value of product
    priceObj[cart[i]._id] = dataArray[i].price;
    // console.log(priceObj[cart[i]._id]/100);
    // console.log(priceObj[dataArray[i].id]);
  }
  syncCart();
  
}

function syncCart () {
  localStorage.setItem('cart', JSON.stringify(cart));
  cart = JSON.parse(localStorage.getItem('cart'));
}

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



// cart.post('/api', (requst, response) => {
//   console.log(request);
// });

// fetch('/api', options);

// fetch(order, {
//   method: 'POST',
//   headers: {
//     'Content-Type': 'application/json',
//   },
//   body: JSON.stringify(order),
// })
//   .then((response) => response.json())
//   .then((data) => {
//     console.log('Success:', data);
//   })
//   .catch((error) => {
//     console.error('Error:', error);
//   });

function initOrderItems (cart) {
  // order.contact.firstName = firstName;
  order.contact.lastName = lastName;
  order.contact.address = address;
  order.contact.city = city; 
  order.contact.email = email;
  
  for (let i=0; i<cart.length; i++) {
    order.products.push(cart[i]._id);
    
    console.log(order);
  }
}

function orderInput () {
  const firstName = document.getElementById('firstName');
  firstName.addEventListener('input', handleFirstName);
  // console.log(firstName.value);

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



function handleFirstName(e) {
  const firstName = document.getElementById('firstName');

  order.contact.firstName = firstName.value;
  // checkFirstName();
};

function handleLastName(e) {
  const lastName = document.getElementById('lastName');

  order.contact.lastName = lastName.value;
  // checklastName();
};

function handleAddress(e) {
  const address = document.getElementById('address');

  order.contact.address = address.value;
};

function handleCity(e) {
  const city = document.getElementById('city');

  order.contact.city = city.value;
  // checkCity();
};

function handleEmail(e) {
  const email = document.getElementById('email');

  order.contact.email = email.value;
};

// form data 
// regular expressions for validation
let emailRegExp = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i; 
let charAlphaRegExp = /^[A-Za-z -]{3,32}$/;
let addressRegExp = /^[A-Za-z0-9 ]{7,32}$/; 

//getting access to form data in the DOM
let form = document.querySelector('.cart__order__form');
let firstName = document.getElementById('firstName');
let lastName = document.getElementById('lastName');
let address = document.getElementById('address');
let city = document.getElementById('city');
let email = document.getElementById('email');

let validFirstName = false;
let validLastName = false;
let validAddress = false;
let validCity = false;
let validEmail = false;

function checkFirstName() {
  if (charAlphaRegExp.test(firstName.value)) {
    firstNameErrorMag.innerHTML = null;
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
    lastNameErrorMag.innerHTML = null;
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
    addressErrorMag.innerHTML = null;
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
    cityErrorMag.innerHTML = null;
    city.style.border = '2px solid green';
    validCity = true;
  } else if (charAlphaRegExp.test(city.value) === false||city.value === '') {
    cityErrorMsg.innerHTML = 'Please enter a valid city';
    city.style.border = '2px solid red';
    validCity = false;
  }
};

function checkEmail() {
  if (charAlphaRegExp.test(email.value)) {
    emailErrorMag.innerHTML = null;
    email.style.border = '2px solid green';
    validEmail = true;
  } else if (charAlphaRegExp.test(email.value) === false||email.value === '') {
    emailErrorMsg.innerHTML = 'Please enter a valid email';
    email.style.border = '2px solid red';
    validEmail = false;
  }
};

function submitOrder(e) {
  e.preventDefault();
  // console.log('im here');
  fetch('http://localhost:3000/api/products/order', {
    method: 'POST',
    headers: {
    'Content-Type': 'application/json'
    },
    body: JSON.stringify(order)
  }) .then(function (response) {
    return response.json();
  }).then(function (data) {
    console.log(data);
    pageRedirect(data);
  }).catch(function (error) {
    console.log(error);
  })
};
console.log(order);
function pageRedirect(data) {
  const newPage = './confirmation.html?id=' + data.orderId;

  window.location.href = newPage;
}