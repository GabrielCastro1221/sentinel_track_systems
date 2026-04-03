const { Schema, model} = require("mongoose");

const reviewSchema = new Schema(
    {
        product: { type: Schema.Types.ObjectId, ref: "Product" },
        user: { type: Schema.Types.ObjectId, ref: "User" },
        reviewText: { type: String, required: true },
        rating: { type: Number, required: true, min: 0, max: 5, default: 0 },
    },
    {
        timestamps: true,
        versionKey: false,
    }
);

module.exports = model("Review", reviewSchema);