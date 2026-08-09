const mongoose = require("mongoose");

const aiImageSchema = new mongoose.Schema({
    text: { type: String, default: "" },
    imageUrl: { type: String, default: "" },
    githubPath: { type: String, default: "" },
    fileName: { type: String, default: "" },
    background: { type: mongoose.Schema.Types.ObjectId, ref: "Background", default: null },
    shayari: { type: mongoose.Schema.Types.ObjectId, ref: "Shayari", default: null },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "Admin", default: null }
}, { timestamps: true, versionKey: false });

module.exports = mongoose.model("AIImage", aiImageSchema);
