import { HEADERS } from "./constants.js";

const successHandler = (res, todoData, corsOption =false) => {
  res.writeHead(200, HEADERS);
  if (!corsOption) {
    res.write(
      JSON.stringify({
        status: "success",
        data: todoData,
      })
    );
  }
  res.end();
};

const errorHandler = (res, resCode, msg = "") => {
  res.writeHead(resCode, HEADERS);
  res.write(
    JSON.stringify({
      status: "failed",
      message: msg,
    })
  );
  res.end();
};

export { errorHandler, successHandler };
