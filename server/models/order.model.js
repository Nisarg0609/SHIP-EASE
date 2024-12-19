import mongoose from "mongoose";
import crypto from "crypto";

const orderSchema = new mongoose.Schema(
  {
    orderNumber: {
      type: String,
      unique: true,
      trim: true,
      minlength: [5, "Order number must be at least 5 characters long"],
    },
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User is required"],
    },
    items: {
      type: [
        {
          product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product",
            required: [true, "Product is required"],
          },
          variant: {
            type: String,
            required: true,
          },
          quantity: {
            type: Number,
            required: [true, "Product quantity is required"],
            min: [1, "Quantity must be at least 1"],
          },
          price: {
            type: Number,
            required: [true, "Product price is required"],
            min: [0, "Price cannot be negative"],
          },
          discount: {
            type: Number,
            min: [0, "Discount cannot be negative"],
            max: [100, "Discount cannot exceed 100%"],
            default: 0,
          },
          totalPrice: {
            type: Number,
            required: [true, "Total price is required"],
          },
        },
      ],
      required: [true, "Items are required"],
      validate: {
        validator: function (value) {
          return value.length > 0;
        },
        message: "Items cannot be empty",
      },
    },
    deliveryCost: {
      type: Number,
      default: 40,
    },
    totalAmount: {
      type: Number,
      required: [true, "Total amount is required"],
      min: [0, "Total amount cannot be negative"],
    },
    shippingAddress: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Address",
      required: [true, "Shipping address is required"],
    },
    paymentStatus: {
      type: String,
      enum: ["Pending", "Completed", "Failed"],
      default: "Pending",
    },
    paymentMethod: {
      type: String,
      enum: ["COD"],
      default: "COD",
    },
    orderStatus: {
      type: String,
      enum: [
        "Processing",
        "Shipped",
        "Arrived at Delivery Station",
        "Out for Delivery",
        "Delivered",
        "Cancelled",
      ],
      default: "Processing",
    },
    assignmentStatus: {
      type: String,
      enum: [
        "Not Assigned",
        "Assigned to Warehouse Driver",
        "Delivered to Delivery Station",
        "Assigned to Delivery Station Driver",
        "Delivered",
      ],
      default: "Not Assigned",
    },
    warehouse: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Warehouse",
      required: [true, "Warehouse is required"],
    },
    deliveryStation: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "DeliveryStation",
      required: [true, "Delivery station is required"],
    },
    warehouseDriver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    deliveryStationDriver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    vehicle: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Vehicle",
    },
    deliveryDate: {
      type: Date,
      default: () => {
        const deliveryDate = new Date();
        deliveryDate.setDate(deliveryDate.getDate() + 5);
        return deliveryDate;
      },
    },
    deliveredAt: Date,
    totalWeight: Number,
    totalVolume: {
      length: Number,
      width: Number,
      height: Number,
    },
    assignedToWarehouseDriverAt: {
      type: Date,
    },
    assignedToDeliveryStationDriverAt: {
      type: Date,
    },
    isDelivered: {
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

orderSchema.pre("save", async function (next) {
  if (!this.orderNumber) {
    try {
      const dateStr = new Date().toISOString().replace(/[-:.TZ]/g, "");
      const randomHash = crypto.randomBytes(3).toString("hex");
      this.orderNumber = `ORD-${dateStr}-${randomHash}`;

      next();
    } catch (error) {
      next(error);
    }
  } else {
    next();
  }
});

const Order = mongoose.model("Order", orderSchema);
export default Order;
