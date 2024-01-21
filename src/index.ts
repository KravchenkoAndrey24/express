import express from "express";

const app = express();
const port = process.env.PORT || 3000;

app.use(express.static("public/index.html"));

app.get("/", (req, res) => {
  res.json("Hello world!!!");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
