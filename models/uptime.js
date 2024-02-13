const { Schema, model } = require("mongoose");

const UptimeSchema = new Schema({
    userId: { type: String, required: true },
    project_name: { type: [String], required: true },
    uptime_link: { type: [String], required: true },
    version: { type: Number, default: 0 },
});

const UptimeModel = model("uptimes", UptimeSchema);

module.exports = UptimeModel;
