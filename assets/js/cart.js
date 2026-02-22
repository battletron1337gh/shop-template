// Shopping Cart Functionality

let cart = JSON.parse(localStorage.getItem('twinstyle_cart')) || [];

function saveCart() {
    localStorage.setItem('twinstyle_cart', JSON.stringify(cart));
    updateCartUI();
}

function updateCartUI() {
    // Update cart count
    const cartCount = document.getElementById('cart-count');
    if (cartCount) {
        cartCount.textContent = cart.reduce((total, item) => total + item.quantity, 0);
    }
    
    // Update cart sidebar
    const cartItems = document.getElementById('cart-items');
    const cartEmpty = document.getElementById('cart-empty');
    const cartFooter = document.getElementById('cart-footer');
    const cartSubtotal = document.getElementById('cart-subtotal');
    
    if (cartItems && cartEmpty && cartFooter) {
        if (cart.length === 0) {
            cartEmpty.style.display = 'block';
            cartFooter.style.display = 'none';
            
            // Remove existing cart items
            const existingItems = cartItems.querySelectorAll('.cart-item');
            existingItems.forEach(item => item.remove());
        } else {
            cartEmpty.style.display = 'none';
            cartFooter.style.display = 'block';
            
            // Remove existing cart items
            const existingItems = cartItems.querySelectorAll('.cart-item');
            existingItems.forEach(item => item.remove());
            
            // Add cart items
            cart.forEach((item, index) => {
                const cartItem = document.createElement('div');
                cartItem.className = 'cart-item';
                cartItem.innerHTML = `
                    <div class="cart-item-image">
                        <i class="fas fa-image"></i>
                    </div>
                    <div class="cart-item-details">
                        <div class="cart-item-title">${item.name}</div>
                        <div class="cart-item-variant">${item.variant}</div>
                        <div class="cart-item-price">€${item.price.toFixed(2).replace('.', ',')} x ${item.quantity}</div>
                    </div>
                    <button class="cart-item-remove" onclick="removeFromCart(${index})">
                        <i class="fas fa-trash"></i>
                    </button>
                `;
                cartItems.insertBefore(cartItem, cartEmpty);
            });
            
            // Update subtotal
            const subtotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
            if (cartSubtotal) {
                cartSubtotal.textContent = '€' + subtotal.toFixed(2).replace('.', ',');
            }
        }
    }
}

function toggleCart() {
    const cartOverlay = document.querySelector('.cart-overlay');
    const cartSidebar = document.getElementById('cart-sidebar');
    
    if (cartOverlay && cartSidebar) {
        cartOverlay.classList.toggle('active');
        cartSidebar.classList.toggle('active');
        document.body.style.overflow = cartSidebar.classList.contains('active') ? 'hidden' : '';
    }
}

function addToCart() {
    const productName = document.querySelector('.product-name')?.textContent || 'Product';
    const productPrice = parseFloat(document.querySelector('.current-price')?.textContent.replace('€', '').replace(',', '.') || 0);
    const quantity = parseInt(document.getElementById('quantity')?.value || 1);
    
    // Get selected sizes
    const momSize = document.querySelector('.size-section:first-child .size-btn.active')?.dataset.size || 'M';
    const daughterSize = document.querySelector('.size-section:nth-child(2) .size-btn.active')?.dataset.size || '4Y';
    
    // Get selected color
    const colorBtn = document.querySelector('.color-btn.active');
    const color = colorBtn ? colorBtn.title : 'Roze';
    
    const variant = `Mama: ${momSize}, Dochter: ${daughterSize}, ${color}`;
    
    // Check if item already exists
    const existingItem = cart.find(item => 
        item.name === productName && item.variant === variant
    );
    
    if (existingItem) {
        existingItem.quantity += quantity;
    } else {
        cart.push({
            name: productName,
            price: productPrice,
            quantity: quantity,
            variant: variant
        });
    }
    
    saveCart();
    
    // Show confirmation
    showNotification('Toegevoegd aan winkelwagen!');
    
    // Open cart
    toggleCart();
}

function removeFromCart(index) {
    cart.splice(index, 1);
    saveCart();
}

function updateQuantity(change) {
    const quantityInput = document.getElementById('quantity');
    if (quantityInput) {
        let newValue = parseInt(quantityInput.value) + change;
        if (newValue < 1) newValue = 1;
        if (newValue > 10) newValue = 10;
        quantityInput.value = newValue;
    }
}

function showNotification(message) {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 90px;
        right: 20px;
        background: var(--color-success);
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 3000;
        font-weight: 600;
        animation: slideIn 0.3s ease;
    `;
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 2000);
}

// Flag to track if cart was explicitly opened by user
let cartExplicitlyOpened = false;

// Initialize cart on page load
document.addEventListener('DOMContentLoaded', function() {
    // Force cart closed on page load
    const cartOverlay = document.querySelectorAll('.cart-overlay');
    const cartSidebar = document.querySelectorAll('.cart-sidebar');
    
    cartOverlay.forEach(function(el) {
        el.classList.remove('active');
    });
    
    cartSidebar.forEach(function(el) {
        el.classList.remove('active');
    });
    
    document.body.style.overflow = '';
    cartExplicitlyOpened = false;
    
    updateCartUI();
});

// Override toggleCart to track user action
const originalToggleCart = window.toggleCart;
window.toggleCart = function() {
    const cartSidebar = document.getElementById('cart-sidebar');
    if (cartSidebar) {
        cartExplicitlyOpened = !cartSidebar.classList.contains('active');
    }
    
    const cartOverlay = document.querySelector('.cart-overlay');
    const sidebar = document.getElementById('cart-sidebar');
    
    if (cartOverlay && sidebar) {
        cartOverlay.classList.toggle('active');
        sidebar.classList.toggle('active');
        document.body.style.overflow = sidebar.classList.contains('active') ? 'hidden' : '';
    }
};

// Prevent any automatic cart opening on resize
window.addEventListener('resize', function() {
    // Do nothing - cart should only open via explicit user action (click)
    // This empty handler prevents any potential resize-related issues
}, { passive: true });

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);
