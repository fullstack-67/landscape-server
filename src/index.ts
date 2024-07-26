import helmet from "helmet";
import express, { ErrorRequestHandler } from "express";
import morgan from "morgan";
import { getTodos, createTodos, deleteTodo, updateTodo } from "./db";

const app = express();

app.set("view engine", "pug");
const scriptSources = ["'self'", "https://unpkg.com"];
const styleSources = ["'self'", "'unsafe-inline'", "cdn.jsdelivr.net"];
const connectSources = ["'self'"];
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
app.use(morgan("dev"));

// Simulate latency
app.use(function (req, res, next) {
  setTimeout(next, 500);
});

let todos: any = [
  {
    id: new Date().getTime().toString(),
    todoText: "Todo 1",
  },
];

const blankTodo = { id: "", todoText: "" };

app.get("/", async (req, res) => {
  const todos = await getTodos();

  res.render("pages/index", {
    todos: todos,
    mode: "ADD",
    message: "",
    curTodo: blankTodo,
  });
});

app.post("/create", async (req, res) => {
  const todoText = req.body?.todoText ?? "";
  const mode = "ADD";
  try {
    await createTodos(todoText);
    const todos = await getTodos();
    res.render("components/wrapperFormList", {
      todos,
      mode,
      message: "",
      curTodo: blankTodo,
    });
  } catch (err) {
    const todos = await getTodos();
    res.render(`components/wrapperFormList`, {
      todos,
      mode,
      message: err,
      curTodo: blankTodo,
    });
  }

  // * NOTE
  // A more surgical approach would be be trigger only what needs to be updated.
  // res.setHeader("HX-Trigger", "refetchtodo");
  // res.render("inputform", { error: error });
});

app.post("/delete", async (req, res, next) => {
  // console.log(req.body);
  const id = req.body?.curId ?? "";
  const mode = "ADD";
  try {
    await deleteTodo(id);
    const todos = await getTodos();
    res.render("components/wrapperFormList", {
      todos,
      mode,
      message: "",
      curTodo: blankTodo,
    });
  } catch (err) {
    const todos = await getTodos();
    res.render(`components/wrapperFormList`, {
      todos,
      mode,
      message: err,
      curTodo: blankTodo,
    });
  }
});

app.post("/edit", async (req, res) => {
  // console.log(req.body);
  const id = req.body?.curId ?? "";
  try {
    const todos = await getTodos();
    const curTodo = todos.find((el) => el.id === id);
    if (!id || !curTodo) {
      throw new Error("Invalid ID");
    }
    res.render("components/wrapperFormList", {
      todos,
      mode: "EDIT",
      message: "",
      curTodo,
    });
  } catch (err) {
    const todos = await getTodos();
    res.render(`components/wrapperFormList`, {
      todos,
      mode: "ADD",
      message: err,
      curTodo: blankTodo,
    });
  }
});

app.post("/update", async (req, res) => {
  // console.log(req.body);
  const id = req.body?.curId ?? "";
  const todoTextUpdated = req.body?.todoText ?? "";
  try {
    await updateTodo(id, todoTextUpdated);
    const todos = await getTodos();
    res.render("components/wrapperFormList", {
      todos,
      mode: "ADD",
      message: "",
      curTodo: blankTodo,
    });
  } catch (err) {
    const todos = await getTodos();
    let curTodo = todos.find((el) => el.id === id);
    res.render(`components/wrapperFormList`, {
      todos,
      mode: "EDIT",
      message: err,
      curTodo: curTodo ?? blankTodo,
    });
  }
});

app.get("/cancel", async (req, res) => {
  const todos = await getTodos();

  res.render("components/wrapperFormList", {
    todos: todos,
    mode: "ADD",
    message: "",
    curTodo: blankTodo,
  });
});

// Running app
const PORT = process.env.PORT || 3002;
app.listen(PORT, async () => {
  console.log(`Listening on port ${PORT}`);
  console.log(`http://localhost:${PORT}`);
});
