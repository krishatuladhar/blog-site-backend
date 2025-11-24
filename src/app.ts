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
app.use(express.static(path.join(__dirname, "uploads")));
app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use("/api", router);

export default app;
