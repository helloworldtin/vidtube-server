import app from "./app";
import { PORT } from "./constants";
import connectDB from "./db";

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is listening on http://localhost:${PORT}`);
  });
}).catch((err) => {
  console.log("MongoDB connection failed !!!", err);
});