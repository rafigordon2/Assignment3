/* Navigation between pages */
document.addEventListener('DOMContentLoaded', function() {
    function addClickListener(selector, url) {
        var elements = document.querySelectorAll(selector);
        elements.forEach(function(element) {
            element.addEventListener('click', function() {
                window.location.href = url;
            });
        });
    }
    /* Shorthand links between pages */
    addClickListener('.site-title', 'index.html');
    addClickListener('.search', 'dogproducts.html');
    addClickListener('.checkout-site-title', 'index.html');
    addClickListener('.checkoutconfirm-site-title', 'index.html');
    addClickListener('.dog-image', 'dogproducts.html');
    addClickListener('.dog-products', 'dogproducts.html');
    addClickListener('.product-card', 'product.html');
    addClickListener('.product-card-home', 'product.html');
    addClickListener('.left-arrow', 'index.html');
    addClickListener('.left-arrow-product', 'dogproducts.html');
    addClickListener('.product-card', 'product.html');
    addClickListener('.cross', 'product.html');
    addClickListener('.name-price', 'cartconfirm.html');
    addClickListener('.review-cart-btn', 'cart.html');
    addClickListener('.cart-icon', 'cart.html');
    addClickListener('.cart-confrim-checkout-btn', 'checkout.html');
    addClickListener('.cart-checkout-btn', 'checkout.html');
    addClickListener('.checkout-btn', 'checkoutconfirm.html');
    addClickListener('.continue-shopping-btn', 'dogproducts.html');

    /* ID link */
    document.getElementById('continueShopping').addEventListener('click', function() {
        window.location.href = 'dogproducts.html';
    });
});

/* Directing user to products on search bar entry */
document.getElementById('input').addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {
        window.location.href = 'dogproducts.html';
    }
});


/* Product info retrieval */
function viewProduct(button) {
    /* Creating variables from the product card information */
    const productCard = button.closest('.product-card');
    const name = productCard.querySelector('h3').textContent;
    const desc = productCard.querySelectorAll('p')[0].textContent;
    const price = productCard.querySelectorAll('p')[1].textContent;
    const image = productCard.querySelector('img').src;

    const product = {name, desc, price, image, quantity: 1 }; /* Grouping variables as an object */
    localStorage.setItem('product', JSON.stringify(product));
    window.location.href = 'product.html'; /* Directing to product page with the product info */
}

/* Passing information to product page with error messages if no data found */
document.addEventListener('DOMContentLoaded', function() {
    const product = JSON.parse(localStorage.getItem('product'));
    if (product) {
        document.getElementById('productName').textContent = product.name;
        document.getElementById('productPrice').textContent = product.price;
        document.getElementById('productDesc').textContent = product.desc;
        document.getElementById('productImage').src = product.image;
    } else {
        document.getElementById('productName').textContent = 'Product not found';
        document.getElementById('productPrice').textContent = '';
        document.getElementById('productDesc').textContent = '';
        document.getElementById('productImage').src = '';
    }

});

/* Passing information to the cart */
document.addEventListener('DOMContentLoaded', function() {
    const product = JSON.parse(localStorage.getItem('product'));
    if (product) {
        document.getElementById('cartProductPrice').textContent = product.price;
        document.getElementById('cartProductImage').src = product.image;
    } else {
        document.getElementById('cartProductPrice').textContent = '';
        document.getElementById('cartProductImage').src = '';
    }
});



/* Cart Count */
document.addEventListener('DOMContentLoaded', function() {
    console.log("DOM fully loaded and parsed");
    /* Intializing cart count from local storage */
    let cartCount = localStorage.getItem('cartCount') || 0;
    document.querySelector('.cart-count').textContent = cartCount;

    /* Creating cart items on page load */
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    cart.forEach(product => {
        addCartItem(product);
    });

    updateSubtotal(); /* Subtotal pricing function */

    const product = JSON.parse(localStorage.getItem('product'));
    if (product) {
        document.getElementById('productName').textContent = product.name;
        document.getElementById('productPrice').textContent = product.price;
        document.getElementById('productDesc').textContent = product.desc;
        document.getElementById('productImage').src = product.image;
    } else {
        document.getElementById('productName').textContent = 'Product not found';
        document.getElementById('productPrice').textContent = '';
        document.getElementById('productDesc').textContent = '';
        document.getElementById('productImage').src = '';
    }
});

/* Adding items to cart */
document.getElementById('add-to-cart').addEventListener('click', function() {
    const product = JSON.parse(localStorage.getItem('product'));
    if (product) {
        addToCart(product);
    }
});

function addToCart(product) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    cart.push(product);
    localStorage.setItem('cart', JSON.stringify(cart));

    let cartCount = parseInt(document.querySelector('.cart-count').textContent);
    cartCount += 1; /* Adjusting the cart count */
    localStorage.setItem('cartCount', cartCount);
    document.querySelector('.cart-count').textContent = cartCount;

    addCartItem(product);
    updateSubtotal();
}

function addCartItem(product) {
    const cartItemsContainer = document.getElementById('cartItems');
    const cartItem = document.createElement('article');
    cartItem.classList.add('cart-item');

    /* Creating the cart HTML elements for each item with their data */
    cartItem.innerHTML = `
        <img class="cart-product" src="${product.image}" alt="${product.name}">
        <h1>${product.name}</h1>
        <p>${product.price}</p>
        <span class="quantity">
            <img src="Assets/Minus.png" alt="Minus" class="minus">
            <p id="quantityCount">${product.quantity}</p>
            <img src="Assets/Plus.png" alt="Plus" class="plus">
        </span>
        <p>${product.price}</p>
    `;

    /* Inserting new cart item at the beginning of the list */
    cartItemsContainer.insertBefore(cartItem, cartItemsContainer.firstChild);

    /* Adjusting quantity with minus and plus buttons */
    cartItem.querySelector('.minus').addEventListener('click', () => updateQuantity(product.name, -1));
    cartItem.querySelector('.plus').addEventListener('click', () => updateQuantity(product.name, 1));
}

function updateQuantity(productName, change) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    const productIndex = cart.findIndex(item => item.name === productName);

    if (productIndex !== -1) {
        cart[productIndex].quantity += change;

        if (cart[productIndex].quantity <= 0) {
            cart.splice(productIndex, 1); /* Remove cart item if quantity falls below 1 */
        }

        localStorage.setItem('cart', JSON.stringify(cart));

        let cartCount = cart.reduce((total, product) => total + product.quantity, 0);
        localStorage.setItem('cartCount', cartCount);
        document.querySelector('.cart-count').textContent = cartCount;

        renderCartItems();
        updateSubtotal();
    }
}

/* Calculating the subtotal prices */
function updateSubtotal() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const subtotal = cart.reduce((total, product) => total + (parseFloat(product.price.replace('$', '')) * product.quantity), 0);
    document.getElementById('subtotalAmount').textContent = `$${subtotal.toFixed(2)}`;
}


/* First render of cart items */
function renderCartItems() {
    const cartItemsContainer = document.getElementById('cartItems');
    cartItemsContainer.innerHTML = ''; /* Removing initial items */
    const cart = JSON.parse(localStorage.getItem('cart')) || [];

    cart.forEach(product => {
        const cartItem = document.createElement('article');
        cartItem.classList.add('cart-item');

        const totalPrice = (parseFloat(product.price.replace('$', '')) * product.quantity).toFixed(2);

        cartItem.innerHTML = `
            <img class="cart-product" src="${product.image}" alt="${product.name}">
            <h1>${product.name}</h1>
            <p>${product.price}</p>
            <span class="quantity">
                <img src="/Assets/Minus.png" alt="Minus" class="minus">
                <p class="quantityCount">${product.quantity}</p>
                <img src="/Assets/Plus.png" alt="Plus" class="plus">
            </span>
            <p>$${totalPrice}</p>
        `;

        cartItemsContainer.appendChild(cartItem);

        cartItem.querySelector('.minus').addEventListener('click', () => updateQuantity(product.name, -1));
        cartItem.querySelector('.plus').addEventListener('click', () => updateQuantity(product.name, 1));
    });
}

renderCartItems();






