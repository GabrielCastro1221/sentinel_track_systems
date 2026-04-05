const { logger } = require('../middlewares/logger.middleware');
const ConfigPageRepository = require("../repositories/config/configPage.repository");
const ProductRepository = require("../repositories/store/product.repository");
const CartRepository = require("../repositories/store/cart.repository");
const ShippingRepository = require("../repositories/store/shipping.repository");
const TicketRepository = require("../repositories/store/ticket.repository");
const UserRepository = require("../repositories/auth/user.repository");
const PetRepository = require("../repositories/tracking/pet.repository");
const CategoryRepository = require("../repositories/store/categories.repository");
const CompanyConfigRepository = require("../repositories/config/companyConfig.repository");
const VehicleRepository = require("../repositories/tracking/vehicle.repository");
const DisabledPersonRepository = require("../repositories/tracking/disabledPerson.respository");

class ViewsController {
    async renderIndexPage(req, res) {
        try {
            const configPage = await ConfigPageRepository.getAllConfigPages();

            res.render('index', { configPage });
        } catch (error) {
            logger.error('Error rendering index page:', error);
            res.render("page_not_found");
        }
    }

    renderPageNotFound(req, res) {
        try {
            res.render('page_not_found');
        } catch (error) {
            logger.error('Error rendering page not found page:', error);
            res.render("page_not_found");
        }
    }

    renderAccessDenied(req, res) {
        try {
            res.render('access_denied');
        } catch (error) {
            logger.error('Error rendering access denied page:', error);
            res.render("page_not_found");
        }
    }

    async renderService(req, res) {
        try {
            const configPage = await ConfigPageRepository.getAllConfigPages();
            res.render('services', { configPage });
        } catch (error) {
            logger.error('Error rendering service page:', error);
            res.render("page_not_found");
        }
    }

    renderTicket = async (req, res) => {
        try {
            const ticketId = req.params.id;
            const ticket = await TicketRepository.getTicketById(ticketId);
            if (!ticket) {
                return res.redirect("/page-not-found");
            }
            res.render("ticket", { ticket });
        } catch (error) {
            res.render("pageNotFound");
        }
    };

    renderLogin(req, res) {
        try {
            res.render('login');
        } catch (error) {
            logger.error('Error rendering login page:', error);
            res.render("page_not_found");
        }
    }

    renderRegisterGuest(req, res) {
        try {
            res.render('register_guest');
        } catch (error) {
            logger.error('Error rendering register guest page:', error);
            res.render("page_not_found");
        }
    }

    renderEmailConfirm(req, res) {
        try {
            res.render('email_confirm');
        } catch (error) {
            logger.error('Error rendering email confirm page:', error);
            res.render("page_not_found");
        }
    }

    renderChangePass(req, res) {
        try {
            res.render('change_pass');
        } catch (error) {
            logger.error('Error rendering change password page:', error);
            res.render("page_not_found");
        }
    }

    renderResetPass(req, res) {
        try {
            res.render('resetPass');
        } catch (error) {
            logger.error('Error rendering reset password page:', error);
            res.render("page_not_found");
        }
    }

    renderProfileUser(req, res) {
        try {
            res.render('profile_user');
        } catch (error) {
            logger.error('Error rendering profile user page:', error);
            res.render("page_not_found");
        }
    }

    async renderTrackingMapById(req, res) {
        try {
            res.render('tracking_map');
        } catch (error) {
            logger.error('Error rendering tracking map page:', error);
            res.render("page_not_found");
        }
    }

    async renderProductDetails(req, res) {
        try {
            const productId = req.params.id;
            const product = await ProductRepository.getProductById(productId);
            if (!product) {
                return res.redirect("/page-not-found");
            }
            const reviews = await ProductRepository.getProductReviews(productId) || [];
            const features = await ProductRepository.getProductFeatures(productId) || [];
            res.render("productDetail", { product, reviews, features });
        } catch (error) {
            logger.error('Error rendering product details page:', error);
            res.render("page_not_found");
        }
    }

    async renderCart(req, res) {
        try {
            const cartId = req.params.id;

            const cart = await CartRepository.getCartById(cartId).catch(() => null);
            const guestCart = await CartRepository.getCartByGuestId(cartId).catch(() => null);

            const shipping = await ShippingRepository.getShipping();
            if (!shipping) {
                return res.status(404).json({ message: "No hay disponibilidad de envíos en el momento." });
            }

            if (!cart && !guestCart) {
                return res.render("page_not_found");
            }

            const activeCart = cart || guestCart;

            const subtotal = activeCart.products.reduce((acc, item) => {
                return acc + item.product.price * item.quantity;
            }, 0);

            res.render("cart", {
                cart: activeCart,
                subtotal,
                shipping,
                isGuest: !!guestCart
            });
        } catch (error) {
            console.error("Error en renderCart:", error);
            res.render("page_not_found");
        }
    }

    renderTracking(req, res) {
        try {
            res.render('tracking');
        } catch (error) {
            logger.error('Error rendering tracking page:', error);
            res.render("page_not_found");
        }
    }
}

module.exports = new ViewsController();
