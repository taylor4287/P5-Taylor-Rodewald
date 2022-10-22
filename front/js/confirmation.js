const orderNumber = document.getElementById('orderId');

orderNumber.innerHTML = window.location.href.split('=').pop();