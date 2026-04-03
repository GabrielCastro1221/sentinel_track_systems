const { Schema, model } = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");

const LocationSchema = new Schema(
    {
        latitude: { type: Number, required: true },
        longitude: { type: Number, required: true },
        date: { type: Date, default: Date.now },
        city: { type: String, trim: true, default: null },
        zone: { type: String, trim: true, default: null },
        address: { type: String, trim: true, default: null }
    },
    { _id: false }
);

const POISchema = new Schema(
    {
        name: { type: String, required: true, trim: true },
        description: { type: String, trim: true },
        latitude: { type: Number, required: true },
        longitude: { type: Number, required: true },
        createdAt: { type: Date, default: Date.now }
    },
    { _id: true }
);

const GeofenceSchema = new Schema(
    {
        name: { type: String, required: true, trim: true },
        description: { type: String, trim: true },
        polygon: { type: [[Number]], required: true },
        createdAt: { type: Date, default: Date.now }
    },
    { _id: true }
);

const GPSDeviceSchema = new Schema(
    {
        deviceId: { type: String, required: true, unique: true, trim: true },
        name: { type: String, trim: true, default: "SentinelTrack Systems GPS Device" },
        active: { type: Boolean, default: true },
        pet: { type: Schema.Types.ObjectId, ref: "Pet", default: null },
        vehicle: { type: Schema.Types.ObjectId, ref: "Vehicle", default: null },
        disabled_person: { type: Schema.Types.ObjectId, ref: "DisabledPerson", default: null },
        lastLocation: { type: LocationSchema, default: null },
        locationHistory: [LocationSchema],
        pointsOfInterest: [POISchema],
        geofences: [GeofenceSchema],
        connectionStatus: { type: String, enum: ["online", "offline"], default: "offline" },
        assignedToUser: { type: Schema.Types.ObjectId, ref: "User", default: null }
    },
    {
        timestamps: true,
        versionKey: false
    }
);

GPSDeviceSchema.index({ deviceId: true });
GPSDeviceSchema.index({ active: 1 });
GPSDeviceSchema.index({ pet: 1 });
GPSDeviceSchema.index({ connectionStatus: 1 });
GPSDeviceSchema.plugin(mongoosePaginate);

module.exports = model("GPSDevice", GPSDeviceSchema);
