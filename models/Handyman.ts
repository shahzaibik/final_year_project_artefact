import { Schema, model, models } from "mongoose";

// Handyman schema
const HandymanSchema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    phoneNumber: { type: String, default: "" },
    address: { type: String, default: "" },
    profession: { type: String, default: "" },
    profileImage: { type: String, default: null },
    landlordId: { type: Schema.Types.ObjectId, ref: "User", required: true },
}, { timestamps: true });

const Handyman = models.Handyman || model("Handyman", HandymanSchema);

export default Handyman;
