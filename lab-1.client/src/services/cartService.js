export const getCart = () => JSON.parse(localStorage.getItem("cart")) || [];

export const addToCart = (product) => {
    const cart = getCart();

    // Kontrollo nëse produkti me të njëjtën id dhe adresë ekziston
    const existingIndex = cart.findIndex(item =>
        item.id === product.id &&
        JSON.stringify(item.shippingAddress) === JSON.stringify(product.shippingAddress)
    );

    if (existingIndex !== -1) {
        // Rrit sasinë nëse ekziston
        cart[existingIndex].quantity = (cart[existingIndex].quantity || 1) + 1;
    } else {
        cart.push({ ...product, quantity: 1 });
    }

    localStorage.setItem("cart", JSON.stringify(cart));
};

export const removeFromCart = (index) => {
    const cart = getCart();
    cart.splice(index, 1);
    localStorage.setItem("cart", JSON.stringify(cart));
};

export const clearCart = () => localStorage.removeItem("cart");
