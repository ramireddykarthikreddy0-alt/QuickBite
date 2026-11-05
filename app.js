
const products = [
  {
    id: 1,
    name: "Classic Veg Burger",
    category: "Burgers",
    description: "Crispy patty, fresh lettuce and our signature house sauce.",
    price: 129,
    image: "🍔",
    tag: "Bestseller"
  },
  {
    id: 2,
    name: "Margherita Pizza",
    category: "Pizza",
    description: "Classic mozzarella, fragrant basil and rich tomato sauce.",
    price: 249,
    image: "🍕",
    tag: "Popular"
  },
  {
    id: 3,
    name: "Paneer Tikka Wrap",
    category: "Wraps",
    description: "Spiced paneer, crunchy vegetables and mint mayo.",
    price: 179,
    image: "🌯",
    tag: "Chef's pick"
  },
  {
    id: 4,
    name: "Masala Fries",
    category: "Sides",
    description: "Golden crispy fries tossed with our special Indian spices.",
    price: 89,
    image: "🍟",
    tag: ""
  },
  {
    id: 5,
    name: "Chocolate Brownie",
    category: "Desserts",
    description: "A rich, fudgy chocolate brownie for a sweet finish.",
    price: 99,
    image: "🍫",
    tag: "Sweet treat"
  },
  {
    id: 6,
    name: "Double Cheese Pizza",
    category: "Pizza",
    description: "Loaded with extra cheese, herbs and a crisp golden base.",
    price: 299,
    image: "🍕",
    tag: ""
  },
  {
    id: 7,
    name: "Crispy Veg Burger",
    category: "Burgers",
    description: "Crunchy veggie patty with pickles and creamy sauce.",
    price: 149,
    image: "🍔",
    tag: ""
  },
  {
    id: 8,
    name: "Loaded Nachos",
    category: "Sides",
    description: "Crunchy nachos topped with cheese, salsa and jalapeños.",
    price: 139,
    image: "🧀",
    tag: ""
  },
  {
    id: 9,
    name: "Strawberry Cheesecake",
    category: "Desserts",
    description: "Creamy cheesecake with a bright strawberry topping.",
    price: 159,
    image: "🍰",
    tag: "New"
  }
];

const rupees = amount => "₹" + amount.toFixed(2);

let cart = {};

try {
  cart = JSON.parse(localStorage.getItem("quickbite-cart") || "{}");
} catch {
  cart = {};
}

let activeCategory = "All";
let toastTimer;

const productGrid = document.getElementById("productGrid");
const cartDrawer = document.getElementById("cartDrawer");
const cartOverlay = document.getElementById("cartOverlay");
const checkoutModal = document.getElementById("checkoutModal");

// Save cart in browser
function saveCart() {
  localStorage.setItem("quickbite-cart", JSON.stringify(cart));
  updateCart();
}

// Display food products
function renderProducts() {
  const search = document
    .getElementById("searchInput")
    .value.trim()
    .toLowerCase();

  const shown = products.filter(product => {
    const matchesCategory =
      activeCategory === "All" ||
      product.category === activeCategory;

    const matchesSearch =
      product.name.toLowerCase().includes(search) ||
      product.description.toLowerCase().includes(search) ||
      product.category.toLowerCase().includes(search);

    return matchesCategory && matchesSearch;
  });

  if (!shown.length) {
    productGrid.innerHTML =
      '<p class="empty-state">No food found. Try another search.</p>';
    return;
  }

  productGrid.innerHTML = shown.map(product => `
    <article class="product-card">
      <div class="product-image">
        ${product.tag ? `<small>${product.tag}</small>` : ""}
        ${product.image}
      </div>

      <div class="product-info">
        <span class="category">${product.category}</span>
        <h3>${product.name}</h3>
        <p>${product.description}</p>

        <div class="product-bottom">
          <strong>${rupees(product.price)}</strong>
          <button class="add-button" data-add="${product.id}">
            + Add
          </button>
        </div>
      </div>
    </article>
  `).join("");
}

// Calculate total cart quantity
function cartQuantity() {
  return Object.values(cart).reduce(
    (total, quantity) => total + quantity,
    0
  );
}

// Calculate cart price
function calculateTotal() {
  return Object.entries(cart).reduce((total, [id, quantity]) => {
    const product = products.find(p => p.id === Number(id));

    return product
      ? total + product.price * quantity
      : total;
  }, 0);
}

// Update cart display
function updateCart() {
  document.getElementById("cartCount").textContent =
    cartQuantity();

  const entries = Object.entries(cart).filter(
    ([, quantity]) => quantity > 0
  );

  const itemsElement = document.getElementById("cartItems");

  if (!entries.length) {
    itemsElement.innerHTML = `
      <div class="empty-cart">
        <span>🛍️</span>
        <strong>Your cart is empty</strong>
        <p>Add something delicious from our menu.</p>
      </div>
    `;
  } else {
    itemsElement.innerHTML = entries.map(([id, quantity]) => {
      const product = products.find(
        p => p.id === Number(id)
      );

      if (!product) return "";

      return `
        <div class="cart-row">
          <div class="cart-thumb">${product.image}</div>

          <div class="cart-product">
            <strong>${product.name}</strong>
            <small>${rupees(product.price)} each</small>

            <div class="quantity">
              <button
                data-change="${id}"
                data-delta="-1"
                aria-label="Decrease quantity"
              >−</button>

              <span>${quantity}</span>

              <button
                data-change="${id}"
                data-delta="1"
                aria-label="Increase quantity"
              >+</button>
            </div>
          </div>

          <span class="cart-line-price">
            ${rupees(product.price * quantity)}
          </span>
        </div>
      `;
    }).join("");
  }

  document.getElementById("cartTotal").textContent =
    rupees(calculateTotal());

  document.getElementById("checkoutTotal").textContent =
    rupees(calculateTotal());
}

// Show notification
function showToast(message) {
  const toast = document.getElementById("toast");

  toast.textContent = message;
  toast.classList.add("show");

  clearTimeout(toastTimer);

  toastTimer = setTimeout(() => {
    toast.classList.remove("show");
  }, 2300);
}

// Open cart
function openCart() {
  cartDrawer.classList.add("open");
  cartOverlay.classList.add("show");

  cartDrawer.setAttribute("aria-hidden", "false");
  document.body.classList.add("locked");
}

// Close cart
function closeCart() {
  cartDrawer.classList.remove("open");
  cartOverlay.classList.remove("show");

  cartDrawer.setAttribute("aria-hidden", "true");
  document.body.classList.remove("locked");
}

// Open checkout
function openCheckout() {
  if (cartQuantity() === 0) {
    showToast("Your cart is empty!");
    return;
  }

  closeCart();

  checkoutModal.classList.add("show");
  document.body.classList.add("locked");
}

// Close checkout
function closeCheckout() {
  checkoutModal.classList.remove("show");
  document.body.classList.remove("locked");
}

// Add product to cart
productGrid.addEventListener("click", event => {
  const button = event.target.closest("[data-add]");

  if (!button) return;

  const id = Number(button.dataset.add);

  cart[id] = (cart[id] || 0) + 1;

  saveCart();
  showToast("Added to your cart!");
});

// Category filter
document
  .getElementById("categoryFilters")
  .addEventListener("click", event => {
    const button = event.target.closest("[data-category]");

    if (!button) return;

    activeCategory = button.dataset.category;

    document.querySelectorAll(".filter").forEach(filter => {
      filter.classList.toggle("active", filter === button);
    });

    renderProducts();
  });

// Search food
document
  .getElementById("searchInput")
  .addEventListener("input", renderProducts);

// Increase or decrease cart quantity
document
  .getElementById("cartItems")
  .addEventListener("click", event => {
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

// Cart controls
document
  .getElementById("openCart")
  .addEventListener("click", openCart);

document
  .getElementById("closeCart")
  .addEventListener("click", closeCart);

cartOverlay.addEventListener("click", closeCart);

// Checkout controls
document
  .getElementById("checkoutButton")
  .addEventListener("click", openCheckout);

document
  .getElementById("closeCheckout")
  .addEventListener("click", closeCheckout);

checkoutModal.addEventListener("click", event => {
  if (event.target === checkoutModal) {
    closeCheckout();
  }
});

// Place order
document
  .getElementById("checkoutForm")
  .addEventListener("submit", event => {
    event.preventDefault();

    if (!event.currentTarget.reportValidity()) {
      return;
    }

    const orderNumber =
      "QB" + Date.now().toString().slice(-7);

    const orderItems = Object.entries(cart).map(
      ([id, quantity]) => {
        const product = products.find(
          p => p.id === Number(id)
        );

        return {
          ...product,
          quantity
        };
      }
    );

    const order = {
      number: orderNumber,

      name: document
        .getElementById("customerName")
        .value.trim(),

      phone: document
        .getElementById("customerPhone")
        .value.trim(),

      address: document
        .getElementById("customerAddress")
        .value.trim(),

      payment: document
        .getElementById("paymentMethod")
        .value,

      items: orderItems,
      total: calculateTotal(),
      date: new Date().toLocaleString()
    };

    let orders = [];

    try {
      orders = JSON.parse(
        localStorage.getItem("quickbite-orders") || "[]"
      );
    } catch {
      orders = [];
    }

    orders.unshift(order);

    localStorage.setItem(
      "quickbite-orders",
      JSON.stringify(orders)
    );

    cart = {};

    saveCart();
    closeCheckout();

    event.currentTarget.reset();

    showToast(
      "Order " + orderNumber + " placed successfully! (Demo)"
    );
  });

// Mobile navigation
document
  .getElementById("menuToggle")
  .addEventListener("click", () => {
    document.getElementById("mainNav").classList.toggle("open");
  });

document.querySelectorAll("#mainNav a").forEach(link => {
  link.addEventListener("click", () => {
    document.getElementById("mainNav").classList.remove("open");
  });
});

// Close panels with Escape key
document.addEventListener("keydown", event => {
  if (event.key === "Escape") {
    closeCart();
    closeCheckout();
  }
});

// Current year in footer
document.getElementById("year").textContent =
  new Date().getFullYear();

// Start website
renderProducts();
updateCart();

