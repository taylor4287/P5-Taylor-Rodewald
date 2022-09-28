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
      addEventListeners();
      updateQuantities();
      updatePrice();
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
            <p>${priceObj[dataArray[i].id]/100}</p>
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
    console.log(cart[i].qty)
    const cartItemList = document.getElementById('cart__items');
    cartItemList.insertAdjacentHTML('afterbegin', item);

    // cartItemList.appendChild(item);
  }
  
}

// adding listeners function
function addEventListeners(dataArray) {
  const deleteBtn = document.getElementsByClassName('deleteItem')[0];
  deleteBtn.addEventListener('click', deleteFunction);

  const qtyBtn = document.getElementsByClassName('itemQuantity')[0];
  qtyBtn.addEventListener('change', handleQtyBtn);

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
  const dataId = cartItem.dataset._id;
  const dataColor = cartItem.dataset.color;

  for(let i = 0; i < cart.length; i++){ 
    if (cart[i]._id === dataId && 
        cart[i].color === dataColor) { 
        cart.splice(i, 1); 
    }
}
  syncCart();

  cartItem.remove();
}

function handleQtyBtn (data) {
  const input = data.target;
  const value = input.value;
  console.log(value);
  for (i=0; i<cart; i++) {
    cart[i].qty = value;
    console.log(cart[i].qty);
  }
  
  console.log('qty btn touched');
  // cart.qty = value;
  console.log(cart);
  syncCart();
  updateQuantities();
}

function updateQuantities(dataArray) {
  let total = document.getElementById('totalQuantity');
  total.innerText = 0;
  // console.log(total);

  for (i = 0; i < cart.length; i++) {
   totalQty = parseInt(cart[i].qty, 10);
   total.innerText = totalQty;
   console.log(totalQty);
  };
  // console.log(total);
}

/* <div class="cart__price">
      <p>Total (<span id="totalQuantity"><!-- 2 --></span> articles) : €<span id="totalPrice"><!-- 84.00 --></span></p>
    </div> */

function updatePrice(dataArray) {
  let totalPrice = document.getElementById('totalPrice');
  totalPrice = 0;
  for(i=0; i<cart.length; i++) {
    totalPrice = totalPrice + (cart[i].qty * cart[i].price);
  }
  return totalPrice;

  // totalPrice.innerText = 0.00;
}

// 1st
function initializePriceObj(dataArray) {
  
  for(let i = 0; i<dataArray.length; i++) {
    // id of product = value of product
    priceObj[dataArray[i]._id] = dataArray[i].price;
    // console.log(priceObj[dataArray[i]._id]);
    // console.log(priceObj[dataArray[i].id]);
  }
  syncCart();
  
}

function syncCart () {
  localStorage.setItem('cart', JSON.stringify(cart));
  cart = JSON.parse(localStorage.getItem('cart'));
}