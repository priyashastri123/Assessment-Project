const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    first_name: { type: String},
    dob: { type: String}, // You can change this to Date if needed
    address: { type: String },
    phone_number: { type: String},
    state: { type: String},
    zip_code: { type: String},
    email: { type: String},
    gender: { type: String, enum: ["male", "female", "other"] },
    user_type: { type: String, enum: ["User", "Admin"], default: "User" },
  },
  { timestamps: true }
);

const User = mongoose.model("users", userSchema);

module.exports = User;
