const { engine } = require("express-handlebars");
const path = require("path");

module.exports = (app) => {
    app.engine(
        "hbs",
        engine({
            extname: ".hbs",
            runtimeOptions: {
                allowProtoPropertiesByDefault: true,
                allowProtoMethodsByDefault: true,
            },
            helpers: {
                times: function (n, block) {
                    let accum = "";
                    for (let i = 0; i < n; ++i) {
                        accum += block.fn(i);
                    }
                    return accum;
                },
                formatDate: function (date) {
                    if (!date) return "";
                    const options = { day: "2-digit", month: "short", year: "numeric" };
                    return new Date(date).toLocaleDateString("es-ES", options);
                },
                eq: function (a, b) {
                    return a === b;
                },
                truncate: function (str, len) {
                    if (str.length > len) {
                        return str.substring(0, len) + "...";
                    }
                    return str;
                },
                add: function (a, b) {
                    return a + b;
                },
                subtract: function (a, b) {
                    return a - b;
                },
                reduce: function (array, key) {
                    if (!Array.isArray(array)) return 0;
                    return array.reduce((acc, item) => {
                        return acc + (item[key] || 0);
                    }, 0);
                },
                toFixed: function (number, decimals) {
                    if (number == null) return "";
                    return parseFloat(number).toFixed(decimals);
                },
                formatPrice: function (price) {
                    if (price == null) return "";
                    return new Intl.NumberFormat("es-CO", {
                        style: "currency",
                        currency: "COP",
                        minimumFractionDigits: 0
                    }).format(price);
                }
            }
        })
    );

    app.set("view engine", "hbs");
    app.set("views", path.join(__dirname, "../views"));
};
