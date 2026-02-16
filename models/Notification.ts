import { Schema, model, models } from "mongoose";
// Notification schema
const NotificationSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    type: { type: String, required: true },
    message: { type: String, required: true },
    read: { type: Boolean, default: false },
    relatedIssueId: { type: Schema.Types.ObjectId, ref: "Issue", default: null },
}, { timestamps: true });

const Notification = models.Notification || model("Notification", NotificationSchema);

export default Notification;
