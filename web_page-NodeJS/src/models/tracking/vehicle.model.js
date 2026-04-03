const { Schema, model } = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");

const VehicleSchema = new Schema({
    licensePlate: { type: String, required: true, unique: true },
    type: { type: String, enum: ["car", "motorcycle", "truck", "bicycle"], required: true },
    brand: { type: String },
    model: { type: String },
    color: { type: String },
    photo: { type: String },
    ownerUser: { type: Schema.Types.ObjectId, ref: "User", required: true },
    gps: { type: Schema.Types.ObjectId, ref: "GPSDevice", default: null },
    locationHistory: [{ type: Schema.Types.ObjectId, ref: "Location" }]
}, {
    timestamps: true,
    versionKey: false
});

VehicleSchema.plugin(mongoosePaginate);

module.exports = model("Vehicle", VehicleSchema);
