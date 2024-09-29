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

const { b } = require("./src/returnFormat.js");
console.log('当前运行环境:',process.env.PORT, process.env.FLS_PATH);
const regex = /\/fls2\/project(\/.*)/;
const { resultMiddleware } = require("./src/middleware/resultMiddleware.js");
const staticPath = path.join(__dirname, "dist");
// 接口路径.
const port = process.env.PORT || 8888;
// I:\tyjk\fls\common\map\oht_map.fls
// const flsPath = process.env.FLS_PATH || "I:/tyjk/fls";
const flsPath = process.env.FLS_PATH || "I:/Code/FLS_Web/Web2/fls";
// const flsPath = process.env.FLS_PATH || "D:/chenjing/Web2/fls";
// 静态资源服务器
app.use(express.static("public"));
// 将静态文件目录作为中间件路由
app.use("/fls2", express.static(staticPath));

// 配置 historyApiFallback 选项
app.use(
  express.static(staticPath, {
    index: "index.html",
    setHeaders: (res, path) => {
      if (path.endsWith("index.html")) {
        res.setHeader("Cache-Control", "no-cache");
      }
    },
  })
);
app.use(cookieParser());
app.use(express.json());
app.use(resultMiddleware);



app.all("/fls2/project/*.fls", (req, res) => {
  const flsFile = req.path.match(regex)[1]; // 获取请求的文件名
  const db = new dbs.dbclient();
  const c = req.cookies; // 获取cookie
  const g = req.query; // 获取get参数
  const filePath = path.join(flsPath, flsFile); // 组合文件路径
  const fileData = readcache(filePath, "utf8");
  const mode = req.body.mode;
  const error = dbs.error;
  const sandbox = { db, error };
  vm.runInNewContext(fileData, sandbox);
  const result = sandbox[mode]({ code: 0, msg: "success" }, req.body, g, c);
  res.json(result);
});
// app.use("/", indexRouter);
app.use("/user", userRouter);
app.use("/module", (req, res) => {
  res.json({ msg: "模块管理交互请切换到fls.exe调试模式" });
});
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
