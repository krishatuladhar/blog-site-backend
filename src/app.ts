import express, { urlencoded } from "express";
import cors from "cors";
import path from "path";

import router from "./routes";

const app = express();
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
console.log("CWD:", process.cwd());
console.log("Uploads absolute path:", path.join(process.cwd(), "uploads"));
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use("/api", router);

export default app;
