const CartRepository = require("../../repositories/store/cart.repository");
const ShippingRepository = require("../../repositories/store/shipping.repository");
const { logger } = require("../../middlewares/logger.middleware");

class CartController {
    async addProductsToCart(req, res) {
        const { cid, pid } = req.params;
        const quantity = req.body.quantity || 1;

        try {
            await CartRepository.addProductInCart(cid, pid, quantity);

            logger.info(`Producto ${pid} agregado al carrito ${cid} con cantidad ${quantity}`);
            res.status(201).json({ message: "productos agregados al carrito" })
        } catch (error) {
            logger.error(`Error al agregar producto ${pid} al carrito ${cid}: ${error.message}`);
            res.status(500).json({ message: error.message });
        }
    }

    async addProductsToGuestCart(req, res) {
        const { guestId, pid } = req.params;
        const quantity = req.body.quantity || 1;

        try {
            const cart = await CartRepository.addProductInGuestCart(guestId, pid, quantity);

            logger.info(`Producto ${pid} agregado al carrito invitado ${guestId} con cantidad ${quantity}`);
            res.redirect(`/cart/${cart._id}`);
        } catch (error) {
            logger.error(`Error al agregar producto ${pid} al carrito invitado ${guestId}: ${error.message}`);
            res.status(500).json({ message: error.message });
        }
    }

    async getProductsToCart(req, res) {
        const { cid } = req.params;

        try {
            const products = await CartRepository.getProductsInCart(cid);
            if (!products) {
                logger.warn(`Carrito no encontrado: ${cid}`);
                return res.status(404).json({ error: "Carrito no encontrado" });
            }

            logger.info(`Productos obtenidos del carrito ${cid}`);
            res.status(200).json(products);
        } catch (error) {
            logger.error(`Error al obtener productos del carrito ${cid}: ${error.message}`);
            res.status(500).json({ error: error.message });
        }
    }

    async getCartById(req, res) {
        const { cid } = req.params;

        try {
            const result = await CartRepository.getCartById(cid);

            logger.info(`Carrito ${cid} obtenido exitosamente`);
            res.status(200).json(result);
        } catch (error) {
            logger.error(`Error al obtener el carrito ${cid}: ${error.message}`);
            res.status(500).json({ error: error.message });
        }
    }

    async getCartByGuestId(req, res) {
        try {
            const { guestId } = req.params;
            const cart = await CartRepository.getCartByGuestId(guestId);
            const shipping = await ShippingRepository.getShipping();

            if (!shipping) {
                logger.warn("No hay disponibilidad de envíos en el momento, inténtalo más tarde");
                return res.status(404).json({ message: "No hay disponibilidad de envíos en el momento, inténtalo más tarde" });
            }
            if (!cart) {
                logger.warn(`Carrito invitado no encontrado: ${guestId}`);
                return res.redirect("/page-not-found");
            }

            const subtotal = cart.products.reduce((acc, item) => {
                return acc + item.product.price * item.quantity;
            }, 0);

            logger.info(`Carrito invitado ${guestId} obtenido exitosamente`);
            res.render("cart", { cart, subtotal, shipping, isGuest: true });
        } catch (error) {
            logger.error(`Error al obtener carrito invitado ${guestId}: ${error.message}`);
            res.redirect("/page-not-found");
        }
    }

    async deleteProductToCart(req, res) {
        const { cid, pid } = req.params;

        try {
            const updateCart = await CartRepository.deleteProductInCart(cid, pid);

            logger.info(`Producto ${pid} eliminado del carrito ${cid}`);
            res.status(200).json({ "Producto eliminado del carrito": updateCart });
        } catch (error) {
            logger.error(`Error al eliminar producto ${pid} del carrito ${cid}: ${error.message}`);
            res.status(500).json({ message: error.message });
        }
    }

    async deleteProductFromGuestCart(req, res) {
        const { guestId, pid } = req.params;

        try {
            const updatedCart = await CartRepository.deleteProductInGuestCart(guestId, pid);

            logger.info(`Producto ${pid} eliminado del carrito invitado ${guestId}`);
            res.status(200).json({ message: "Producto eliminado del carrito invitado", cart: updatedCart });
        } catch (error) {
            logger.error(`Error al eliminar producto ${pid} del carrito invitado ${guestId}: ${error.message}`);
            res.status(500).json({ message: error.message });
        }
    }

    async emptyCart(req, res) {
        const { cid } = req.params;

        try {
            const updateCart = await CartRepository.emptyCart(cid);

            logger.info(`Carrito ${cid} vaciado exitosamente`);
            res.status(200).json({ "Carrito vacio": updateCart });
        } catch (error) {
            logger.error(`Error al vaciar carrito ${cid}: ${error.message}`);
            res.status(500).json({ message: error.message });
        }
    }

    async emptyGuestCart(req, res) {
        const { guestId } = req.params;

        try {
            const cart = await CartRepository.emptyGuestCart(guestId);

            logger.info(`Carrito invitado ${guestId} vaciado exitosamente`);
            res.status(200).json({ message: "Carrito invitado vaciado", cart });
        } catch (error) {
            logger.error(`Error al vaciar carrito invitado ${guestId}: ${error.message}`);
            res.status(500).json({ message: error.message });
        }
    }

    async getPaginatedCarts(req, res) {
        try {
            const { page = 1, limit = 10 } = req.query;
            const { carts, pagination } = await CartRepository.getPaginatedCarts({
                page: parseInt(page),
                limit: parseInt(limit)
            });

            logger.info(`Carritos paginados obtenidos exitosamente: ${carts.length} carritos`);
            res.status(200).json({ status: true, carts, pagination });
        } catch (error) {
            logger.error(`Error al obtener carritos paginados: ${error.message}`);
            res.status(500).json({ error: error.message });
        }
    }
}

module.exports = new CartController();
