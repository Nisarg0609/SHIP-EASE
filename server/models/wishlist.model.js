import mongoose from "mongoose";

const wishlistSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  items: [
    {
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true,
      },
      variants: [
        {
          variantSku: {
            type: String,
            required: true,
          },
          addedAt: {
            type: Date,
            default: Date.now,
          },
        },
      ],
    },
  ],
});

const Wishlist = mongoose.model("Wishlist", wishlistSchema);
export default Wishlist;
