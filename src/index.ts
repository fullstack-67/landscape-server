import helmet from "helmet";
import express, { ErrorRequestHandler } from "express";
import { getTodos, createTodos, deleteTodo } from "./db";

const app = express();
app.set("view engine", "pug");
const scriptSources = [
  "'self'",
  "'unsafe-inline'",
  "'unsafe-eval'",
  // "http://localhost:35729", // Livereload
];
const styleSources = ["'self'", "'unsafe-inline'", "cdn.jsdelivr.net"];
const connectSources = [
  "'self'",
  // "ws://localhost:35729" // Livereload
];
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

app.get("/", async (req, res) => {
  console.log(req.query);
  const message = req.query?.message ?? "";
  const todos = await getTodos();
  res.render("index", { todos: todos, message });
});

app.post("/create", async (req, res) => {
  const todoText = req.body?.todoText ?? "";
  try {
    await createTodos(todoText);
    res.redirect("/");
  } catch (err) {
    res.redirect(`/?message=${err}`);
  }
});

app.post("/delete", async (req, res) => {
  console.log(req.body);
  const id = req.body?.id ?? "";
  try {
    await deleteTodo(id);
    res.redirect("/");
  } catch (err) {
    res.redirect(`/?message=${err}`);
  }
});

// Running app
const PORT = process.env.PORT || 3000;
app.listen(PORT, async () => {
  console.log(`Listening on port ${PORT}`);
});
