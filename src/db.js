const { Pool } = require("pg");
var deasync = require("deasync");
const dbconfig = require("./flsweb_lite_config");
console.log(dbconfig);
const db = new Pool(dbconfig);
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
    //console.log('Count:',db.totalCount,db.idleCount);
  }
  exec(sql) {}
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
    if (typeof d === "object") {
      if (Array.isArray(d)) {
        d = `{${d.join(",")}}`;
      } //仿Qt数组返回格式
    }
    //console.log(d,typeof d);
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
