import { Request, Response } from "express";
import { CreateAuthorInput, UpdateAuthorInput } from "../types/authorTypes";
import * as authorService from "../services/authorService";
import {
  createAuthorSchema,
  updateAuthorSchema,
} from "../validators/authorValidators";
import jwt from "jsonwebtoken";
export const createAuthor = async (req: Request, res: Response) => {
  try {
    const data: CreateAuthorInput = req.body;
    const { error } = createAuthorSchema.validate(data);
    if (error) {
      return res
        .status(400)
        .json({ success: false, message: error.details[0].message });
    }
    if (req.file) {
      data.profile = req.file.filename;
      console.log(data.profile);
    }
    const author = await authorService.createAuthor(data, true);
    res.status(201).json({
      success: true,
      message: "Author created successfully",
      author,
    });
  } catch (error: unknown) {
    const err = error as Error;
    res
      .status(500)
      .json({ success: false, message: err.message || "Server error", error });
  }
};

export const loginAuthor = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res
        .status(400)
        .json({ success: false, message: "Email and password are required" });
    }

    const user = await authorService.loginAuthor(email, password);
    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid email or password" });
    }

    const token = jwt.sign(
      { id: user.id, role: user.role, email: user.email },
      process.env.JWT_SECRET!,
      { expiresIn: "15s" }
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

export const getAuthor = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const author = await authorService.getAuthor(id);
    if (!author) {
      res.status(404).json({ success: false, message: "Author not found" });
    }
    res.json({ success: true, author });
  } catch (error: unknown) {
    const err = error as Error;
    res
      .status(500)
      .json({ success: false, message: err.message || "Server error", error });
  }
};
export const updateAuthor = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const data: UpdateAuthorInput = req.body;
    const { error } = updateAuthorSchema.validate(data);
    if (error) {
      return res
        .status(400)
        .json({ success: false, message: error.details[0].message });
    }
    if (req.file) {
      data.profile = req.file.filename;
    }

    const author = await authorService.updateAuthor(id, data);
    if (!author)
      return res
        .status(404)
        .json({ success: false, message: "Author not found" });
    res.json({ success: true, author });
  } catch (error: unknown) {
    const err = error as Error;
    res
      .status(500)
      .json({ success: false, message: err.message || "Server error", error });
  }
};

export const deleteAuthor = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const deleted = await authorService.deleteAuthor(id);
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
