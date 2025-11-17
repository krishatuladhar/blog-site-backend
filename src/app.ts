import express, { urlencoded } from "express";
import path from "path";

import router from "./routes";

const app = express();

app.use(express.static(path.join(__dirname,"uploads")));
app.use(express.json());
app.use(express.urlencoded());

app.use("/api", router);

export default app;
