import AppError from "./AppError.js";

const filterObject = (obj, allowedFields) => {
  if (obj && Object.keys(obj).length > 0) {
    const filterdObject = {};
    Object.keys(obj).forEach((key) => {
      if (allowedFields?.includes(key)) {
        filterdObject[key] = obj[key];
      }
    });
    return filterdObject;
  } else {
    throw new AppError(
      `Request body cannot be empty. Please provide some {field : value} to update.`,
      400
    );
  }
};

const capitalizeFirstLetter = (str) => {
  return str
    .split(" ")
    .map((el) => el.charAt(0).toUpperCase() + el.slice(1))
    .join(" ");
};

const removeSpace = (str) => {
  return str.replace(/\s+/g, " ").trim();
};

export { filterObject, capitalizeFirstLetter, removeSpace };
