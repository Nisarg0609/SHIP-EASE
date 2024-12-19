import mongoose from "mongoose";
import slugify from "slugify";
import crypto from "crypto";

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Product name is required"],
      trim: true,
      unique: true,
      minlength: [2, "Product name must be at least 2 characters long."],
      maxlength: [200, "Product name cannot exceed 200 characters"],
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
      minlength: [5, "Product description must be at least 5 characters long."],
      maxlength: [1000, "Product description cannot exceed 100 characters"],
    },
    additionalInformation: {
      type: [
        {
          name: {
            type: String,
            required: true,
          },
          value: {
            type: String,
            required: true,
          },
        },
      ],
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ProductCategory",
      required: [true, "Product category is required"],
    },
    brand: {
      type: String,
      required: true,
      trim: true,
      maxlength: [100, "Brand name cannot exceed 100 characters."],
    },
    maxPurchaseQuantity: {
      type: Number,
      required: [true, "Maximum purchase quantity is required"],
      min: [1, "Minimum purchase quantity must be at least 1"],
      max: [100, "Max purchase quantity cannot exceed 100"],
    },
    tags: [String],
    variants: {
      type: [
        {
          attributes: {
            type: [
              {
                name: {
                  type: String,
                  required: [true, "Variant attribute name is required."], // e.g., "Color", "Size", "RAM", etc.
                  trim: true,
                },
                value: {
                  type: String,
                  required: [true, "Variant attribute value is required."], // e.g., "Red", "Large", "8GB-128GB", etc.
                  trim: true,
                },
              },
            ],
            required: [true, "Variant attribute value is required"],
            validate: {
              validator: function (value) {
                return value.length > 0;
              },
              message: "Attributes can not be empty",
            },
          },
          price: {
            type: Number,
            required: [true, "Variant price is required"],
            min: [0, "Variant Price cannot be negative"],
            max: [1000000, "Variant Price exceeds the allowed limit"],
          },
          discount: {
            type: Number,
            default: 0,
            min: [0, "Variant Discount cannot be negative"],
            max: [100, "Variant Discount cannot be more than 100%"],
          },
          sku: {
            type: String,
            unique: true,
            trim: true,
            maxlength: [250, "SKU cannot exceed 250 characters."],
          },
          images: {
            type: [String],
            required: [true, "Variant images are required"],
            validate: [
              {
                validator: function (value) {
                  return value.length > 0;
                },
                message: "Variant images can not be empty",
              },
              {
                validator: function (images) {
                  return images.length <= 8;
                },
                message: "you cannot have more than 8 images per Variant.",
              },
              {
                validator: function (images) {
                  return images.every(
                    (image) => typeof image === "string" && image.trim().length > 0
                  );
                },
                message: "Each image must be a non-empty string",
              },
            ],
          },
          isActive: {
            type: Boolean,
            default: true,
          },
        },
      ],
      required: [true, "Variant is required"],
      validate: {
        validator: function (value) {
          return value.length > 0;
        },
        message: "Atleast One Variant is required",
      },
    },
    weight: {
      type: Number,
      required: [true, "Product weight is required"],
      min: [0, "Weight must be positive"],
      max: [10, "Weight cannot exceed to 10kg"],
    },
    dimensions: {
      length: {
        type: Number,
        required: [true, "Product length is required"],
        min: [0, "Length must be positive"],
        max: [200, "Length cannot exceed to 200cm"],
      },
      height: {
        type: Number,
        required: [true, "Product height is required"],
        min: [0, "Height must be positive"],
        max: [200, "Height cannot exceed to 200cm"],
      },
      width: {
        type: Number,
        required: [true, "Product width is required"],
        min: [0, "Width must be positive"],
        max: [200, "Width cannot exceed to 200cm"],
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
  { timestamps: true }
);

productSchema.pre("save", function (next) {
  const product = this;

  // Generate slug based on the product name
  if (!product.slug || product.isModified("name")) {
    product.slug = slugify(product.name, { lower: true, strict: true });
  }

  // Generate SKU for each variant if not provided
  product.variants.forEach((variant) => {
    if (!variant.sku) {
      const variantAttributes = variant.attributes
        .map((attr) => attr.value.replace(/\s+/g, "-").toLowerCase())
        .join("-");
      const uniqueId = crypto.randomBytes(3).toString("hex"); // Generate a short unique ID
      variant.sku = `${slugify(product.name, {
        lower: true,
      })}-${variantAttributes}-${uniqueId}`;
    }
  });

  next();
});

const Product = mongoose.model("Product", productSchema);
export default Product;
