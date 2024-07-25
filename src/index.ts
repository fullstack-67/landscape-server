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

app.get("/", async (req, res) => {
  const todos = await getTodos();
  res.render("pages/index", { todos: todos, mode: "ADD", message: "" });
});

app.post("/create", async (req, res) => {
  const todoText = req.body?.todoText ?? "";
  // let error = "";
  // if (!todoText) {
  //   error = "Empty text";
  // } else {
  //   const id = new Date().getTime().toString();
  //   todos.push({ id, todoText: `${todoText}` });
  // }
  // res.setHeader("HX-Trigger", "refetchtodo");
  // res.render("inputform", { error: error });

  const mode = "ADD";
  try {
    await createTodos(todoText);
    const todos = await getTodos();
    res.render("components/wrapperFormList", { todos, mode, message: "" });
  } catch (err) {
    const todos = await getTodos();
    res.render(`components/wrapperFormList`, { todos, mode, message: err });
  }
});

app.post("/deletetodo", (req, res, next) => {
  console.log(req.body);

  const id = req.body.id;
  if (!id) {
    res.send("Not OK");
    next();
  }

  todos = todos.filter((el: any) => el.id !== id);
  res.setHeader("HX-Trigger", "refetchtodo");
  res.send("OK");
});

app.get("/todolist", (req, res) => {
  res.render("todolist", { todos: todos });
});

// Running app
const PORT = process.env.PORT || 3002;
app.listen(PORT, async () => {
  console.log(`Listening on port ${PORT}`);
  console.log(`http://localhost:${PORT}`);
});
