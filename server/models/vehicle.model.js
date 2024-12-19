import mongoose from "mongoose";

const vehicleSchema = new mongoose.Schema(
  {
    vehicleNumber: {
      type: String,
      required: [true, "Vehicle number is required"],
      unique: true,
      trim: true,
      match: [
        /^[A-Z]{2}\d{2}[A-Z]{2}\d{4}$/,
        "Vehicle number must follow the format XX00XX0000",
      ],
    },
    type: {
      type: String,
      enum: ["Small-Truck", "Van", "Box-Truck"],
      required: [true, "Vehicle type is required"],
    },
    weightCapacity: {
      type: Number,
    },
    dimensions: {
      length: Number,
      height: Number,
      width: Number,
    },
    warehouse: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Warehouse",
      required: [true, "warehouse is required"],
    },
    isAvailable: {
      type: Boolean,
      default: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

// set weightCapacity and dimensions before save
vehicleSchema.pre("save", function (next) {
  if (this.type === "Van") {
    this.weightCapacity = 1000;
    this.dimensions = {
      length: 300,
      height: 150,
      width: 150,
    };
  } else if (this.type === "Small-Truck") {
    this.weightCapacity = 1500;
    this.dimensions = {
      length: 400,
      height: 200,
      width: 200,
    };
  } else if (this.type === "Box-Truck") {
    this.weightCapacity = 3000;
    this.dimensions = {
      length: 700,
      height: 250,
      width: 250,
    };
  }
  next();
});

const Vehicle = mongoose.model("Vehicle", vehicleSchema);
export default Vehicle;
