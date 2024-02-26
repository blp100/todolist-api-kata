import http from "http";
import { PORT } from "./constants.js";

const server = http.createServer((req, res) => {
  res.writeHead(200, { "Content-Type": "text/plain" });
  res.write("Hello");
  res.end();
});

server.listen(PORT);

// - Create Server
// - Deal with 404
// - OPTIONS: Setting up CORS - Preflight Options API
// - GET: to-do lists
// - POST: add a to-do
// - DELETE: delete a todo
// - PATCH: edit todo
// - push on github
// - deploy to render
// - test on postman
