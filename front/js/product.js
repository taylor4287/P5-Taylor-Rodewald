// get id from search params - URL
const params = new URLSearchParams(window.location.search);

const _id = params.get('id');

const productItem = 'http://localhost:3000/api/products/' + _id;

// object for specific product
const cartItem = {
  name: '',
  description: '',
  _id: '',
  imageUrl: '',
  altTxt: '',
  color: '',
  qty: 1,
}

// Cart Array from local storage
let cartJSON = localStorage.getItem('cart') || '[]';
let cart = JSON.parse(cartJSON);

// Fetching the item
fetch(productItem)
  .then((response) => response.json()) // implicit return
  .then((data) => {
    makeProduct(data); // call function, pass in argument
    initProdItem(data);
  })
  .then()
  .catch((error) => console.log(error));

// function to initialize the product items
function initProdItem(dataCard) {
  cartItem._id = dataCard._id;
  cartItem.name = dataCard.name;
  cartItem.description = dataCard.description;
  cartItem.color = dataCard.colors;
  cartItem.imageUrl = dataCard.imageUrl;
  cartItem.altTxt = dataCard.altTxt;
}

// function declaration, create parameters
function makeProduct(dataCard) {

  // handle image
  const imageDiv = document.getElementsByClassName('item__img')[0];
  const itemImg = document.createElement('img');
  itemImg.setAttribute('src', dataCard.imageUrl);
  itemImg.setAttribute('alt', dataCard.altTxt);
  imageDiv.appendChild(itemImg);

  // add title content
  const title = document.getElementById('title');
  title.innerText = dataCard.name;

  // add price content
  const price = document.getElementById('price');
  price.innerText = dataCard.price / 100;

  // add description content
  const description = document.getElementById('description');
  description.innerText = dataCard.description;

  // adding listeners to DOM elements
  const addToCartButton = document.getElementById('addToCart');
  addToCartButton.addEventListener('click', addToCartClicked);

  const productQuantity = document.getElementById('quantity');
  productQuantity.addEventListener('change', quantityUpdated);

  // create option tags for the pulldown menu
  addPulldown(dataCard.colors)
};

// handle the drop-down menu
function addPulldown(colors) {
  // add color options
  const colorOptions = document.getElementById('colors');
  const length = colors.length;

  // adding listeners to color option element
  colorOptions.addEventListener('change', handlePullDown);

  // loop for the color options
  for (let i = 0; i<colors.length; i++) {
    // create elements
    const option = document.createElement('option');

    // add value attributes
    option.value = colors[i];
    option.innerText = colors[i];

    // append children
    colorOptions.appendChild(option);
  };
}

// listener function for drop-down menu
function handlePullDown(e) {
  const input = e.target;
  const value = input.value;
  cartItem.color = value;
}

// listener function for quantity selector
function quantityUpdated(number) {
  const input = number.target;
  const value = input.value;
  cartItem.qty = value;
}

// add to cart function
function addToCartClicked(event) {
  // create conditional - assumming we push
  let addedToCart = true;

  /* create the cases:
    1 - nothing in cart
    2 - things in cart, but not the same product name
    3 - things in cart, some with same product name
  */

  // first case
  if (cart.length === 0) {
    addedToCart = true;
  }

  // second and third case
  for (let i=0; i<cart.length; i++) {
    if (cartItem.name === cart[i].name &&
      cartItem.color === cart[i].color) {
        addedToCart = false;
        cart[i].qty = cartItem.qty;
      }
    }

  if (addedToCart) {
    cart.push(cartItem);
  }
  syncCart();
}

// function to sync cart and localStorage
function syncCart () {
  localStorage.setItem('cart', JSON.stringify(cart));
  cart = JSON.parse(localStorage.getItem('cart'));
}