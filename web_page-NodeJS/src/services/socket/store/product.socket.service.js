const product = require("../../../repositories/store/product.repository");
const { logger } = require("../../../middlewares/logger.middleware");

class SocketProduct {
    constructor(io) {
        this.io = io;
        this.initSocketEvents();
    }

    initSocketEvents() {
        this.io.on("connection", async (socket) => {
            logger.info("WebSocket products connected");

            try {
                await this.emitPaginatedProducts(socket, {
                    page: 1,
                    limit: 6,
                    sort: "asc",
                    query: null,
                });
            } catch (error) {
                logger.error("Error emitting initial products:", error.message);
                socket.emit("error", "Error loading products.");
            }

            socket.on("featureProd", async (id) => {
                try {
                    await product.featureProduct(id);
                    await this.emitPaginatedProducts(socket, { page: 1, limit: 6 });
                } catch (error) {
                    socket.emit("error", "Error featuring product");
                }
            });

            socket.on("newArrive", async (id) => {
                try {
                    await product.newArrive(id);
                    await this.emitPaginatedProducts(socket, { page: 1, limit: 6 });
                } catch (error) {
                    socket.emit("error", "Error marking product as new arrival");
                }
            });

            socket.on("bestSeller", async (id) => {
                try {
                    await product.bestSeller(id);
                    await this.emitPaginatedProducts(socket, { page: 1, limit: 6 });
                } catch (error) {
                    socket.emit("error", "Error marking product as best seller");
                }
            });

            socket.on("deleteProd", async (id) => {
                try {
                    await product.deleteProduct(id);
                    socket.emit("productDeleted", { id });
                    await this.emitPaginatedProducts(socket, { page: 1, limit: 6 });
                } catch (error) {
                    socket.emit("error", "Error deleting product");
                }
            });

            socket.on("getPaginatedProducts", async (params) => {
                try {
                    await this.emitPaginatedProducts(socket, params);
                } catch (error) {
                    socket.emit("error", "Error fetching paginated products");
                }
            });

            socket.on("searchProducts", async (query) => {
                try {
                    const searchResults = await product.searchProducts(query);
                    socket.emit("searchResults", searchResults);
                } catch (error) {
                    socket.emit("error", "Error searching products");
                }
            });

            socket.on("getProductById", async (id) => {
                try {
                    const prod = await product.getProductById(id);
                    socket.emit("productDetail", prod);
                } catch (error) {
                    socket.emit("error", "Error fetching product by ID");
                }
            });

            socket.on("updateProduct", async ({ id, updateData }) => {
                try {
                    const updatedProduct = await product.updateProduct(id, updateData);
                    const prod = updatedProduct.data ? updatedProduct.data : updatedProduct;
                    socket.emit("productUpdated", prod);
                } catch (error) {
                    socket.emit("error", "Error updating product");
                }
            });
        });
    }

    async emitPaginatedProducts(socket, queryParams) {
        try {
            const result = await product.getPaginatedProducts(queryParams);
            socket.emit("products", {
                productos: result.productos.map((producto) => ({
                    id: producto._id,
                    type_product: producto.type_product,
                    ...producto,
                })),
                categorias: result.categorias,
                pagination: result.pagination,
            });
        } catch (error) {
            socket.emit("error", "Error fetching paginated products");
        }
    }
}

module.exports = SocketProduct;
