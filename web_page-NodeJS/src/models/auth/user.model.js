const { Schema, model } = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");

const UserSchema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    photo: { type: String },
    password: { type: String, required: true },
    role: { type: String, enum: ["super_admin", "admin", "usuario"], default: "usuario" },
    phone: { type: String },
    address: { type: String },
    cart: { type: Schema.Types.ObjectId, ref: "Cart" },
    city: { type: String },
    gender: { type: String, enum: ["masculino", "femenino", "otro"] },
    age: { type: Number },
    pets: [{ type: Schema.Types.ObjectId, ref: "Pet" }],
    tickets: [{ type: Schema.Types.ObjectId, ref: "Ticket" }],
    vehicle: [{ type: Schema.Types.ObjectId, ref: "Vehicle" }],
    disabled_person: [{ type: Schema.Types.ObjectId, ref: "DisabledPerson" }],
    asset: [{ type: Schema.Types.ObjectId, ref: "Asset" }],
    resetToken: { token: String, expire: Date },
}, {
    timestamps: true,
    versionKey: false,
});

UserSchema.plugin(mongoosePaginate);

module.exports = model("User", UserSchema);
