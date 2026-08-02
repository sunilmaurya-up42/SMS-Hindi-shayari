const mongoose = require("mongoose");

const reportSchema = new mongoose.Schema({

    name: {
        type: String,
        required: true,
        trim: true
    },

    type: {
        type: String,
        required: true,
        enum: [
            "users",
            "shayari",
            "downloads",
            "comments",
            "categories",
            "analytics",
            "custom"
        ]
    },

    format: {
        type: String,
        enum: [
            "csv",
            "xlsx",
            "pdf",
            "json"
        ],
        default: "csv"
    },

    generatedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    fileName: {
        type: String,
        required: true
    },

    filePath: {
        type: String,
        required: true
    },

    fileSize: {
        type: Number,
        default: 0
    },

    totalRecords: {
        type: Number,
        default: 0
    },

    filters: {
        type: Object,
        default: {}
    },

    downloadCount: {
        type: Number,
        default: 0
    },

    status: {
        type: String,
        enum: [
            "processing",
            "completed",
            "failed"
        ],
        default: "processing"
    },

    error: {
        type: String,
        default: null
    },

    expiresAt: {
        type: Date,
        default: null
    }

}, {

    timestamps: true

});

reportSchema.index({
    generatedBy: 1,
    createdAt: -1
});

reportSchema.index({
    status: 1
});

reportSchema.index({
    expiresAt: 1
});

module.exports = mongoose.model(
    "Report",
    reportSchema
);
