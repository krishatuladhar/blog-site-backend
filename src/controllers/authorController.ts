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
    console.log(req.body);
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
    const author = await authorService.createAuthor(data);
    console.log(author);
    res.status(201).json({
      success: true,
      message: "Author created successfully",
      author,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error });
    console.log(error);
  }
};

export const loginAuthor = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    console.log(req.body);
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

    if (!process.env.JWT_SECRET) {
      throw new Error("JWT_SECRET is not defined in environment");
    }

    const token = jwt.sign(
      { id: user.id, role: user.role, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({
      success: true,
      message: "Login successful",
      user,
      token,
    });
  } catch (error: any) {
    console.log(error);
    res.status(500).json({ success: false, message: "Server error", error });
    console.log(error);
  }
};

export const getAuthor = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    console.log(id);
    const author = await authorService.getAuthor(id);
    if (!author) {
      res.status(404).json({ success: false, message: "Author not found" });
    }
    res.json({ success: true, author });
    console.log(author);
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error });
    console.log(error);
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
      console.log(data.profile);
    }

    const author = await authorService.updateAuthor(id, data);
    console.log(author + "hey");
    if (!author)
      return res
        .status(404)
        .json({ success: false, message: "Author not found" });
    res.json({ success: true, author });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error", error });
    console.log(error);
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
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error });
  }
};
