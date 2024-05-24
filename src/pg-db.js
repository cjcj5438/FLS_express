const { Pool } = require("pg");
var deasync = require("deasync");

const db = new Pool({
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

class dbclient {
  constructor() {
    this.data = [];
    this.data_i = -1;
    this.sql = "";
    this.lasterror = "";
  }
  exec(sql) {
    //console.log('SQL:',sql);
    this.data_i = -1;
    let bok = 0;
    db.query(sql, (err, res) => {
      this.sql = sql;
      console.log("正确SQL:", sql);
      if (err) {
        console.log("错误SQL:", sql);
        bok = 1;
        this.lasterror = err.message;
        return;
      }
      this.data = res.rows;
      bok = 2;
    });
    while (bok <= 0) {
      deasync.runLoopOnce();
    }
    return bok == 2;
  }
  next() {
    if (!this.data) {
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
    // if (Object.prototype.toString.call(d) === "[object Object]") {
    //   console.log(d);
    // }
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
