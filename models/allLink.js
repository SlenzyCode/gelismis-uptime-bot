const { Schema, model } = require("mongoose");

const UptimeSchema = new Schema({
    uptime_link: { type: [String], required: true },
});

const AllLink = model("allLink", UptimeSchema);

module.exports = AllLink;
