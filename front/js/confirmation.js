// creating orderNumber element
const orderNumber = document.getElementById('orderId');

// grabing orderNumber from URL
orderNumber.innerHTML = window.location.href.split('=').pop();