import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import AppError from "../utils/AppError.js";
import catchAsync from "../utils/catchAsync.js";
import { filterObject } from "../utils/helper.js";

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET_KEY, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

const signUp = catchAsync(async (req, res, next) => {
  const allowedFields = [
    "name",
    "email",
    "password",
    "passwordConfirm",
    "gender",
    "dateOfBirth",
    "gender",
    "phone",
    "address",
    "warehouseId",
    "deliveryStationId",
    "driverLicenseNumber",
  ];

  // 1. check if user is already exists
  const userExists = await User.findOne({ email: req.body.email });
  if (userExists) return next(new AppError("User already exists", 400));

  // 2. create new user
  const filteredBody = filterObject(req.body, allowedFields);
  const user = await User.create(filteredBody);

  // 3. create token
  const token = signToken(user._id);

  // 4. send response with token
  res.status(200).json({
    status: "success",
    user,
    token,
  });
});

const login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  // 1. check email and password is present
  if (!email || !password)
    return next(new AppError("Please provide email and password.", 400));

  // 2. check if creadentials are correct
  let user = await User.findOne({ email }).select("+password");
  if (!user || !(await user.comparePasswords(password, user.password)))
    return next(new AppError("Invalid credentials.", 400));

  // 3. create token
  const token = signToken(user._id);
  user.password = undefined;

  // 4. send response with token
  res.status(200).json({
    status: "success",
    token,
    user,
  });
});

const protect = catchAsync(async (req, res, next) => {
  let token;
  // 1. check if token available
  if (req.headers.authorization?.startsWith("Bearer")) {
    token = req.headers.authorization.split(" ")[1];
  }
  if (!token)
    return next(new AppError("You are not logged in. Please login to get access.", 400));

  // 2. token verification
  const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
  if (!decoded) return next(new AppError("Invalid token or token has been expired", 400));

  // 3. chekc user still exists in database
  const freshUser = await User.findById(decoded.id);
  if (!freshUser)
    return next(new AppError("User belonging to this token does no longer exists.", 400));

  // 4. check if user has changed password after token was assigned
  if (freshUser.changedPasswordAfter(decoded.iat))
    return next(new AppError("User recently changed password. Please login again.", 400));

  // grant access to user
  req.user = freshUser;
  next();
});

const restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role))
      return next(
        new AppError("You do not have permission to access this resource.", 400)
      );
    next();
  };
};

export { signUp, login, protect, restrictTo };
