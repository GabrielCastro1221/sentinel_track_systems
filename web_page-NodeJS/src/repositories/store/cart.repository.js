const cartModel = require('../../models/store/cart.model');
const { logger } = require('../../middlewares/logger.middleware');

class CartRepository {
    async addProductInCart(cartId, productId, quantity = 1) {
        try {
            const cart = await cartModel.findById(cartId);
            if (!cart) throw new Error("Carrito no encontrado");
            const existingProduct = cart.products.find(
                (item) => item.product.toString() === productId
            );
            if (existingProduct) {
                existingProduct.quantity += quantity;
            } else {
                cart.products.push({ product: productId, quantity });
            }
            cart.markModified("products");
            await cart.save();
            return cart;
        } catch (error) {
            throw new Error("Error al agregar producto al carrito: " + error.message);
        }
    }

    async addProductInGuestCart(guestId, productId, quantity = 1) {
        try {
            let cart = await cartModel.findOne({ guestId });
            if (!cart) {
                cart = new cartModel({
                    guestId,
                    products: [{ product: productId, quantity }]
                });
            } else {
                const existingProduct = cart.products.find(
                    (item) => item.product.toString() === productId
                );
                if (existingProduct) {
                    existingProduct.quantity += quantity;
                } else {
                    cart.products.push({ product: productId, quantity });
                }
            }
            cart.markModified("products");
            await cart.save();
            return await cart.populate("products.product", "_id title price image");
        } catch (error) {
            throw new Error("Error al agregar producto al carrito invitado: " + error.message);
        }
    }

    async migrateGuestCartToUser(guestId, userCartId) {
        try {
            const guestCart = await cartModel.findOne({ guestId });
            if (!guestCart) throw new Error("Carrito invitado no encontrado");

            const userCart = await cartModel.findById(userCartId);
            if (!userCart) throw new Error("Carrito de usuario no encontrado");

            guestCart.products.forEach((item) => {
                const existingProduct = userCart.products.find(
                    (p) => p.product.toString() === item.product.toString()
                );
                if (existingProduct) {
                    existingProduct.quantity += item.quantity;
                } else {
                    userCart.products.push({ product: item.product, quantity: item.quantity });
                }
            });

            userCart.markModified("products");
            await userCart.save();

            await cartModel.deleteOne({ guestId });

            return userCart;
        } catch (error) {
            throw new Error("Error al migrar carrito invitado: " + error.message);
        }
    }


    async getProductsInCart(cartId) {
        try {
            const cart = await cartModel
                .findById(cartId)
                .populate("products.product");

            if (!cart) {
                logger.warning("El carrito no existe");
                return null;
            }

            return cart;
        } catch (error) {
            logger.error("Error al obtener los productos del carrito:", error.message);
            throw new Error("Error al obtener los productos del carrito");
        }
    }

    async getPaginatedCarts({ page = 1, limit = 10 }) {
        try {
            const options = {
                page,
                limit,
                populate: { path: "products.product", select: "_id title price image" },
                lean: true
            };

            const result = await cartModel.paginate({}, options);

            if (!result.docs || result.docs.length === 0) {
                logger.warning("No se encontraron carritos");
                return { carts: [], pagination: result };
            }

            return {
                carts: result.docs,
                pagination: {
                    totalDocs: result.totalDocs,
                    totalPages: result.totalPages,
                    page: result.page,
                    limit: result.limit,
                    hasNextPage: result.hasNextPage,
                    hasPrevPage: result.hasPrevPage,
                    nextPage: result.nextPage,
                    prevPage: result.prevPage
                }
            };
        } catch (error) {
            logger.error("Error al obtener carritos paginados:", error.message);
            throw new Error("Error al obtener carritos paginados");
        }
    }

    async getCartById(id) {
        try {
            const cart = await cartModel
                .findById(id)
                .populate("products.product", "_id title price image")
                .lean();
            if (!cart) {
                throw new Error("Carrito de compras no encontrado");
            }
            return cart;
        } catch (error) {
            logger.error("Error al obtener carrito de compreas:", error.message);
            throw new Error(error.message);
        }
    }

    async getCartByGuestId(guestId) {
        try {
            const cart = await cartModel.findOne({ guestId }).populate("products.product", "_id title price image").lean();
            if (!cart) {
                logger.warning("Carrito invitado no encontrado");
                return null;
            }
            return cart;
        }
        catch (error) {
            logger.error("Error al obtener carrito invitado:", error.message);
            throw new Error(error.message);
        }
    }

    async deleteProductInCart(cartId, productId) {
        try {
            const cart = await cartModel.findById(cartId);
            if (!cart) {
                throw new Error("Carrito no encontrado");
            }
            cart.products = cart.products.filter(
                (item) => item.product.toString() !== productId
            );
            await cart.save();
            return cart;
        } catch (error) {
            throw new Error("Error al eliminar producto del carrito");
        }
    }

    async deleteProductInGuestCart(guestId, productId) {
        try {
            const cart = await cartModel.findOne({ guestId });
            if (!cart) {
                throw new Error("Carrito invitado no encontrado");
            }
            cart.products = cart.products.filter(
                (item) => item.product.toString() !== productId
            );
            await cart.save();
            return cart;
        } catch (error) {
            throw new Error("Error al eliminar producto del carrito invitado: " + error.message);
        }
    }

    async emptyCart(cartId) {
        try {
            const cart = await cartModel.findByIdAndUpdate(
                cartId,
                { products: [] },
                { new: true }
            );
            if (!cart) {
                throw new Error("Carrito no encontrado");
            }
            return cart;
        } catch (error) {
            throw new Error("Error al vaciar carrito");
        }
    }

    async emptyGuestCart(guestId) {
        try {
            const cart = await cartModel.findOneAndUpdate(
                { guestId },
                { products: [] },
                { new: true }
            );
            if (!cart) {
                throw new Error("Carrito invitado no encontrado");
            }
            return cart;
        } catch (error) {
            throw new Error("Error al vaciar carrito invitado: " + error.message);
        }
    }
}

module.exports = new CartRepository();