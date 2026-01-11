// Real products with actual image URLs
const products = [
    { id: 1, name: "Lavender Luxury Bar Soap", price: 18000, category: "bar-soap", image: "https://media.istockphoto.com/id/1019922288/photo/spa-products-and-lavender-flowers-on-a-white-background.jpg?s=612x612&w=0&k=20&c=vjLkJXF0LdnV1rI9r02sWrJHC7KBjx8AmQ1iqtVMCoY=" },
    { id: 2, name: "Rose Petal Liquid Hand Wash", price: 28000, category: "liquid-soap", image: "https://i.etsystatic.com/38337478/r/il/4c4715/7060745416/il_fullxfull.7060745416_e7ll.jpg" },
    { id: 3, name: "Lemon Fresh Detergent", price: 45000, category: "detergent", image: "https://www.shutterstock.com/image-vector/lemon-fragrance-laundry-detergent-ads-260nw-732258190.jpg" },
    { id: 4, name: "Ocean Breeze Washing Powder", price: 50000, category: "powder", image: "https://www.sustainablejungle.com/wp-content/uploads/2024/08/Image-by-Sustainable-Jungle-SuperBee-zero-waste-laundry-detergent.jpg" },
    { id: 5, name: "Mint Bliss Bar Soap", price: 16000, category: "bar-soap", image: "https://i.etsystatic.com/7579080/r/il/fd2c02/4868007028/il_570xN.4868007028_h5ce.jpg" },
    { id: 6, name: "Vanilla Coconut Liquid Soap", price: 25000, category: "liquid-soap", image: "https://m.media-amazon.com/images/S/al-na-9d5791cf-3faf/e1e25004-135c-4114-a7b1-90eb72b87841.jpg" },
];

let cart = [];
let currentFilter = 'all';

function renderProducts() {
    const grid = document.getElementById('productsGrid');
    grid.innerHTML = '';
    let filtered = products;

    // Filter by category
    if (currentFilter !== 'all') {
        filtered = products.filter(p => p.category === currentFilter);
    }

    // Search filter
    const searchTerm = document.getElementById('searchInput')?.value.toLowerCase() || '';
    if (searchTerm) {
        filtered = filtered.filter(p => p.name.toLowerCase().includes(searchTerm));
    }

    filtered.forEach(product => {
        const card = document.createElement('div');
        card.className = 'product-card';
        card.innerHTML = `
            <div class="product-image">
                <img src="${product.image}" alt="${product.name}" style="width:100%;height:100%;object-fit:cover;border-radius:15px;">
            </div>
            <div class="product-info">
                <div class="product-name">${product.name}</div>
                <div class="product-price">UGX ${product.price.toLocaleString()}</div>
                <button class="add-to-cart" onclick="addToCart(${product.id})">Add to Cart</button>
            </div>
        `;
        grid.appendChild(card);
    });
}

function filterProducts(category) {
    currentFilter = category;
    document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelector(`[onclick="filterProducts('${category}')"]`)?.classList.add('active');
    renderProducts();
}

// Search functionality
document.getElementById('searchInput')?.addEventListener('input', renderProducts);

function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    const existing = cart.find(item => item.id === productId);
    if (existing) {
        existing.quantity += 1;
    } else {
        cart.push({ ...product, quantity: 1 });
    }
    updateCart();
    showToast(`"${product.name}" added to cart! 🌸`);
}

function updateCart() {
    const badge = document.getElementById('cartBadge');
    badge.textContent = cart.reduce((sum, item) => sum + item.quantity, 0);

    const itemsContainer = document.getElementById('cartItems');
    const totalContainer = document.getElementById('cartTotal');
    itemsContainer.innerHTML = '';
    let total = 0;

    if (cart.length === 0) {
        itemsContainer.innerHTML = '<div class="empty-cart"><p>Your cart is empty 💕</p></div>';
        totalContainer.style.display = 'none';
    } else {
        cart.forEach(item => {
            total += item.price * item.quantity;
            const div = document.createElement('div');
            div.className = 'cart-item';
            div.innerHTML = `
                <div class="cart-item-img">
                    <img src="${item.image}" alt="${item.name}" style="width:100%;height:100%;object-fit:cover;border-radius:15px;">
                </div>
                <div class="cart-item-details">
                    <div class="cart-item-name">${item.name}</div>
                    <div class="cart-item-price">UGX ${item.price.toLocaleString()}</div>
                    <div class="quantity">
                        <button class="qty-btn" onclick="changeQuantity(${item.id}, -1)">-</button>
                        <span>${item.quantity}</span>
                        <button class="qty-btn" onclick="changeQuantity(${item.id}, 1)">+</button>
                        <span class="remove-item" onclick="removeFromCart(${item.id})">Remove</span>
                    </div>
                </div>
            `;
            itemsContainer.appendChild(div);
        });
        document.getElementById('subtotal').textContent = 'UGX ' + total.toLocaleString();
        document.getElementById('grandTotal').textContent = 'UGX ' + total.toLocaleString();
        totalContainer.style.display = 'block';
    }
}

function changeQuantity(id, change) {
    const item = cart.find(i => i.id === id);
    if (item) {
        item.quantity += change;
        if (item.quantity <= 0) {
            removeFromCart(id);
        } else {
            updateCart();
        }
    }
}

function removeFromCart(id) {
    cart = cart.filter(i => i.id !== id);
    updateCart();
}

function toggleCart() {
    document.getElementById('cartSidebar').classList.toggle('open');
}

function showToast(message) {
    const toast = document.createElement('div');
    toast.textContent = message;
    toast.style.cssText = `
        position: fixed;
        bottom: 30px;
        left: 50%;
        transform: translateX(-50%);
        background: var(--purple);
        color: white;
        padding: 15px 30px;
        border-radius: 50px;
        box-shadow: 0 10px 30px rgba(0,0,0,0.2);
        z-index: 3000;
        animation: slideUp 0.5s ease;
        font-size: 1.1rem;
    `;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
}

function subscribeNewsletter(e) {
    e.preventDefault();
    showToast("Thank you for subscribing! 🌸 You'll get exclusive deals soon!");
    e.target.reset();
}

// Initialize page
renderProducts();
updateCart();

// Bubbles animation
const bubblesContainer = document.querySelector('.bubbles');
for (let i = 0; i < 10; i++) {
    const bubble = document.createElement('div');
    bubble.className = 'bubble';
    bubble.style.width = bubble.style.height = `${40 + Math.random() * 70}px`;
    bubble.style.left = `${Math.random() * 100}%`;
    bubble.style.animationDelay = `${Math.random() * 15}s`;
    bubblesContainer.appendChild(bubble);
}



function goToCheckout() {
    if (cart.length === 0) {
        showToast("Your cart is empty! Add some soaps first 💕");
        return;
    }
    showToast("Redirecting to checkout... Get ready to glow! ✨");
    // Simulate redirect (create checkout.html later)
    setTimeout(() => {
        alert("Checkout complete! Thank you for shopping with CleanBrite 🌸\nOrder ID: CB" + Date.now());
        cart = [];
        updateCart();
    }, 2000);
}



// <script type="module">
//   // Import the functions you need from the SDKs you need
//   import { initializeApp } from "https://www.gstatic.com/firebasejs/12.7.0/firebase-app.js";
//   import { getAnalytics } from "https://www.gstatic.com/firebasejs/12.7.0/firebase-analytics.js";
//   // TODO: Add SDKs for Firebase products that you want to use
//   // https://firebase.google.com/docs/web/setup#available-libraries

//   // Your web app's Firebase configuration
//   // For Firebase JS SDK v7.20.0 and later, measurementId is optional
//   const firebaseConfig = {
//     apiKey: "AIzaSyDsp_7lUGWpEaPqTwyD5uhUtouucip7T3k",
//     authDomain: "cleanbrite-5950b.firebaseapp.com",
//     projectId: "cleanbrite-5950b",
//     storageBucket: "cleanbrite-5950b.firebasestorage.app",
//     messagingSenderId: "108630016286",
//     appId: "1:108630016286:web:cd943c730c56e50231890f",
//     measurementId: "G-ML2Q1YZMJR"
//   };

//   // Initialize Firebase
//   const app = initializeApp(firebaseConfig);
//   const analytics = getAnalytics(app);
// </script>