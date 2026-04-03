const { Schema, model } = require("mongoose");

const LocationSchema = new Schema({
    gpsDevice: { type: Schema.Types.ObjectId, ref: "GPSDevice", required: true },
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true },
    speed: { type: Number },
    accuracy: { type: Number },
    date: { type: Date, default: Date.now }
});

LocationSchema.index({ gpsDevice: 1, date: -1 });

module.exports = model("Location", LocationSchema);
