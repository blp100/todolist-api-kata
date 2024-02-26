import http from "http";
import { v4 as uuidv4 } from "uuid";
import { PORT, HEADERS } from "./constants.js";

const todos = [{ title: "Programming Day!", id: uuidv4() }];

const server = http.createServer((req, res) => {
  const { url, method } = req;

  let body = "";
  req.on("data", (chunk) => {
    body += chunk;
  });

  if (url === "/todos" && method === "GET") {
    res.writeHead(200, HEADERS);
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
          todos.push({ title: title, id: uuidv4() });
          res.writeHead(200, HEADERS);
          res.write(
            JSON.stringify({
              status: "success",
              data: todos,
            })
          );
          res.end();
        } else {
          res.writeHead(400, HEADERS);
          res.write(
            JSON.stringify({
              status: "failed",
              data: "Column not recognized",
            })
          );
          res.end();
        }
      } catch (er) {
        // uh oh! bad json!
        res.writeHead(400, HEADERS);
        res.write(
          JSON.stringify({
            status: "failed",
            message: er.message,
          })
        );
        res.end();
      }
    });
  } else if (method === "OPTIONS") {
    res.writeHead(200, HEADERS);
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

// - POST: add a to-do
// - DELETE: delete a todo
// - PATCH: edit todo
// - push on github
// - deploy to render
// - test on postman
