const initOptions = {};
const pgp = require("pg-promise")();
const db = pgp({
  host: "127.0.0.1",
  port: 5432,
  password: "Zvision2016",
  database: "mydatabase",
  user: "postgres",
  max: 30, // use up to 30 connections
});
function error(b, code, msg) {
  b.code = code;
  b.message = msg;
  return b;
}
function s(sql) {
  db.any(sql);
}

class dbclient {
  constructor() {
    this.data = [];
    this.sql = "";
    this.lasterror = "";
    this.data_i = -1;
  }
  exec = async (sql) => {
    try {
      this.data_i = -1;
      this.sql = sql;
      this.data = await db.any(sql);
      return true;
    } catch (e) {
      this.lasterror = err.message;
      console.log("SQL:", sql);
      return false;
    }
  };
  next() {
    if (!this.data.length) {
      return false;
    }
    ++this.data_i;
    return this.data_i < this.data.length;
  }
  value(id) {
    let d;
    if (typeof id === "number") {
      let d1 = Object.values(this.data[this.data_i]);
      if (d1.length > 0) {
        d = d1[id];
      }
    } else {
      d = this.data[this.data_i][id.toLowerCase()];
    }
    if (typeof d === "object") {
      if (Array.isArray(d)) {
        d = `{${d.join(",")}}`;
      }
    }
    return d;
  }
  lastErrorText() {
    return this.lasterror;
  }

  driverName() {
    return "QPSQL";
  }
  db_date() {
    return "now()";
  }
}
module.exports = {
  dbclient,
  db,
  error,
};
