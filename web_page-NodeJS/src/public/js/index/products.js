const socket = io();
const productsContainer = document.querySelector(".products__container");
const categorySelect = document.getElementById("category");
const priceSelect = document.getElementById("price");
const searchInput = document.getElementById("search");
const paginationContainer = document.querySelector(".pagination");

let allProducts = [];
let currentPage = 1;
let limit = 6;

function renderStars(rating) {
    const maxStars = 5;
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 >= 0.5 ? 1 : 0;
    const emptyStars = maxStars - fullStars - halfStar;

    let starsHtml = "";

    for (let i = 0; i < fullStars; i++) {
        starsHtml += '<i class="fi fi-ss-star icon-star"></i>';
    }

    if (halfStar) {
        starsHtml += '<i class="fi fi-ss-star-half-alt icon-star"></i>';
    }

    for (let i = 0; i < emptyStars; i++) {
        starsHtml += '<i class="fi fi-rs-star icon-star"></i>';
    }

    return starsHtml;
}

function renderProducts(products) {
    productsContainer.innerHTML = "";

    if (products.length === 0) {
        productsContainer.innerHTML = "<p>No se encontraron productos.</p>";
        return;
    }

    products.forEach((prod) => {
        const productItem = document.createElement("div");
        productItem.classList.add("product__item");

        productItem.innerHTML = `
        <div class="product__banner">
        <a href="/producto/${prod.id}" class="product__images">
            <img src="${prod.image || '/assets/images/about.png'}" alt="${prod.type_product}" class="product__img default">
            <img src="${prod.image || '/assets/images/about.png'}" alt="${prod.type_product}" class="product__img hover">
        </a>
        <div class="product__actions">
            <a href="/producto/${prod.id}" class="action__btn" aria-label="Detalle del producto">
                <i class="fi fi-bs-eye"></i>
            </a>
            <a href="#" class="action__btn share__btn" aria-label="Compartir">
                <i class="fi fi-bs-share"></i>
            </a>
        </div>
        <div class="product__badge light-pink">Destacado</div>
        </div>
        <div class="product__content">
        <span class="product__category" style="color: #ff3c3c; text-shadow: ">${prod.category || "Sin categoría"}</span>
        <a href="/tienda/${prod.id}">
            <h3 class="product__title">${prod.title || "Rastreador"}</h3>
        </a>
        <div class="product__price flex">
            <span class="new__price">$ ${prod.price || 0}</span>
        </div>
        <div class="product__rating">
            ${renderStars(prod.averageRating || 0)}
            <span class="rating-number">${(prod.averageRating || 0).toFixed(2)}</span>
        </div>
        <form class="add-to-cart-form" data-pid="${prod.id}">
            <button type="submit" class="action__btn cart__btn" aria-label="Añadir al carrito">
                <i class="fi fi-bs-shopping-cart"></i>
            </button>
        </form>
        </div>
    `;
        productsContainer.appendChild(productItem);
    });

    attachCartListeners();
}

function renderCategories(products) {
    const categories = [...new Set(products.map(p => p.category).filter(Boolean))];
    categorySelect.innerHTML = `<option value="all">Todas</option>`;
    categories.forEach(category => {
        const option = document.createElement("option");
        option.value = category;
        option.textContent = category;
        categorySelect.appendChild(option);
    });
}

function applyFilters() {
    let filtered = [...allProducts];

    const category = categorySelect.value;
    if (category !== "all") {
        filtered = filtered.filter(p => p.category === category);
    }

    const price = priceSelect.value;
    if (price === "low") {
        filtered.sort((a, b) => a.price - b.price);
    } else if (price === "high") {
        filtered.sort((a, b) => b.price - a.price);
    }

    const search = searchInput.value.toLowerCase();
    if (search) {
        filtered = filtered.filter(p =>
            (p.title && p.title.toLowerCase().includes(search)) ||
            (p.category && p.category.toLowerCase().includes(search))
        );
    }

    const totalPages = Math.ceil(filtered.length / limit);
    const start = (currentPage - 1) * limit;
    const end = start + limit;
    const paginated = filtered.slice(start, end);

    renderProducts(paginated);
    renderPagination(totalPages);
}

function renderPagination(totalPages) {
    paginationContainer.innerHTML = "";

    if (totalPages <= 1) return;

    if (currentPage > 1) {
        const prevBtn = document.createElement("button");
        prevBtn.textContent = "Anterior";
        prevBtn.onclick = () => { currentPage--; applyFilters(); };
        paginationContainer.appendChild(prevBtn);
    }

    for (let i = 1; i <= totalPages; i++) {
        const pageBtn = document.createElement("button");
        pageBtn.textContent = i;
        if (i === currentPage) pageBtn.disabled = true;
        pageBtn.onclick = () => { currentPage = i; applyFilters(); };
        paginationContainer.appendChild(pageBtn);
    }

    if (currentPage < totalPages) {
        const nextBtn = document.createElement("button");
        nextBtn.textContent = "Siguiente";
        nextBtn.onclick = () => { currentPage++; applyFilters(); };
        paginationContainer.appendChild(nextBtn);
    }
}

function attachCartListeners() {
    const forms = document.querySelectorAll(".add-to-cart-form");
    forms.forEach(form => {
        form.addEventListener("submit", async (e) => {
            e.preventDefault();
            const pid = form.dataset.pid;

            const userData = JSON.parse(localStorage.getItem("user"));
            let cid = userData?.cart;
            let isGuest = false;

            if (!cid) {
                let guestId = localStorage.getItem("guestId");
                if (!guestId) {
                    guestId = crypto.randomUUID();
                    localStorage.setItem("guestId", guestId);
                }
                cid = guestId;
                isGuest = true;
            }

            const url = isGuest
                ? `/api/v1/cart/guest/${cid}/products/${pid}`
                : `/api/v1/cart/${cid}/products/${pid}`;

            try {
                const res = await fetch(url, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ quantity: 1 })
                });

                if (res.ok || res.redirected) {
                    Toastify({
                        text: isGuest ? "Producto agregado al carrito de invitado" : "Producto agregado al carrito",
                        duration: 2000,
                        gravity: "top",
                        position: "right",
                        backgroundColor: "#4CAF50",
                        callback: () => {
                            window.location.href = isGuest ? `/cart/${cid}` : `/cart/${cid}`;
                        }
                    }).showToast();
                } else {
                    const err = await res.json();
                    Toastify({
                        text: "Error al agregar producto: " + err.message,
                        duration: 3000,
                        gravity: "top",
                        position: "right",
                        backgroundColor: "#ff0000"
                    }).showToast();
                }
            } catch (error) {
                console.error("Error de red:", error);
                Toastify({
                    text: "Error de conexión al servidor",
                    duration: 3000,
                    gravity: "top",
                    position: "right",
                    backgroundColor: "#ff0000"
                }).showToast();
            }
        });
    });
}

categorySelect.addEventListener("change", () => {
    currentPage = 1;
    applyFilters();
});
priceSelect.addEventListener("change", () => {
    currentPage = 1;
    applyFilters();
});
searchInput.addEventListener("input", () => {
    currentPage = 1;
    applyFilters();
});

socket.on("products", (data) => {
    allProducts = data.productos || [];
    renderCategories(allProducts);
    currentPage = 1;
    applyFilters();
});

socket.on("error", (msg) => {
    console.error("Error vía socket:", msg);
});
