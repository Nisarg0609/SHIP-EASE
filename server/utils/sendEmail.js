import nodemailer from "nodemailer";
import User from "../models/user.model.js";
import AppError from "./AppError.js";

// Configure nodemailer transporter

const transporter = nodemailer.createTransport({
  host: "smtp.ethereal.email",
  port: 587,
  auth: {
    user: "ludwig.dibbert@ethereal.email",
    pass: "efWmv3c4NbtGVma1Sd",
    // user : process.env.EMAIL_USER,
    // pass : process.env.EMAIL_PASS
  },
});

export async function sendEmail(userId, otp) {
  let testAccount = await nodemailer.createTestAccount();
  try {
    const user = await User.findById(userId).select("email name role");
    if (!user) {
      throw new Error("Delivery station manager not found", 404);
    }

    // Define email options
    const mailOptions = {
      from: "Nisarg Patel",
      to: user.email,
      subject: "OTP for Delivery Confirmation",
      text: `Hello ${user.name},\n\nYour OTP for confirming delivery to the station is: ${otp} (Only Valid for 10 minutes.) \nPlease use this OTP to verify the delivery.\n\nThank you.`,
    };

    // Send email
    const info = await transporter.sendMail(mailOptions);
    return info;
  } catch (error) {
    throw new Error(error, 500);
  }
}
