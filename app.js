
// ==============================
// QUICKBITE - FOOD PRODUCTS
// ==============================

const products = [
    {
        id: 1,
        name: "Classic Veg Burger",
        category: "Burger",
        description: "Crispy patty, fresh lettuce and signature sauce.",
        price: 129,
        image: "🍔",
        tag: "Bestseller"
    },
    {
        id: 2,
        name: "Margherita Pizza",
        category: "Pizza",
        description: "Mozzarella, basil and rich tomato sauce.",
        price: 249,
        image: "🍕",
        tag: "Popular"
    },
    {
        id: 3,
        name: "Paneer Tikka Wrap",
        category: "Wraps",
        description: "Spiced paneer and crunchy vegetables.",
        price: 179,
        image: "🌯",
        tag: "Chef's Pick"
    },
    {
        id: 4,
        name: "Masala Fries",
        category: "Sides",
        description: "Golden crispy fries with Indian spices.",
        price: 89,
        image: "🍟",
        tag: ""
    },
    {
        id: 5,
        name: "Chocolate Brownie",
        category: "Dessert",
        description: "Rich and delicious chocolate brownie.",
        price: 99,
        image: "🍫",
        tag: "Sweet Treat"
    },
    {
        id: 6,
        name: "Double Cheese Pizza",
        category: "Pizza",
        description: "Loaded with extra cheese and herbs.",
        price: 299,
        image: "🍕",
        tag: ""
    },
    {
        id: 7,
        name: "Crispy Veg Burger",
        category: "Burger",
        description: "Crunchy veggie patty with creamy sauce.",
        price: 149,
        image: "🍔",
        tag: ""
    },
    {
        id: 8,
        name: "Loaded Nachos",
        category: "Sides",
        description: "Nachos topped with cheese and salsa.",
        price: 139,
        image: "🧀",
        tag: ""
    },
    {
        id: 9,
        name: "Strawberry Cheesecake",
        category: "Dessert",
        description: "Creamy cheesecake with strawberry topping.",
        price: 159,
        image: "🍰",
        tag: "New"
    }
];

// ==============================
// ELEMENTS
// ==============================

const productsContainer = document.getElementById("products");
const cartButton = document.getElementById("cartButton");
const cartPanel = document.getElementById("cartPanel");
const closeCartButton = document.getElementById("closeCart");
const overlay = document.getElementById("overlay");
const cartItems = document.getElementById("cartItems");
const cartCount = document.getElementById("cartCount");
const cartTotal = document.getElementById("cartTotal");
const checkoutButton = document.getElementById("checkoutButton");
const checkoutModal = document.getElementById("checkoutModal");
const closeCheckoutButton = document.getElementById("closeCheckout");
const checkoutForm = document.getElementById("checkoutForm");
const searchInput = document.getElementById("searchInput");
const toast = document.getElementById("toast");

// ==============================
// CART DATA
// ==============================

let cart = {};

try {
    cart = JSON.parse(localStorage.getItem("quickbiteCart") || "{}");
} catch (error) {
    cart = {};
}

let activeCategory = "All";
let toastTimer;

function saveCart() {
    localStorage.setItem("quickbiteCart", JSON.stringify(cart));
    updateCart();
}

function formatPrice(price) {
    return "₹" + price.toFixed(2);
}

// ==============================
// DISPLAY PRODUCTS
// ==============================

function renderProducts() {
    const search = searchInput.value.trim().toLowerCase();

    const filteredProducts = products.filter(product => {
        const categoryMatch =
            activeCategory === "All" ||
            product.category === activeCategory;

        const searchMatch =
            product.name.toLowerCase().includes(search) ||
            product.description.toLowerCase().includes(search) ||
            product.category.toLowerCase().includes(search);

        return categoryMatch && searchMatch;
    });

    if (filteredProducts.length === 0) {
        productsContainer.innerHTML =
            "<p>No food found. Try another search.</p>";
        return;
    }

    productsContainer.innerHTML = filteredProducts.map(product => `
        <article class="product-card">

            <div class="product-image">
                ${product.tag ? `<small>${product.tag}</small>` : ""}
                <span>${product.image}</span>
            </div>

            <div class="product-info">

                <span class="category">${product.category}</span>

                <h3>${product.name}</h3>

                <p>${product.description}</p>

                <div class="product-bottom">

                    <strong class="product-price">
                        ${formatPrice(product.price)}
                    </strong>

                    <button class="add-to-cart" data-add="${product.id}">
                        + Add
                    </button>

                </div>
            </div>

        </article>
    `).join("");
}

// ==============================
// CART CALCULATIONS
// ==============================

function getCartQuantity() {
    return Object.values(cart).reduce(
        (total, quantity) => total + quantity,
        0
    );
}

function getCartTotal() {
    return Object.entries(cart).reduce((total, [id, quantity]) => {
        const product = products.find(item => item.id === Number(id));

        return product ? total + product.price * quantity : total;
    }, 0);
}

// ==============================
// UPDATE CART
// ==============================

function updateCart() {
    cartCount.textContent = getCartQuantity();

    const entries = Object.entries(cart).filter(
        ([, quantity]) => quantity > 0
    );

    if (entries.length === 0) {
        cartItems.innerHTML = `
            <div class="empty-cart">
                <h3>🛍️ Your cart is empty</h3>
                <p>Add something delicious from our menu.</p>
            </div>
        `;
    } else {
        cartItems.innerHTML = entries.map(([id, quantity]) => {
            const product = products.find(
                item => item.id === Number(id)
            );

            if (!product) return "";

            return `
                <div class="cart-item">

                    <div>
                        <strong>${product.image} ${product.name}</strong>
                        <p>${formatPrice(product.price)}</p>

                        <div class="quantity">

                            <button data-change="${id}" data-delta="-1">
                                −
                            </button>

                            <span>${quantity}</span>

                            <button data-change="${id}" data-delta="1">
                                +
                            </button>

                        </div>
                    </div>

                    <strong>
                        ${formatPrice(product.price * quantity)}
                    </strong>

                </div>
            `;
        }).join("");
    }

    cartTotal.textContent = getCartTotal().toFixed(2);
}

// ==============================
// TOAST MESSAGE
// ==============================

function showToast(message) {
    toast.textContent = message;
    toast.classList.add("show");

    clearTimeout(toastTimer);

    toastTimer = setTimeout(() => {
        toast.classList.remove("show");
    }, 2500);
}

// ==============================
// OPEN AND CLOSE CART
// ==============================

function openCart() {
    cartPanel.classList.add("open");
    overlay.classList.add("show");
}

function closeCart() {
    cartPanel.classList.remove("open");
    overlay.classList.remove("show");
}

// ==============================
// CHECKOUT
// ==============================

function openCheckout() {
    if (getCartQuantity() === 0) {
        showToast("Your cart is empty!");
        return;
    }

    closeCart();
    checkoutModal.classList.add("show");
}

function closeCheckout() {
    checkoutModal.classList.remove("show");
}

// ==============================
// ADD PRODUCTS TO CART
// ==============================

productsContainer.addEventListener("click", event => {
    const button = event.target.closest("[data-add]");

    if (!button) return;

    const id = Number(button.dataset.add);

    cart[id] = (cart[id] || 0) + 1;

    saveCart();
    showToast("Food added to your cart!");
});

// ==============================
// CATEGORY FILTER
// ==============================

document.querySelectorAll(".filter").forEach(button => {
    button.addEventListener("click", () => {
        activeCategory = button.dataset.category;

        document.querySelectorAll(".filter").forEach(filter => {
            filter.classList.remove("active");
        });

        button.classList.add("active");

        renderProducts();
    });
});

// ==============================
// SEARCH
// ==============================

searchInput.addEventListener("input", renderProducts);

// ==============================
// CHANGE CART QUANTITY
// ==============================

cartItems.addEventListener("click", event => {
    const button = event.target.closest("[data-change]");

    if (!button) return;

    const id = Number(button.dataset.change);
    const delta = Number(button.dataset.delta);

    cart[id] = (cart[id] || 0) + delta;

    if (cart[id] <= 0) {
        delete cart[id];
    }

    saveCart();
});

// ==============================
// CART BUTTONS
// ==============================

cartButton.addEventListener("click", openCart);
closeCartButton.addEventListener("click", closeCart);
overlay.addEventListener("click", closeCart);

// ==============================
// CHECKOUT BUTTONS
// ==============================

checkoutButton.addEventListener("click", openCheckout);

closeCheckoutButton.addEventListener("click", closeCheckout);

checkoutModal.addEventListener("click", event => {
    if (event.target === checkoutModal) {
        closeCheckout();
    }
});

// ==============================
// PLACE ORDER
// ==============================

checkoutForm.addEventListener("submit", event => {
    event.preventDefault();

    if (getCartQuantity() === 0) {
        showToast("Your cart is empty!");
        return;
    }

    const orderNumber = "QB" + Date.now().toString().slice(-7);

    const order = {
        orderNumber: orderNumber,
        customerName: document.getElementById("customerName").value,
        phone: document.getElementById("customerPhone").value,
        address: document.getElementById("customerAddress").value,
        items: Object.entries(cart).map(([id, quantity]) => {
            const product = products.find(
                item => item.id === Number(id)
            );

            return {
                ...product,
                quantity
            };
        }),
        total: getCartTotal(),
        date: new Date().toLocaleString()
    };

    let orders = [];

    try {
        orders = JSON.parse(
            localStorage.getItem("quickbiteOrders") || "[]"
        );
    } catch (error) {
        orders = [];
    }

    orders.unshift(order);

    localStorage.setItem("quickbiteOrders", JSON.stringify(orders));

    cart = {};

    saveCart();
    closeCheckout();
    checkoutForm.reset();

    showToast("Order " + orderNumber + " placed successfully!");
});

// ==============================
// FOOTER YEAR
// ==============================

document.getElementById("year").textContent =
    new Date().getFullYear();

// ==============================
// CLOSE WITH ESCAPE
// ==============================

document.addEventListener("keydown", event => {
    if (event.key === "Escape") {
        closeCart();
        closeCheckout();
    }
});

// ==============================
// START WEBSITE
// ==============================

renderProducts();
updateCart();
