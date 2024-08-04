import express from "express";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/time", (req, res) => {
  const time = new Date().toLocaleTimeString();
  res.send(`<div>Clicked @ ${time}</div>`);
});

app.get("/loading", async (req, res) => {
  await sleep(1000);
  const time = new Date().toLocaleTimeString();
  res.send(`<div>Clicked @ ${time}</div>`);
});

app.post("/form", (req, res) => {
  const input = req.body?.input ?? "";
  const time = new Date().toLocaleTimeString();
  res.send(`<div>Received "${input}" @ ${time}</div>`);
});

// Running app
const PORT = process.env.PORT || 3003;
app.listen(PORT, async () => {
  console.log(`Listening on port ${PORT}`);
  console.log(`http://localhost:${PORT}`);
});

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
