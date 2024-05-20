const express = require("express");
const sha1 = require("sha1");
const router = express.Router();
const { dbclient, error } = require("../src/pg-db.js");
const { v4: uuidv4 } = require("uuid");

router.use(function timeLog(req, res, next) {
  console.log("Time: ", Date.now());
  next();
});

router.post("/module", async function (req, res) {
  console.log(req);
});

module.exports = router;
function main(mode, b, p, g, c) {
  let bfn = eval(`typeof ${mode}==='function'`);
  if (bfn) {
    return eval(`${mode}(b,p,g,c)`);
  } else {
    return dbs.error(b, 404, "接口不存在");
  }
}

function params(b, p) {
  if (!Object.prototype.hasOwnProperty.call(p, "params")) {
    return dbs.error(b, -1, "查询参数不存在");
  }
  let ps = "";
  if (typeof p.params == "string") {
    ps = p.params;
  } else {
    ps = p.params.join("','");
  }
  const sql = `SELECT key,value FROM system_config WHERE key IN ('${ps}')`;
  let db = new dbs.dbclient();
  if (!db.exec(sql)) {
    return dbs.error(b, 100, db.lastErrorText());
  }
  b.data = {};
  while (db.next()) {
    b.data[db.value("key")] = db.value("value");
  }
  return b;
}

function save(b, p) {
  if (!Object.prototype.hasOwnProperty.call(p, "params")) {
    return dbs.error(b, -1, "查询参数不存在");
  }
  let ps = [];
  for (let k in p.params) {
    ps.push(`(${k},${p.params[k]})`);
  }
  const sql =
    "INSERT INTO system_config(key,value) VALUES " +
    ps.join(",") +
    ' ON conflict(key) DO UPDATE SET value=excluded.value");';
  let db = new dbs.dbclient();
  if (!db.exec(sql)) {
    return dbs.error(b, 100, db.lastErrorText());
  }
  return b;
}
