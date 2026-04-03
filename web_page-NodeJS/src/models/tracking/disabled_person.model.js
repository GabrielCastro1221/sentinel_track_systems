const { Schema, model } = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");

const DisabledPersonSchema = new Schema({
    name: { type: String, required: true },
    age: { type: Number },
    disabilityType: { type: String, required: true },
    photo: { type: String },
    responsibleUser: { type: Schema.Types.ObjectId, ref: "User", required: true },
    gps: { type: Schema.Types.ObjectId, ref: "GPSDevice", default: null },
    locationHistory: [{ type: Schema.Types.ObjectId, ref: "Location" }],
    CC: { type: String, required: true, unique: true, trim: true },
    dateOfBirth: { type: Date },
    sex: { type: String, enum: ["masculino", "femenino", "Otro"], default: "Otro" },
    disabilityDescription: { type: String },
    medicalHistory: { type: String },
    allergies: [{ type: String }],
    medications: [{ type: String }],
    bloodType: { type: String, enum: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"], default: null },
    emergencyContactName: { type: String },
    emergencyContactPhone: { type: String },
    emergencyContactRelation: { type: String }
}, {
    timestamps: true,
    versionKey: false
});

DisabledPersonSchema.plugin(mongoosePaginate);

module.exports = model("DisabledPerson", DisabledPersonSchema);
