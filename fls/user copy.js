const dbs = require("./src/pg-db.js");

function main(mode, b, p, g, c) {
  let bfn = eval(`typeof ${mode}==='function'`);
  if (bfn) {
    return eval(`${mode}(b,p,g,c)`);
  } else {
    return dbs.error(b, 404, "接口不存在");
  }
}
//
function login(b, p) {
  if (!Object.prototype.hasOwnProperty.call(p, "name")) {
    return dbs.error(b, -1, "用户名不存在");
  }
  if (!Object.prototype.hasOwnProperty.call(p, "password")) {
    return dbs.error(b, -1, "密码不存在");
  }
  let sql1 = `SELECT * FROM public.system_user WHERE user_login='${p.name}'`;
  let db = new dbs.dbclient();
  if (!db.exec(sql1)) {
    return dbs.error(b, 100, db.lastErrorText());
  }
  if (!db.next()) {
    return dbs.error(b, -2, "用户名不存在");
  }
  const user_name = db.value("user_name");
  const user_pass2 = db.value("user_password");
  const user_role = db.value("user_role");
  if (user_pass2.length <= 0) {
    return dbs.error(b, p.password.length <= 0 ? 1 : -4, "密码错误");
  }
  const sha1 = require("sha1");
  const user_pass1 = sha1(p.password);
  if (user_pass1 != user_pass2) {
    return dbs.error(b, -5, "密码错误");
  }
  const { v4: uuidv4 } = require("uuid");
  let key = uuidv4();
  let sql2 = `UPDATE public.system_user SET user_lastdate=now(),user_key='${key}' WHERE user_login='${p.name}'`;
  if (!db.exec(sql2)) {
    return dbs.error(b, 100, db.lastErrorText());
  }
  b.name = user_name;
  b.key = key;
  b.role = user_role;
  return b;
}
module.exports = { main, login };
