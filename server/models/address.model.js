import mongoose from "mongoose";

const addressSchema = new mongoose.Schema(
  {
    street: {
      type: String,
      required: [true, "Street address is required"],
      trim: true,
      minlength: [2, "Street address must be at least 2 characters long"],
      maxlength: [200, "Street address cannot exceed 200 characters"],
    },
    city: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "City",
      required: [true, "City is required"],
    },
    postalCode: {
      type: String,
      required: [true, "Postal code is required"],
      trim: true,
      match: [/^\d{6}$/, "Postal code must be a 6-digit number"],
    },
    isPrimary: {
      type: Boolean,
      default: false,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

const Address = mongoose.model("Address", addressSchema);
export default Address;
