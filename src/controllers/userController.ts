import { Request, Response } from "express";
import * as userService from "../services/userService";
import { updateUserInput } from "../types/userType";
import { updateUserSchema } from "../validations/userValidation";

export const getUserController = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const user = await userService.getUserService(id);
    if (!user) {
      res.status(404).json({ success: false, message: "Author not found" });
    }
    res.json({ success: true, user });
  } catch (error: unknown) {
    const err = error as Error;
    res
      .status(500)
      .json({ success: false, message: err.message || "Server error", error });
  }
};
export const updateUserController = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    if (!req.user || req.user.id !== id) {
      return res.status(403).json({ success: false, message: "Forbidden" });
    }
    const data: updateUserInput = req.body;
    const { error } = updateUserSchema.validate(data);
    if (error) {
      return res
        .status(400)
        .json({ success: false, message: error.details[0].message });
    }
    if (req.file) {
      data.profile = req.file.filename;
    }

    const user = await userService.updateUserService(id, data);
    if (!user)
      return res
        .status(404)
        .json({ success: false, message: "Author not found" });
    res.json({ success: true, user });
} catch (error: unknown) {
    const err = error as Error;
    res
      .status(500)
      .json({ success: false, message: err.message || "Server error", error });
  }
};

export const deleteUserController = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    if (!req.user || req.user.id !== id) {
      return res.status(403).json({ success: false, message: "Forbidden" });
    }
    const deleted = await userService.deleteUserService(id);
    if (!deleted)
      return res
        .status(404)
        .json({ success: false, message: "Author not Found" });
    res.json({ success: true, message: "Author deleted successfully" });
  } catch (error: unknown) {
    const err = error as Error;
    res
      .status(500)
      .json({ success: false, message: err.message || "Server error", error });
  }
};

export const upgradeRoleController = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id; 
    if (!userId) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    const upgradedUser = await userService.upgradeUserService(userId);

    res.json({ success: true, user: upgradedUser });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};