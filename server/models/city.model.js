import mongoose from "mongoose";
import { capitalizeFirstLetter, removeSpace } from "../utils/helper.js";

const citySchema = new mongoose.Schema(
  {
    city: {
      type: String,
      required: [true, "City is required!"],
      unique: true,
      trim: true,
      minlength: [2, "City must be at least 2 characters long."],
      maxlength: [50, "City cannot exceed 50 characters"],
      match: [/^[A-Za-z\s]+$/, "City should only contain letters"],
    },
    state: {
      type: String,
      trim: true,
      minlength: [2, "State must be at least 2 characters long"],
      maxlength: [50, "State cannot exceed 50 characters"],
      match: [/^[A-Za-z\s]+$/, "State should only contain letters"],
      default: "Gujarat",
    },
    country: {
      type: String,
      trim: true,
      minlength: [2, "State must be at least 2 characters long"],
      maxlength: [50, "State cannot exceed 50 characters"],
      match: [/^[A-Za-z\s]+$/, "State should only contain letters"],
      default: "India",
    },
    pincodes: {
      type: [String],
      validate: [
        {
          validator: function (pincodes) {
            return new Set(pincodes).size === pincodes.length;
          },
          message: "Pincode values must be unique.",
        },
        {
          validator: function (pincodes) {
            return pincodes.every((pincode) => /^[0-9]{6}$/.test(pincode));
          },
          message: "Invalid Pincode format in the list.",
        },
      ],
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

// capitalize the first letter and remove extra spaces
citySchema.pre("save", function (next) {
  const fieldsToUpdate = ["city", "state", "country"];
  fieldsToUpdate.map((field) => {
    if (this[field]) {
      this[field] = capitalizeFirstLetter(this[field]);
      this[field] = removeSpace(this[field]);
    }
  });
  next();
});

const City = mongoose.model("City", citySchema);
export default City;
