async function loadCategories() {
    try {
        const res = await fetch("/api/v1/categories");

        if (!res.ok) {
            throw new Error("Error HTTP " + res.status);
        }

        const data = await res.json();
        console.log("Categorias:", data);

        const categorySelect = document.getElementById("category");

        categorySelect.innerHTML = '<option value="all">Todos los productos</option>';

        const categories = Array.isArray(data) ? data : data.categories;

        categories.forEach(cat => {
            const option = document.createElement("option");
            option.value = cat.category;
            option.textContent = cat.category;
            categorySelect.appendChild(option);
        });

    } catch (error) {
        console.error("Error cargando categorías:", error);
    }
}

document.addEventListener("DOMContentLoaded", loadCategories);