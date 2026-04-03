const CartRepository = require("../../../repositories/store/cart.repository");
const { logger } = require("../../../middlewares/logger.middleware");

class SocketCart {
    constructor(io) {
        this.io = io;
        this.initSocketEvents();
    }

    initSocketEvents() {
        this.io.on("connection", async (socket) => {
            logger.info("WebSocket carts connected");

            socket.on("addProductInCart", async ({ cartId, productId, quantity }) => {
                try {
                    const cart = await CartRepository.addProductInCart(cartId, productId, quantity);
                    socket.emit("cartUpdated", cart);
                } catch (error) {
                    socket.emit("error", "Error adding product to cart: " + error.message);
                }
            });

            socket.on("addProductInGuestCart", async ({ guestId, productId, quantity }) => {
                try {
                    const cart = await CartRepository.addProductInGuestCart(guestId, productId, quantity);
                    socket.emit("guestCartUpdated", cart);
                } catch (error) {
                    socket.emit("error", "Error adding product to guest cart: " + error.message);
                }
            });

            socket.on("migrateGuestCartToUser", async ({ guestId, userCartId }) => {
                try {
                    const userCart = await CartRepository.migrateGuestCartToUser(guestId, userCartId);
                    socket.emit("cartMigrated", userCart);
                } catch (error) {
                    socket.emit("error", "Error migrating guest cart: " + error.message);
                }
            });

            socket.on("getProductsInCart", async (cartId) => {
                try {
                    const cart = await CartRepository.getProductsInCart(cartId);
                    socket.emit("cartProducts", cart);
                } catch (error) {
                    socket.emit("error", "Error fetching products in cart");
                }
            });

            socket.on("getPaginatedCarts", async ({ page, limit }) => {
                try {
                    const result = await CartRepository.getPaginatedCarts({ page, limit });
                    socket.emit("paginatedCarts", result);
                } catch (error) {
                    socket.emit("error", "Error fetching paginated carts");
                }
            });

            socket.on("getCartById", async (id) => {
                try {
                    const cart = await CartRepository.getCartById(id);
                    socket.emit("cartDetail", cart);
                } catch (error) {
                    socket.emit("error", "Error fetching cart by ID");
                }
            });

            socket.on("getCartByGuestId", async (guestId) => {
                try {
                    const cart = await CartRepository.getCartByGuestId(guestId);
                    socket.emit("guestCartDetail", cart);
                } catch (error) {
                    socket.emit("error", "Error fetching guest cart");
                }
            });

            socket.on("deleteProductInCart", async ({ cartId, productId }) => {
                try {
                    const cart = await CartRepository.deleteProductInCart(cartId, productId);
                    socket.emit("cartUpdated", cart);
                } catch (error) {
                    socket.emit("error", "Error deleting product from cart");
                }
            });

            socket.on("deleteProductInGuestCart", async ({ guestId, productId }) => {
                try {
                    const cart = await CartRepository.deleteProductInGuestCart(guestId, productId);
                    socket.emit("guestCartUpdated", cart);
                } catch (error) {
                    socket.emit("error", "Error deleting product from guest cart");
                }
            });

            socket.on("emptyCart", async (cartId) => {
                try {
                    const cart = await CartRepository.emptyCart(cartId);
                    socket.emit("cartEmptied", cart);
                } catch (error) {
                    socket.emit("error", "Error emptying cart");
                }
            });

            socket.on("emptyGuestCart", async (guestId) => {
                try {
                    const cart = await CartRepository.emptyGuestCart(guestId);
                    socket.emit("guestCartEmptied", cart);
                } catch (error) {
                    socket.emit("error", "Error emptying guest cart");
                }
            });

            socket.on("disconnect", () => {
                logger.info("Client disconnected from Cart socket:", socket.id);
            });
        });
    }
}

module.exports = SocketCart;
