const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
const path = require("path");
const fs = require("fs");
const vm = require("vm");
const dbs = require("./src/pg-db.js");
const { readcache } = require("./src/utils");
const indexRouter = require("./fls/index");
const userRouter = require("./fls/user");
const port = 80;
const { b } = require("./src/returnFormat.js");
const flsPath = "I:/Code/FLS_Web/Web2/fls";
const regex = /\/fls2\/project(\/.*)/;
const { resultMiddleware } = require("./src/middleware/resultMiddleware.js");

// 静态资源服务器
app.use(express.static("public"));
app.use(cookieParser());
app.use(express.json());
// app.use(resultMiddleware);
app.all("/fls2/project/*.fls", async (req, res) => {
  const flsFile = req.path.match(regex)[1]; // 获取请求的文件名
  const db = dbs.dbclient;
  const c = req.cookies; // 获取cookie
  const g = req.query; // 获取get参数
  const filePath = path.join(flsPath, flsFile); // 组合文件路径
  const fileData = readcache(filePath, "utf8");
  const mode = req.body.mode;
  const error = dbs.error;
  const sandbox = { db, error };
  vm.runInNewContext(fileData, sandbox);
  const result = await sandbox[mode]({}, req.body, g, c);
  await res.json(result);
});
// app.use("/", indexRouter);
app.use("/user", userRouter);
app.use("/module", (req, res) => {
  res.json({ name: "hello world" });
});
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
