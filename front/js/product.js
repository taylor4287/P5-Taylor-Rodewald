// get id from search params - URL
const params = new URLSearchParams(window.location.search);
// console.log(params);

const _id = params.get('id');
// console.log(id);

const productItem = 'http://localhost:3000/api/products/' + _id;
console.log(productItem)

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
// console.log(cart);

// Fetching the item
fetch(productItem)
  .then((response) => response.json()) // implicit return
  .then((data) => {
    console.log(data);

    makeProduct(data); // call function, pass in argument
    initProdItem(data);
  })
  .then()
  .catch((error) => console.log(error));

function initProdItem(dataCard) {
  cartItem._id = dataCard._id;
  cartItem.name = dataCard.name;
  // cartItem.price = dataCard.price;
  cartItem.description = dataCard.description;
  cartItem.color = dataCard.colors;
  cartItem.imageUrl = dataCard.imageUrl;
  cartItem.altTxt = dataCard.altTxt;
}

// function declaration, create parameters
function makeProduct(dataCard) {

  // handle image
  const imageDiv = document.getElementsByClassName('item__img')[0];
    // console.log(imageDiv);
  const itemImg = document.createElement('img');
  itemImg.setAttribute('src', dataCard.imageUrl);
  itemImg.setAttribute('alt', dataCard.altTxt);
  // console.log(itemImg);
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
  // console.log(productQuantity);

  // create option tags for the pulldown menu
  addPulldown(dataCard.colors)
};

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
    // console.log(colors[i]);
    option.value = colors[i];
    option.innerText = colors[i];

    // append children
    colorOptions.appendChild(option);
  };
}

function handlePullDown(e) {
  const input = e.target;
  const value = input.value;
  cartItem.color = value;
  console.log(value);
}

function quantityUpdated(number) {
  const input = number.target;
  const value = input.value;
  cartItem.qty = value;
  console.log(value);
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
        // cartItem.qty++;
        cart[i].qty = cartItem.qty;
      }
    }

  if (addedToCart) {
    cart.push(cartItem);
  }
  
  console.log('clicked');
  console.log(cart);
  
  syncCart();
}

function syncCart () {
  localStorage.setItem('cart', JSON.stringify(cart));
  cart = JSON.parse(localStorage.getItem('cart'));
}