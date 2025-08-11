export const getCart = () => JSON.parse(localStorage.getItem("cart")) || [];

export const addToCart = (product) => {
    const cart = getCart();
    cart.push({ ...product, quantity: 1 }); // çdo produkt ka adresën e vet
    localStorage.setItem("cart", JSON.stringify(cart));
};

export const removeFromCart = (index) => {
    const cart = getCart();
    cart.splice(index, 1);
    localStorage.setItem("cart", JSON.stringify(cart));
};

export const clearCart = () => localStorage.removeItem("cart");
