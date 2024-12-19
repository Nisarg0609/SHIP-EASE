import mongoose from "mongoose";

const warehouseSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      unique: true,
      required: [true, "Warehouse name is required"],
      trim: true,
      minlength: [2, "Warehouse name must be at least 2 characters long."],
      maxlength: [100, "Warehouse name cannot exceed 100 characters"],
      match: [
        /^[a-zA-Z0-9_ ]+$/,
        "Warehouse name should only contain letters, numbers, spaces and underscores",
      ],
    },
    address: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Address",
      required: [true, "Warehouse address is required"],
    },
    transportCities: {
      type: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "City",
        },
      ],
    },
    products: {
      type: [
        {
          product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product",
            required: true,
          },
          variants: [
            {
              sku: {
                type: String,
                required: [true, "Variant SKU is required."],
                trim: true,
              },
              stock: {
                type: Number,
                required: [true, "Variant Stock is required."],
                min: [0, "Variant Stock cannot be negative"],
                max: [255, "Variant Stock cannot exceed 255 units"],
              },
            },
          ],
        },
      ],
    },
    // location: {
    //   type: {
    //     type: String,
    //     enum: ["Point"],
    //     default: "Point",
    //   },
    //   coordinates: {
    //     type: [Number],
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

warehouseSchema.virtual("manager", {
  ref: "User",
  localField: "_id",
  foreignField: "warehouse",
  justOne: true,
  match: { role: "warehouseManager" },
});

warehouseSchema.index({ location: "2dsphere" });

const Warehouse = mongoose.model("Warehouse", warehouseSchema);
export default Warehouse;
