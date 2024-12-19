import slugify from "slugify";
import ProductCategory from "../models/productCategory.model.js";
import AppError from "../utils/AppError.js";
import catchAsync from "../utils/catchAsync.js";
import { filterObject } from "../utils/helper.js";
import { getById, getByIdAndDelete, getMany, sendResponse } from "./factoryHandler.js";
import Product from "../models/product.model.js";
import multer from "multer";
import cloudinary from "../utils/cloudinary.js";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import mongoose from "mongoose";

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "category",
    format: async (req, file) => "jpg",
    public_id: (req, file) => `${Date.now()}-${file.originalname}`,
  },
});

const upload = multer({ storage });

const categoryExists = catchAsync(async (req, res, next) => {
  const categoryId = req.body.category || req.params.id;
  const category = await ProductCategory.findById(categoryId);
  if (!category)
    return next(new AppError("Category not found! Please provide valid Category.", 404));
  next();
});

const isLeafCategory = catchAsync(async (req, res, next) => {
  const categoryId = req.body.category || req.params.id;
  const category = await ProductCategory.findById(categoryId);
  if (!category) return next(new AppError("Category not found", 404));
  if (category.subCategories?.length > 0)
    return next(new AppError("Category is not a leaf category", 400));
  next();
});

const createCategory = catchAsync(async (req, res, next) => {
  const allowedFields = ["name", "description", "parentCategory", "isFeatured"];
  const filteredBody = filterObject(req.body, allowedFields);

  let imagePublicId;

  try {
    if (filteredBody.parentCategory) {
      const parentCategory = await ProductCategory.findById(filteredBody.parentCategory);
      if (!parentCategory) {
        return next(new AppError("Invalid parent category.", 400));
      }
    }

    if (req.file) {
      filteredBody.image = req.file.path;
      imagePublicId = req.file.filename;
    }
    const category = await ProductCategory.create(filteredBody);

    if (filteredBody.parentCategory) {
      await ProductCategory.findByIdAndUpdate(filteredBody.parentCategory, {
        $push: { subCategories: category._id },
      });
    }

    sendResponse(res, category, 201);
  } catch (err) {
    console.log(err);
    if (imagePublicId) await cloudinary.uploader.destroy(imagePublicId);
    return next(new AppError(err.message, 500));
  }
});

const getCategories = getMany(ProductCategory, {
  path: "parentCategory",
  select: "name",
});

// const populateCategories = async (categoryId) => {
//   const category = await ProductCategory.findById(categoryId).select(
//     "name subCategories"
//   );

//   if (category.subCategories.length > 0) {
//     category.subCategories = await Promise.all(
//       category.subCategories.map(
//         async (subCategory) => await populateCategories(subCategory)
//       )
//     );
//   }

//   return category;
// };

// const getCategories = catchAsync(async (req, res, next) => {
//   const categoryIds = await ProductCategory.find({ parentCategory: null }, { _id: 1 });

//   const categories = await Promise.all(
//     categoryIds.map(async (category) => await populateCategories(category.id))
//   );
//   sendResponse(res, categories, categories.length);
// });

// const populateCategories = async (categoryId) => {
//   const objectId = new mongoose.Types.ObjectId(categoryId);

//   const category = await ProductCategory.aggregate([
//     {
//       $match: {
//         _id: objectId,
//       },
//     },
//     {
//       $project: {
//         name: 1,
//         subCategories: 1,
//       },
//     },
//   ]);

//   if (category[0].subCategories.length > 0) {
//     category[0].subCategories = await Promise.all(
//       category[0].subCategories.map(
//         async (subCategory) => await populateCategories(subCategory)
//       )
//     );
//   }

//   return category[0];
// };

// const getCategories = catchAsync(async (req, res, next) => {
//   const categoryIds = await ProductCategory.find({ parentCategory: null }, { _id: 1 });
//   const categories = await Promise.all(
//     categoryIds.map(async (categoryId) => await populateCategories(categoryId.id))
//   );
//   sendResponse(res, categories, categories.length);
// });

const populateRecursive = async (categoryId) => {
  const category = await ProductCategory.findById(categoryId)
    .select("_id name subCategories")
    .populate("subCategories")
    .lean();

  if (category && category.subCategories.length > 0) {
    category.subCategories = await Promise.all(
      category.subCategories.map(async (subCategory) => {
        return await populateRecursive(subCategory._id);
      })
    );
  }

  return category;
};

const getCategoriesWithSubcategories = catchAsync(async (req, res, next) => {
  const categories = await ProductCategory.find().select("_id name subCategories").lean();
  const populatedCategories = await Promise.all(
    categories.map(async (category) => {
      return await populateRecursive(category._id);
    })
  );

  sendResponse(res, populatedCategories, populatedCategories.length);
});

const getCategory = getById(ProductCategory);

const updateCategory = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const { parentCategory } = req.body;
  const category = await ProductCategory.findById(id);
  if (!category) return next(new AppError(`No Category found with id : ${id}`, 400));

  const allowedFields = ["name", "description", "isFeatured", "isActive"];
  const filteredBody = filterObject(req.body, allowedFields);

  if (req.file) {
    const category = await ProductCategory.findById(req.params.id);
    if (!category) return next(new AppError("Category not found", 404));

    if (category.image) {
      const imagePublicId = category.image.split("/").pop().split(".")[0];
      await cloudinary.uploader.destroy(imagePublicId);
    }

    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: "category",
      public_id: `${Date.now()}-${req.file.originalname}`,
    });

    filteredBody.image = result.secure_url;
  }

  if (parentCategory) {
    const parent = await ProductCategory.findById(parentCategory);
    if (!parent) return next(new AppError("Invalid Parent Category", 400));

    if (category.parentCategory) {
      if (category.parentCategory.equals(parentCategory)) {
        return next(
          new AppError("Parent Category cannot be the same as the old one.", 400)
        );
      }
      const oldParent = await ProductCategory.findById(category.parentCategory);
      oldParent.subCategories = oldParent.subCategories.filter(
        (c) => !c.equals(category._id)
      );
      await oldParent.save();
    }

    category.parentCategory = parent._id;
    await category.save();
    parent.subCategories.push(category._id);
    await parent.save({ validateBeforeSave: false });
  }

  const updatedCategory = await ProductCategory.findByIdAndUpdate(
    req.params.id,
    filteredBody,
    {
      new: true,
      runValidators: true,
    }
  );

  if (req.body.name) {
    category.slug = slugify(req.body.name, { lower: true, strict: true });
    await category.save();
  }

  sendResponse(res, updatedCategory, 1);
});

const deleteCategory = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const category = await ProductCategory.findById(id);
  if (!category) return next(new AppError(`No category found for ${id}`, 404));

  if (category.subCategories && category.subCategories.length !== 0)
    return next(
      new AppError(
        `Cannot delete Category. Category contains sub-categories. If you want to delete this category then delete sub-categories first.`,
        400
      )
    );

  if (category.parentCategory) {
    const parent = await ProductCategory.findById(category.parentCategory);
    parent.subCategories = parent.subCategories.filter((c) => !c.equals(category._id));
    await parent.save();
  }
  await ProductCategory.findByIdAndDelete(category._id);

  res.status(200).json({
    status: "success",
    data: null,
  });
});

const getProductsUnderCategory = (req, res, next) =>
  getMany(
    Product,
    {
      path: "category",
      select: "name",
    },
    { category: req.params.id }
  )(req, res, next);

export {
  createCategory,
  getCategories,
  getCategory,
  getCategoriesWithSubcategories,
  updateCategory,
  deleteCategory,
  categoryExists,
  isLeafCategory,
  getProductsUnderCategory,
  upload,
};
