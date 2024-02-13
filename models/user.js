const { Schema, model } = require("mongoose");

const UserSchema = new Schema({
    user_id: String,
    links: Array
});

const UserModel = model("users", UserSchema);

module.exports = UserModel;