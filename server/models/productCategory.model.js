import mongoose from "mongoose";
import slugify from "slugify";
import { capitalizeFirstLetter, removeSpace } from "../utils/helper.js";
import AppError from "../utils/AppError.js";

const productCategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Category name is required!"],
      unique: true,
      trim: true,
      minlength: [2, "Category name must be at least 2 characters long."],
      maxlength: [100, "Category name cannot exceed 100 characters"],
    },
    slug: {
      type: String,
      unique: true,
      trim: true,
      lowercase: true,
      validate: {
        validator: function (value) {
          return /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value);
        },
        message: "Slug must be a valid URL-friendly string (lowercase, hyphen-separated)",
      },
    },
    description: {
      type: String,
      trim: true,
      minlength: [5, "Category description must be at least 5 characters long."],
      maxlength: [10000, "Description cannot exceed 500 characters"],
    },
    parentCategory: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ProductCategory",
      default: null,
    },
    subCategories: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "ProductCategory",
      },
    ],
    image: {
      type: String,
      validate: {
        validator: function (value) {
          return /^(http|https):\/\/[^ "]+$/.test(value);
        },
        message: "Image must be a valid URL",
      },
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true, versionKey: false },
    toObject: { virtuals: true, versionKey: false },
  }
);

productCategorySchema.virtual("isParent").get(function () {
  return !this.parentCategory;
});

productCategorySchema.pre("save", async function (next) {
  if (this.parentCategory && this.parentCategory.equals(this._id))
    return next(new AppError("A Product Category cannot be it's own Category", 400));
  next();
});

// Pre-save hook to automatically create slug from the category name
productCategorySchema.pre("save", function (next) {
  if (!this.slug || this.isModified("name")) {
    this.slug = slugify(this.name, { lower: true, strict: true });
  }
  next();
});

productCategorySchema.pre("save", function (next) {
  if (this.name) {
    capitalizeFirstLetter("name");
    removeSpace("name");
  }
  next();
});

const ProductCategory = mongoose.model("ProductCategory", productCategorySchema);
export default ProductCategory;
