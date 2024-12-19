import APIFeatures from "../utils/apiFeatures.js";
import AppError from "../utils/AppError.js";
import catchAsync from "../utils/catchAsync.js";
import { filterObject } from "../utils/helper.js";

const sendResponse = (res, data, totalDocs, statusCode = 200) => {
  res.status(statusCode).json({
    status: "success",
    length: totalDocs,
    data,
  });
};

const populateQuery = (query, populateOptions) => {
  if (Array.isArray(populateOptions) && populateOptions.length > 0) {
    populateOptions.forEach((option) => {
      if (Object.keys(option).length > 0) query = query.populate(option);
    });
  } else {
    query = query.populate(populateOptions);
  }
  return query;
};

// CREATE MANY - not recommended
const createMany = (Model, allowedFields) =>
  catchAsync(async (req, res, next) => {
    const list = req.body;
    if (!Array.isArray(list) || list.length === 0)
      return next(new AppError("Request body must be non-empty array.", 400));

    const filteredList = [];
    list.forEach((item) => {
      filteredList.push(filterObject(item, allowedFields));
    });

    const docs = await Model.insertMany(filteredList);
    sendResponse(res, docs);
  });

// CREATE ONE
const createOne = (Model, allowedFields) =>
  catchAsync(async (req, res, next) => {
    const filteredBody = filterObject(req.body, allowedFields);
    const doc = await Model.create(filteredBody);
    sendResponse(res, doc);
  });

// GET Many
const getMany = (Model, populateOptions, queryOptions = {}, projectionOptions = {}) =>
  catchAsync(async (req, res, next) => {
    // query and projection
    let query = Model.find(queryOptions, projectionOptions);

    // populate
    if (populateOptions) query = populateQuery(query, populateOptions);

    // filter, sort, fields, paginate
    let features = new APIFeatures(query, req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();

    const docs = await features.query;

    const excludeFields = ["sort", "page", "limit", "fields"];
    let filter = {};
    Object.keys(req.query).map((key) => {
      if (!excludeFields.includes(key)) {
        filter[key] = req.query[key];
      }
    });

    const totalDocs = await Model.countDocuments(filter);

    if (docs.length === 0) return next(new AppError(`Documents not found`, 404));
    sendResponse(res, docs, totalDocs);
  });

// GET ONE
// const getOne = (Model, populateOptions, queryOptions = {}, projectionOptions = {}) =>
//   catchAsync(async (req, res, next) => {
//     // query and projection
//     let query = Model.findOne(queryOptions, projectionOptions);

//     // populate
//     if (populateOptions) query = populateQuery(query, populateOptions);

//     const doc = await query;
//     if (!doc) return next(new AppError(`Document not found`, 404));
//     sendResponse(res, doc);
//   });

// GET BY ID
const getById = (Model, populateOptions, projectionOptions = {}) =>
  catchAsync(async (req, res, next) => {
    // query and projection
    let query = Model.findById(req.params.id, projectionOptions);

    // populate
    if (populateOptions) query = populateQuery(query, populateOptions);

    const doc = await query;
    if (!doc) return next(new AppError(`Document not found`, 404));
    sendResponse(res, doc);
  });

// GET BY ID AND UPDATE
const getByIdAndUpdate = (Model, allowedFields) =>
  catchAsync(async (req, res, next) => {
    const filteredBody = filterObject(req.body, allowedFields);
    const updatedDoc = await Model.findByIdAndUpdate(req.params.id, filteredBody, {
      new: true,
      runValidators: true,
    });
    if (!updatedDoc)
      return next(new AppError(`No document found with id : ${req.params.id}`, 404));
    sendResponse(res, updatedDoc);
  });

// UPDATE ONE
const updateOne = (Model, allowedFields) =>
  catchAsync(async (req, res, next) => {
    const docId = req.params.id;
    const document = await Model.findById(docId);
    if (!document) {
      return next(new AppError(`No document found with id: ${docId}`, 404));
    }

    const filteredBody = filterObject(req.body, allowedFields);
    Object.keys(filteredBody).forEach((key) => {
      document[key] = filteredBody[key];
    });
    const updatedDocument = await document.save();
    sendResponse(res, updatedDocument);
  });

//  DELETE BY ID
const getByIdAndDelete = (Model) =>
  catchAsync(async (req, res, next) => {
    const document = await Model.findByIdAndDelete(req.params.id);
    if (!document)
      return next(new AppError(`No document found with id : ${req.params.id}`, 404));
    sendResponse(res, null, 0, 204);
  });
export {
  createOne,
  createMany,
  getMany,
  getById,
  updateOne,
  getByIdAndUpdate,
  sendResponse,
  getByIdAndDelete,
};
