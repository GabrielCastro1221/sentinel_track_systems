const { Schema, model } = require("mongoose");

const schema = new Schema({
    amount: { type: Number, required: true },
    city_ship: { type: String, required: true }
});

module.exports = model("Shipping", schema);