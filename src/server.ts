import app from "./app";
import "dotenv/config";
import "./config/db";

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`App is running on ${PORT} `);
});
