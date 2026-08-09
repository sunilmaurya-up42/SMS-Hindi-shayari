const mongoose = require("mongoose");

const imageSchema = new mongoose.Schema({
    filename: { type: String, required: true },
    originalName: { type: String, default: "" },
    mimeType: { type: String, default: "" },
    size: { type: Number, default: 0 },
    path: { type: String, default: "" },
    url: { type: String, default: "" },
    uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: "Admin", default: null }
}, { timestamps: true, versionKey: false });

module.exports = mongoose.model("Image", imageSchema);
