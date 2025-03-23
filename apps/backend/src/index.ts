import express from "express";

const app = express();
const PORT = 5050;

app.get("/health", (req, res) => {
  res.send("Server health is OK!");
});

app.listen(PORT, () => {
  console.log(`🔴Server is listening on port ${PORT}`);
});
