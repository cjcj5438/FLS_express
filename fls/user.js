const express = require("express");
const sha1 = require("sha1");
const router = express.Router();
const { dbclient, error } = require("../src/pg-db.js");
const { v4: uuidv4 } = require("uuid");
const db = new dbclient();
const b = {};
router.use(function timeLog(req, res, next) {
  console.log("Time: ", Date.now());
  next();
});

router.post("/login", function (req, res) {
  const p = req.body;
  if (!Object.prototype.hasOwnProperty.call(p, "name")) {
    return error(b, -1, "用户名不存在");
  }
  if (!Object.prototype.hasOwnProperty.call(p, "password")) {
    return derror(b, -1, "密码不存在");
  }
  let sql1 = `SELECT * FROM public.system_user WHERE user_login='${p.name}'`;
  if (!db.exec(sql1)) {
    return error(b, 100, db.lastErrorText());
  }
  if (!db.next()) {
    return res.json(error(b, -2, "用户名不存在"));
  }
  const user_name = db.value("user_name");
  const user_pass2 = db.value("user_password");
  const user_role = db.value("user_role");
  if (user_pass2.length <= 0) {
    return res.json(error(b, p.password.length <= 0 ? 1 : -4, "密码错误"));
  }

  const user_pass1 = sha1(p.password);
  if (user_pass1 != user_pass2) {
    return error(b, -5, "密码错误");
  }

  let key = uuidv4();
  let sql2 = `UPDATE public.system_user SET user_lastdate=now(),user_key='${key}' WHERE user_login='${p.name}'`;
  if (!db.exec(sql2)) {
    return res.json(error(b, 100, db.lastErrorText()));
  }

  return res.json({
    name: user_name,
    key: key,
    role: user_role,
  });
});

module.exports = router;
