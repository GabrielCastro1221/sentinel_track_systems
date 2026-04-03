const ProductRepository = require("../../repositories/store/product.repository");
const { logger } = require("../../middlewares/logger.middleware");

class ProductController {
    async createProd(req, res) {
        try {
            const image = req.files?.image?.[0]?.path || null;

            const thumbnails = req.files?.thumbnails
                ? req.files.thumbnails.map((file) => ({
                    url: file.path,
                    public_id: file.filename,
                }))
                : [];

            const newProd = {
                ...req.body,
                image,
                thumbnails,
            };

            const createdProduct = await ProductRepository.createProduct(newProd);

            logger.info(`Producto creado: ${createdProduct._id}`);
            return res.status(201).json({
                message: "Producto creado correctamente",
                data: createdProduct,
            });
        } catch (error) {
            logger.error(`Error al crear producto: ${error.message}`);
            return res.status(500).json({ message: error.message });
        }
    }

    async getProducts(req, res) {
        try {
            const { page, limit, sort, query } = req.query;
            const products = await ProductRepository.getPaginatedProducts({
                page,
                limit,
                sort,
                query,
            });

            if (products.productos.length === 0) {
                return res.status(404).json({ message: "No se encontraron productos" });
            }

            logger.info(`Productos obtenidos: ${products.productos.length} encontrados`);
            res.status(200).json(products);
        } catch (error) {
            logger.error(`Error al obtener productos: ${error.message}`);
            res.status(500).json({ message: error.message });
        }
    }

    async getProductById(req, res) {
        const { id } = req.params;

        try {
            const product = await ProductRepository.getProductById(id);
            logger.info(`Producto obtenido por ID: ${id}`);
            res.status(200).json({ message: "Producto encontrado", product });
        } catch (error) {
            logger.error("Error al obtener producto por ID: " + error.message);
            res.status(500).json({ message: error.message });
        }
    }

    async getProductReviews(req, res) {
        try {
            const { id } = req.params;
            const reviews = await ProductRepository.getProductReviews(id);

            logger.info(`Reseñas obtenidas para producto ID ${id}: ${reviews.length} encontradas`);
            res.status(200).json(reviews);
        } catch (error) {
            logger.error(`Error al obtener reseñas para producto ID ${id}: ${error.message}`);
            res.status(500).json({ message: error.message });
        }
    }

    async getProductFeatures(req, res) {
        try {
            const { id } = req.params;
            const features = await ProductRepository.getProductFeatures(id);

            logger.info(`Características obtenidas para producto ID ${id}: ${features.length} encontradas`);
            res.status(200).json({ features });
        } catch (error) {
            logger.error(`Error al obtener características para producto ID ${id}: ${error.message}`);
            res.status(500).json({ message: error.message });
        }
    }

    async getFeatured(req, res) {
        try {
            const { page } = req.query;
            const featured = await ProductRepository.getFeaturedProducts(page);

            if (!featured.docs || featured.docs.length === 0) {
                logger.info("No se encontraron productos destacados");
                return res.status(404).json({ message: "No se encontraron productos destacados" });
            }

            logger.info(`Productos destacados obtenidos: ${featured.docs.length} encontrados`);
            res.status(200).json(featured);
        } catch (error) {
            logger.error(`Error al obtener productos destacados: ${error.message}`);
            res.status(500).json({ message: error.message });
        }
    }

    async getNewArrive(req, res) {
        try {
            const { page } = req.query;
            const newArrive = await ProductRepository.getNewArrive(page);
            if (!newArrive.docs || newArrive.docs.length === 0) {
                logger.info("No se encontraron productos de nuevo arribo");
                return res.status(404).json({ message: "No se encontraron productos de nuevo arribo" });
            }
            logger.info(`Productos de nuevo arribo obtenidos: ${newArrive.docs.length} encontrados`);
            res.status(200).json(newArrive);
        } catch (error) {
            logger.error(`Error al obtener productos de nuevo arribo: ${error.message}`);
            res.status(500).json({ message: error.message });
        }
    }

    async getMoreSeller(req, res) {
        try {
            const moreSeller = await ProductRepository.getMoreSeller();
            if (!moreSeller || moreSeller.length === 0) {
                logger.info("No se encontraron productos más vendidos");
                return res.status(404).json({ message: "No se encontraron productos más vendidos" });
            }
            logger.info(`Productos más vendidos obtenidos: ${moreSeller.length} encontrados`);
            res.status(200).json(moreSeller);
        } catch (error) {
            logger.error(`Error al obtener productos más vendidos: ${error.message}`);
            res.status(500).json({ message: error.message });
        }
    }

    async searchProductsBar(req, res) {
        try {
            const { query } = req.query;
            const products = await ProductRepository.searchProductsBar(query);

            logger.info(`Productos encontrados para búsqueda "${query}": ${products.length}`);
            res.status(200).json({ products });
        } catch (error) {
            logger.error(`Error en búsqueda de productos: ${error.message}`);
            res.status(500).json({ message: error.message });
        }
    }

    async updateProduct(req, res) {
        const { id } = req.params;

        try {
            let imageUrl = req.body.image;
            if (req.files?.image?.[0]) {
                imageUrl = req.files.image[0].path;
            }

            let thumbnails = req.body.thumbnails || [];
            if (req.files?.thumbnails) {
                thumbnails = req.files.thumbnails.map((file) => ({
                    url: file.path,
                    public_id: file.filename,
                }));
            }

            const updateData = {
                ...req.body,
                image: imageUrl,
                thumbnails,
            };

            const updatedProduct = await ProductRepository.updateProduct(id, updateData);

            logger.info(`Producto actualizado con ID: ${id}`);
            res.status(200).json({
                message: "Producto actualizado",
                producto: updatedProduct
            });
        } catch (error) {
            logger.error(`Error al actualizar producto con ID ${id}: ${error.message}`);
            res.status(500).json({ message: error.message });
        }
    }

    async featuredProduct(req, res) {
        const pid = req.params.id;

        try {
            let featured = await ProductRepository.featureProduct(pid);
            if (!featured) {
                return res.status(404).send("Producto no encontrado");
            }

            logger.info(`Producto destacado con ID: ${pid}`);
            res.status(200).json(featured);
        } catch (error) {
            logger.error(`Error al destacar producto con ID ${pid}: ${error.message}`);
            res.status(500).send(error.message || "Error al destacar el producto");
        }
    }

    async newArrive(req, res) {
        const pid = req.params.id;

        try {
            let newArrive = await ProductRepository.newArrive(pid);
            if (!newArrive) {
                logger.warn(`Producto no encontrado para marcar como nuevo arribo con ID: ${pid}`);
                return res.status(404).send("Producto no encontrado");
            }

            logger.info(`Producto nuevo arribo con ID: ${pid}`);
            res.status(200).json(newArrive);
        } catch (error) {
            logger.error(`Error al marcar producto como nuevo arribo con ID ${pid}: ${error.message}`);
            res.status(500).send(error.message || "Error al cambiar a nuevo arribo");
        }
    }

    async bestSeller(req, res) {
        const pid = req.params.id;

        try {
            let bestSeller = await ProductRepository.bestSeller(pid);
            if (!bestSeller) {
                logger.warn(`Producto no encontrado para marcar como mas vendido con ID: ${pid}`);
                return res.status(404).send("Producto no encontrado");
            }

            logger.info(`Producto marcado como mas vendido con ID: ${pid}`);
            res.status(200).json(bestSeller);
        } catch (error) {
            logger.error(`Error al marcar producto como mas vendido con ID ${pid}: ${error.message}`);
            res.status(500).send(error.message || "Error al cambiar a mas vendido");
        }
    }

    deleteProduct = async (req, res) => {
        const pid = req.params.pid;

        try {
            const prod = await ProductRepository.deleteProduct(pid);
            if (!prod) {
                logger.warn(`Producto no encontrado para eliminar con ID: ${pid}`);
                return res.status(404).json({ message: "Producto no encontrado" });
            }

            logger.info(`Producto eliminado con ID: ${pid}`);
            res.status(200).json({ message: "Producto eliminado", prod });
        } catch (error) {
            logger.error(`Error al eliminar producto con ID ${pid}: ${error.message}`);
            res.status(500).send("Error al eliminar el producto");
        }
    }
}

module.exports = new ProductController();