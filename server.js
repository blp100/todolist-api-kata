import http from "http";
import { v4 as uuidv4 } from "uuid";
import { PORT, HEADERS } from "./constants.js";

const todos = [{ title: "Programming Day!", id: uuidv4() }];

const server = http.createServer((req, res) => {
  const { url, method } = req;

  if (url === "/todos" && method === "GET") {
    res.writeHead(200, HEADERS);
    res.write(
      JSON.stringify({
        status: "success",
        message: todos,
      })
    );
    res.end();
  } else {
    res.writeHead(404, HEADERS);
    res.write(
      JSON.stringify({
        status: "failed",
        message: "no router instance found",
      })
    );
    res.end();
  }
});

server.listen(PORT);

// - Deal with 404
// - OPTIONS: Setting up CORS - Preflight Options API
// - GET: to-do lists
// - POST: add a to-do
// - DELETE: delete a todo
// - PATCH: edit todo
// - push on github
// - deploy to render
// - test on postman
