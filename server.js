import http from "http";
import { v4 as uuidv4 } from "uuid";
import { errorHandler, successHandler } from "./handler.js";
//Server Settings
const port = 3005;

//Data
const todos = [{ title: "Programming a day! Keep an apple away.", id: uuidv4() }];

const server = http.createServer((req, res) => {
  const { url, method } = req;
  let body = "";
  req.on("data", (chunk) => {
    body += chunk;
  });

  if (url === "/todos" && method === "GET") {
    successHandler(res, todos);
  } else if (url === "/todos" && method === "POST") {
    req.on("end", () => {
      try {
        const data = JSON.parse(body);
        const title = data.title;
        if (title !== undefined) {
          const todo = {
            title: title,
            id: uuidv4(),
          };
          todos.push(todo);
          // Write back something interesting to the user:
          successHandler(res, todos);
        } else {
          errorHandler(res, 400, "Column not recognized");
        }
        res.end();
      } catch (er) {
        // uh oh! bad json!
        errorHandler(res, 400, er.message);
      }
    });
  } else if (url === "/todos" && method === "DELETE") {
    todos.length = 0;
    successHandler(res, todos);
  } else if (url.startsWith("/todos/") && method === "DELETE") {
    const todoId = url.split("/").pop();
    const indexOfTodoId = todos.findIndex((element) => element.id === todoId);

    if (indexOfTodoId !== -1) {
      todos.splice(indexOfTodoId, 1);
      successHandler(res, todos);
    } else {
      errorHandler(res, 400, "ID not recognized or not found");
    }
  } else if (url.startsWith("/todos/") && method === "PATCH") {
    const todoId = url.split("/").pop();
    const indexOfTodoId = todos.findIndex((element) => element.id === todoId);

    req.on("end", () => {
      try {
        const data = JSON.parse(body);
        const title = data.title;
        if (title !== undefined && indexOfTodoId !== -1) {
          todos[indexOfTodoId].title = title;
          // Write back something interesting to the user:
          successHandler(res, todos);
        } else {
          errorHandler(res, 400, "ID not recognized or not found");
        }
      } catch (er) {
        // uh oh! bad json!
        errorHandler(res, 400, er.message);
      }
    });
  } else if (method === "OPTIONS") {
    successHandler(res, todos, true);
  } else {
    errorHandler(res, 404, "No router instance found");
  }
});
server.listen(port);
