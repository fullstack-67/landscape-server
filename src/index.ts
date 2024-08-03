import express from "express";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/text", (req, res) => {
  const time = new Date().toLocaleTimeString();
  res.send(`<div>Clicked @ ${time}</div>`);
});

// Running app
const PORT = process.env.PORT || 3003;
app.listen(PORT, async () => {
  console.log(`Listening on port ${PORT}`);
  console.log(`http://localhost:${PORT}`);
});
