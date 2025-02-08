"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const ReportSchema = new mongoose_1.Schema({
    entityType: {
        type: String,
        required: true,
        enum: ["posts", "comments", "users"],
    },
    entityId: { type: mongoose_1.Types.ObjectId, required: true, refPath: "entityType" },
    reportedBy: { type: mongoose_1.Types.ObjectId, required: true, ref: 'users' },
    reportType: { type: String, required: true },
    reportDescription: { type: String, required: true },
    isResolved: { type: Boolean, required: true, default: false }
}, { timestamps: true, strictPopulate: false });
exports.default = (0, mongoose_1.model)("reports", ReportSchema);
