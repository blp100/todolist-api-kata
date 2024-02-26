import http from "http";
import { v4 as uuidv4 } from "uuid";
import errorHandler from "./errorHandler.js";
//Server Settings
const port = 3005;

//Data
const todos = [{ title: "Programming Day!", id: uuidv4() }];

const server = http.createServer((req, res) => {
  const headers = {
    "Access-Control-Allow-Headers":
      "Content-Type, Authorization, Content-Length, X-Requested-With",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "PATCH, POST, GET, OPTIONS, DELETE",
    "Content-Type": "application/json",
  };
  const { url, method } = req;
  let body = "";
  req.on("data", (chunk) => {
    body += chunk;
  });

  if (url === "/todos" && method === "GET") {
    res.writeHead(200, headers);
    res.write(
      JSON.stringify({
        status: "success",
        data: todos,
      })
    );
    res.end();
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
          res.writeHead(200, headers);
          res.write(
            JSON.stringify({
              status: "success",
              data: todos,
            })
          );
        } else {
          errorHandler(res, "Column not recognized");
        }
        res.end();
      } catch (er) {
        // uh oh! bad json!
        errorHandler(res, er.message);
      }
    });
  } else if (url === "/todos" && method === "DELETE") {
    todos.length = 0;
    res.writeHead(200, headers);
    res.write(
      JSON.stringify({
        status: "success",
        data: todos,
      })
    );
    res.end();
  } else if (url.startsWith("/todos/") && method === "DELETE") {
    const todoId = url.split("/").pop();
    const indexOfTodoId = todos.findIndex((element) => element.id === todoId);

    if (indexOfTodoId !== -1) {
      todos.splice(indexOfTodoId, 1);
      res.writeHead(200, headers);
      res.write(
        JSON.stringify({
          status: "success",
          data: todos,
        })
      );
      res.end();
    } else {
      errorHandler(res, "ID not recognized or not found");
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
          res.writeHead(200, headers);
          res.write(
            JSON.stringify({
              status: "success",
              data: todos,
            })
          );
        } else {
          errorHandler(res, "ID not recognized or not found");
        }
        res.end();
      } catch (er) {
        // uh oh! bad json!
        errorHandler(res, er.message);
      }
    });
  } else if (method === "OPTIONS") {
    res.writeHead(200, headers);
    res.end();
  } else {
    res.writeHead(404, headers);
    res.write(
      JSON.stringify({
        status: "failed",
        message: "No router instance found",
      })
    );
    res.end();
  }
});
server.listen(port);