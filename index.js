const express = require("express");
const app = express();


const port = 8000;
app.get("/", (req, res) => {
  res.send("Hello, World!");
});
app.get("/users", (req, res) => {
  res.send("This is the Users page");
});
app.get("/about", (req, res) => {
  res.send("This is the About page");
});
app.get("/users/:id", (req, res) => {
  const userId = req.params.id;
  res.send(`User ID: ${userId}`);
});
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});