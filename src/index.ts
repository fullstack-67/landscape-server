import helmet from "helmet";
import express, { ErrorRequestHandler } from "express";

const app = express();
app.set("view engine", "pug");

const scriptSources = [
  "'self'",
  "'unsafe-inline'",
  "'unsafe-eval'",
  "http://localhost:35729",
];
const styleSources = ["'self'", "'unsafe-inline'", "cdn.jsdelivr.net"];
const connectSources = ["'self'", "ws://localhost:35729"];
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        scriptSrc: scriptSources,
        scriptSrcElem: scriptSources,
        styleSrc: styleSources,
        connectSrc: connectSources,
      },
      reportOnly: true,
    },
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/", (req, res) => {
  res.render("index", { title: "Todo5", message: "Hello" });
});

// Running app
const PORT = process.env.PORT || 3000;
app.listen(PORT, async () => {
  console.log(`Listening on port ${PORT}`);
});
