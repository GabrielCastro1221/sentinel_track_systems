const { Schema, model } = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");

const PetSchema = new Schema({
    petName: { type: String, required: true },
    species: { type: String },
    breed: { type: String },
    age: { type: Number },
    photo: { type: String },
    sex: { type: String, enum: ["hembra", "macho"] },
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    gps: { type: Schema.Types.ObjectId, ref: "GPSDevice", default: null },
}, {
    timestamps: true,
    versionKey: false,
});

PetSchema.plugin(mongoosePaginate);

module.exports = model("Pet", PetSchema);
