import { Request, Response } from "express";
import { registerUserInput } from "../types/userType";
import * as authService from "../services/authService";
import {
  createUserSchema,
  updateUserSchema,
} from "../validations/userValidation";
import jwt from "jsonwebtoken";
export const createUserController = async (req: Request, res: Response) => {
  try {
    const data: registerUserInput = req.body;
    const { error } = createUserSchema.validate(data);
    if (error) {
      return res
        .status(400)
        .json({ success: false, message: error.details[0].message });
    }
    if (req.file) {
      data.profile = req.file.filename;
      console.log(data.profile);
    }
    const user = await authService.registerUserService(data, true);
    res.status(201).json({
      success: true,
      message: "Author created successfully",
      user,
    });
  } catch (error: unknown) {
    const err = error as Error;
    res
      .status(500)
      .json({ success: false, message: err.message || "Server error", error });
  }
};

export const loginUserController = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res
        .status(400)
        .json({ success: false, message: "Email and password are required" });
    }

    const user = await authService.loginUserService(email, password);
    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid email or password" });
    }

    const token = jwt.sign(
      { id: user.id, role: user.role, email: user.email },
      process.env.JWT_SECRET!,
      { expiresIn: "15m" }
    );

    res.json({
      success: true,
      message: "Login successful",
      user,
      token,
    });
  } catch (error: unknown) {
    const err = error as Error;
    res
      .status(500)
      .json({ success: false, message: err.message || "Server error", error });
  }
};
