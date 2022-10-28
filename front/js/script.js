// making API element
const dataURL = 'http://localhost:3000/api/products/';

// fetch is syntactic sugar to make the concept easier to use
fetch(dataURL)
  .then((response) => response.json()) // implicit return
  .then((data) => {
    makeCards(data); // call function, pass in argument
  })
  .then()
  .catch((error) => console.log(error));

// function declaration, create parameters
function makeCards(dataArray) {
  const bucket = document.getElementById('items');

  for (let i=0; i<dataArray.length; i++) {
    const card = makeCard(dataArray[i]);
    bucket.appendChild(card);
  }
}

// function to make product cars
function makeCard(dataObj) {
  // create the elements
  const card = document.createElement('a');
  const article = document.createElement('article');
  const image = document.createElement('img');
  const name = document.createElement('h3');
  const description = document.createElement('p');

// add content to those elements
  name.innerHTML = dataObj.name;
  description.innerHTML = dataObj.description;


// set attributes
  const cardLink = './product.html?id=' + dataObj._id;
  card.setAttribute("href", cardLink);
  image.setAttribute('src',dataObj.imageUrl);
  image.setAttribute('alt',dataObj.altTxt);

// add classes to elements
  name.classList.add('productName');
  description.classList.add('productDescription');

// append child elements to parents
  article.appendChild(image);
  article.appendChild(name);
  article.appendChild(description);
  card.appendChild(article);

  return card;
}

// this is the template for each card
/*
  <a href="./product.html?id=42">
    <article>
      <img src=".../product01.jpg" alt="Lorem ipsum dolor sit amet, Kanap name1">
      <h3 class="productName">Kanap name1</h3>
      <p class="productDescription">Dis enim malesuada risus sapien gravida nulla nisl arcu. Dis enim malesuada
        risus sapien gravida nulla nisl arcu.</p>
    </article>
  </a>
*/