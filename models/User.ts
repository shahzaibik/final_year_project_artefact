import { Schema, model, models } from "mongoose";
// User schema
const UserSchema = new Schema({
    name: { type: String, required: true },
    lastName: { type: String, default: "" },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, default: "Landlord", enum: ["Landlord", "Tenant"] },
    landlordId: { type: Schema.Types.ObjectId, ref: "User", default: null },
    profileImage: { type: String, default: null },
    phoneNumber: { type: String, default: "" },
    ssn: { type: String, default: "" },
    address: { type: String, default: "" },
    profession: { type: String, default: "" },
    emergencyContact: { type: String, default: "" },
    agreement: { type: String, default: null },
    resetPasswordToken: { type: String, default: null },
    resetPasswordExpire: { type: Date, default: null },
});

const User = models.User || model("User", UserSchema);

export default User;