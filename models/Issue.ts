import { Schema, model, models } from "mongoose";
// Issue schema
const IssueSchema = new Schema({
    title: { type: String, required: true },
    description: { type: String, default: "" },
    status: {
        type: String,
        enum: ["pending", "assigned", "rejected"],
        default: "pending",
    },
    tenantId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    landlordId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    handymanId: { type: Schema.Types.ObjectId, ref: "Handyman", default: null },
}, { timestamps: true });

// Use "fixes" collection for backward compatibility with existing data
const Issue = models.Issue || model("Issue", IssueSchema, "fixes");

export default Issue;
