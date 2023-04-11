import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";

import User from "../models/user.js";
import Token from "../models/token.js";
import {
  sendEmail,
  requestResetPasswordTemplate,
  resetPasswordSuccessfullyTemplate,
} from "../utils/email/sendEmail.js";

export const signIn = async (req, res) => {
  const { email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });

    // email does not exist
    if (!existingUser)
      return res.status(404).json({ message: "Invalid email or password." });

    const isPasswordCorrect = await bcrypt.compare(
      password,
      existingUser.password
    );

    //incorrect password
    if (!isPasswordCorrect)
      return res.status(400).json({ message: "Invalid email or password." });

    const token = jwt.sign(
      { email: existingUser.email, id: existingUser._id },
      process.env.JWT_SECRET,
      { expiresIn: "2h" }
    );

    res.status(200).json({ result: existingUser, token });
  } catch (err) {
    res.status(500).json({ error: error.message });
  }
};

export const updateProfile = async (req, res) => {
  const { userId } = req.params;
  const { email, firstName, lastName, matricNumber } = req.body;

  const updatedUser = await User.findByIdAndUpdate(
    userId,
    {
      email,
      name: `${firstName} ${lastName}`,
      firstName,
      lastName,
      matricNumber,
    },
    { new: true }
  );
  res.json(updatedUser);
};

export const updateProfileImage = async (req, res) => {
  const { userId } = req.params;
  const { image } = req.body;

  const updatedUser = await User.findByIdAndUpdate(
    userId,
    { image },
    { new: true }
  );
  res.json(updatedUser);
};

export const updatePassword = async (req, res) => {
  const { userId } = req.params;
  const { oldPassword, newPassword, confirmNewPassword } = req.body;

  const user = await User.findById(userId);

  const isPasswordCorrect = await bcrypt.compare(oldPassword, user.password);

  if (!isPasswordCorrect) {
    return res.status(400).json({ message: "Incorrect password." });
  }
  if (newPassword !== confirmNewPassword) {
    return res.status(400).json({ message: "Passwords don't match" });
  }

  const hashedPassword = await bcrypt.hash(newPassword, Number(process.env.BCRYPT_SALT));
  const updatedUser = await User.findByIdAndUpdate(
    userId,
    { password: hashedPassword },
    { new: true }
  );

  res.status(200).json({ updatedUser, message: "Your password has been successfully reset." });
};

export const signUp = async (req, res) => {
  // console.log(req.body);
  const {
    email,
    password,
    confirmPassword,
    firstName,
    lastName,
    matricNumber,
  } = req.body;

  try {
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      // return res.status(404).json({ message: "User already exists" });
      return res
        .status(400)
        .send("User with the provided email already exist.");
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ message: "Passwords don't match" });
    }

    const hashedPassword = await bcrypt.hash(password, Number(process.env.BCRYPT_SALT));

    const newUser = await User.create({
      name: `${firstName} ${lastName}`,
      firstName,
      lastName,
      matricNumber,
      email,
      password: hashedPassword,
    });

    const token = jwt.sign(
      { email: newUser.email, id: newUser._id },
      process.env.JWT_SECRET,
      {
        expiresIn: "2h",
      }
    );

    res.status(201).json({ result: newUser, token });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const requestResetPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      res.status(404).send("No user with that email");
    }

    let token = await Token.findOne({ userId: user._id });
    if (token) await token.deleteOne();

    let resetToken = crypto.randomBytes(32).toString("hex");
    const hash = await bcrypt.hash(resetToken, Number(process.env.BCRYPT_SALT));

    await new Token({
      userId: user._id,
      token: hash,
      createdAt: Date.now(),
    }).save();

    const url = `${process.env.CLIENT_URL}/passwordReset?id=${user._id}&token=${resetToken}`;

    const emailTemplate = requestResetPasswordTemplate(user, url);
    sendEmail(emailTemplate);

    res.json({ message: "A password reset link has been sent to your email." });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const verifyResetPasswordToken = async (req, res) => {
  const { userId, token } = req.body;

  try {
    let passwordResetToken = await Token.findOne({ userId });

    if (!passwordResetToken) {
      return res
        .status(400)
        .json({ message: "Invalid or expired password reset token." });
    }

    const isValid = await bcrypt.compare(token, passwordResetToken.token);

    if (!isValid) {
      return res
        .status(400)
        .json({ message: "Invalid or expired password reset token." });
    }

    await passwordResetToken.deleteOne();
    res.json({ message: "Valid password reset token" });
  } catch (error) {
    res.status(500).json({ error: error.message });
    console.log(error);
  }
};

export const resetPassword = async (req, res) => {
  const { userId, password, confirmPassword } = req.body;
  
  try {
    if (password !== confirmPassword) {
      return res.status(400).json({ message: "Passwords don't match" });
    }

    const hash = await bcrypt.hash(password, Number(process.env.BCRYPT_SALT));

    await User.updateOne(
      { _id: userId },
      { $set: { password: hash } },
      { new: true }
    );

    const updatedUser = await User.findById({ _id: userId });

    const emailTemplate = resetPasswordSuccessfullyTemplate(updatedUser);
    sendEmail(emailTemplate);

    res.json({ updatedUser, message: "Password reset sucessfully." });
  } catch (error) {
    res.status(500).json({ error: error.message });
    console.log(error);
  }
};
