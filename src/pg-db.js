var async = require("async");
const initOptions = {
  // 对响应的数据格式做一些处理
  //receive(e) {
  //     camelizeColumns(e.data);
  // }
};
const pgp = require("pg-promise")();
const db = pgp({
  host: "127.0.0.1",
  port: 5432,
  password: "Zvision2016",
  database: "mydatabase",
  user: "postgres",
  max: 30, // use up to 30 connections
});
const b = { code: 0, message: "成功" };
function error(b, code, msg) {
  b.code = code;
  b.message = msg;
  return b;
}

const createDbClient = () => {
  let data = [];
  let sql = "";
  let lasterror = "";
  let data_i = -1;

  const exec = async (sqlQuery) => {
    try {
      data_i = -1;
      sql = sqlQuery;
      data = await db.any(sqlQuery);
      console.log(data);
      return true;
    } catch (err) {
      lasterror = err.message;
      console.log("SQL:", sqlQuery);
      return false;
    }
  };

  const next = () => {
    if (!data) {
      return false;
    }
    ++data_i;
    return data_i < data.length;
  };

  const value = (id) => {
    let d = {};
    if (typeof id === "number") {
      let d1 = Object.values(data[data_i]);
      if (d1.length > 0) {
        d = d1[id];
      }
    } else {
      d = data[data_i][id.toLowerCase()];
    }
    if (typeof d === "object") {
      if (Array.isArray(d)) {
        d = `{${d.join(",")}}`;
      }
    }
    return d;
  };
  const getData = () => {
    return data;
  };
  const lastErrorText = () => {
    return lasterror;
  };

  const driverName = () => {
    return "QPSQL";
  };

  const db_date = () => {
    return "now()";
  };

  return {
    exec,
    next,
    value,
    getData,
    lastErrorText,
    driverName,
    db_date,
  };
};
module.exports = {
  dbclient: createDbClient(),
  db,
  error,
};
