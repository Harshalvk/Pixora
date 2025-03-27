import express from "express";
import dotenv from "dotenv";
dotenv.config();
import userRouter from "./routes/user.route.js";

const app = express();
const PORT = 5050;

app.use(express.json());

app.use("/v1/user", userRouter);
// app.use("/v1/worker", workerRouter)

app.get("/health", (req, res) => {
  res.send("Server health is OK!");
});

app.listen(PORT, () => {
  console.log(`🔴Server is listening on port ${PORT}`);
});
