import mongoose from "mongoose";

const deliveryStationSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      unique: true,
      required: [true, "Delivery Station name is required"],
      trim: true,
      minlength: [2, "Delivery Station name must be at least 2 characters long."],
      maxlength: [100, "Delivery Station name cannot exceed 100 characters"],
      match: [
        /^[a-zA-Z0-9_ ]+$/,
        "Delivery Station name should only contain letters, numbers, and spaces",
      ],
    },
    address: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Address",
      required: [true, "Delivery Station address is required"],
    },
    // location: {
    //   type: {
    //     type: String,
    //     enum: ["Point"],
    //     required: [true, "Coordinates type is required"],
    //   },
    //   coordinates: {
    //     type: [Number],
    //     required: [true, "Coordinates are required"],
    //     validate: {
    //       validator: function (value) {
    //         return (
    //           value.length === 2 &&
    //           value[0] >= -180 &&
    //           value[0] <= 180 &&
    //           value[1] >= -90 &&
    //           value[1] <= 90
    //         );
    //       },
    //       message: "Invalid coordinates format",
    //     },
    //   },
    // },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

deliveryStationSchema.virtual("manager", {
  ref: "User",
  localField: "_id",
  foreignField: "deliveryStation",
  justOne: true,
  match: { role: "deliveryStationManager" },
});

const DeliveryStation = mongoose.model("DeliveryStation", deliveryStationSchema);
export default DeliveryStation;
