import mongoose from "mongoose";

const cartSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: [true, "User is required to add cart"],
  },
  items: {
    type: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: [true, "Product is required to add cart"],
        },
        variants: [
          {
            variantSku: {
              type: String,
              required: [true, "Variant sku is required to add cart"],
            },
            variantStock: {
              type: Number,
              required: [true, "Variant stock is required to add cart"],
            },
          },
        ],
      },
    ],
  },
});

const Cart = mongoose.model("Cart", cartSchema);
export default Cart;
