const { Schema, model } = require("mongoose");

const schema = new Schema({
    category: {
        type: String,
        required: true,
        unique: true
    }
});

module.exports = model("Category", schema);