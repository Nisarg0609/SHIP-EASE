import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "User name is required"],
      trim: true,
      minlength: [2, "Name must be at least 2 characters long"],
      maxlength: [50, "Name cannot exceed 50 characters"],
      match: [/^[A-Za-z\s]+$/, "Name should only contain letters"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      trim: true,
      lowercase: true,
      validate: [validator.isEmail, "Please enter a valid email address"],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters long"],
      match: [
        /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/,
        "Password must contain at least one uppercase letter, one digit, one special character, and be at least 6 characters long",
      ],
      select: false,
    },
    passwordConfirm: {
      type: String,
      required: [true, "Please Confirm your password"],
      validate: {
        validator: function (val) {
          return val === this.password;
        },
        message: "Password do not match",
      },
    },
    role: {
      type: String,
      required: [true, "Role is required"],
      enum: {
        values: [
          "admin",
          "warehouseManager",
          "deliveryStationManager",
          "warehouseDriver",
          "deliveryStationDriver",
          "customer",
        ],
        message: "Role `{VALUE}` is not a valid role",
      },
      default: "customer",
    },
    dateOfBirth: {
      type: Date,
      required: [true, "Date of Birth is required"],
      validate: [
        {
          validator: function (value) {
            const today = new Date();
            const age = today.getFullYear() - value.getFullYear();
            const monthDiff = today.getMonth() - value.getMonth();
            const dayDiff = today.getDate() - value.getDate();

            // Calculate exact age considering month and day difference
            const isExactAge = monthDiff > 0 || (monthDiff === 0 && dayDiff >= 0);
            const currentAge = isExactAge ? age : age - 1;

            return currentAge >= 10 && currentAge <= 100;
          },
          message: "Age should be more than 10 years and less than 100 years",
        },
        {
          // Ensure date of birth is in the past
          validator: function (value) {
            const today = new Date();
            return value < today;
          },
          message: "Date of birth must be in the past",
        },
      ],
    },
    gender: {
      type: String,
      required: [true, "Gender is required"],
      enum: {
        values: ["Male", "Female", "Other"],
        message: "Gender `{VALUE}` is not a valid gender",
      },
      set: function (value) {
        if (value === "male") return "Male";
        else if (value === "female") return "Female";
        else if (value === "other") return "Other";
        else return value;
      },
    },
    phone: {
      type: String,
      required: [true, "Phone number is required"],
      trim: true,
      unique: true,
      match: [/^[6-9]\d{9}$/, "Invalid phone number format"],
    },
    address: {
      type: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Address",
        },
      ],
      validate: {
        validator: function (value) {
          return value.length <= 5;
        },
        message: "You can have upto 5 addresses",
      },
    },
    warehouse: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Warehouse",
      required: function () {
        return this.role === "warehouseManager" || this.role === "warehouseDriver";
      },
    },
    deliveryStation: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "DeliveryStation",
      required: function () {
        return (
          this.role === "deliveryStationManager" || this.role === "deliveryStationDriver"
        );
      },
    },
    driverLicenseNumber: {
      type: String,
      required: function () {
        return this.role === "warehouseDriver" || this.role === "deliveryStationDriver";
      },
      match: [/^[A-Z]{2}[0-9]{2}\s[0-9]{11}$/, "Invlid License Number"],
    },
    isDriverAvailable: {
      type: Boolean,
    },
    otp: {
      type: String,
      select: false,
    },
    otpExpiresIn: {
      type: Date,
      select: false,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    passwordChangedAt: Date,
  },
  { timestamps: true }
);

// encrypt password and set passwordConfirm to undefined before save
userSchema.pre("save", async function (next) {
  this.password = await bcrypt.hash(this.password, 12);
  this.passwordConfirm = undefined;
  next();
});

userSchema.pre("save", function (next) {
  if (this.driverLicenseNumber) {
    if (this.warehouse) this.role = "warehouseDriver";
    if (this.deliveryStation) this.role = "deliveryStationDriver";
  } else {
    if (this.warehouse) this.role = "warehouseManager";
    if (this.deliveryStation) this.role = "deliveryStationManager";
  }
  next();
});

userSchema.pre("save", function (next) {
  if (this.driverLicenseNumber) {
    this.isDriverAvailable = true;
  }
  next();
});

// delete password and role from result getting by creating new user.
userSchema.set("toJSON", {
  transform: function (doc, ret) {
    delete ret.password;
    return ret;
  },
});

// compare passwords
userSchema.methods.comparePasswords = async function (candidatePassword, userPassword) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

// check if user has changed password after token was assigned
userSchema.methods.changedPasswordAfter = function (JWTTimestam) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(this.passwordChangedAt.getTime() / 1000, 10);
    return JWTTimestam < changedTimestamp;
  }
  return false;
};

const User = new mongoose.model("User", userSchema);
export default User;
