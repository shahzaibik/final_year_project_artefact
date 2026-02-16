import { Schema, model, models } from "mongoose";

// BookDemoModel schema
const bookDemoSchema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    createdAt: { type: Date, default: Date.now },
});

const BookDemoModel = models.BookDemo || model("BookDemo", bookDemoSchema);

export default BookDemoModel;
