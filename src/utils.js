const path = require("path");
const fs = require("fs");

var fcache = {};
function readcache(fliepath, opt) {
  const mtime = fs.statSync(fliepath).mtime;
  const bcache = fcache.hasOwnProperty(fliepath);
  if (!bcache || fcache[fliepath].mtime - mtime != 0) {
    if (!bcache) {
      fcache[fliepath] = {};
    }
    if (opt == null) {
      fcache[fliepath].data = fs.readFileSync(fliepath);
    } else {
      fcache[fliepath].data = fs.readFileSync(fliepath, opt);
    }
    fcache[fliepath].mtime = mtime;

    console.log(`加载文件:${fliepath}`);
  }
  return fcache[fliepath].data;
}
/**
 *
 * @param {URL} f 文件路径
 * @param {res} b 请求体
 * @param {res} p 响应体
 * @param {*} g
 * @param {*} c cookie
 * @returns
 */

function flsjs(f, b, p, g, c) {
  try {
    const data = readcache(f, "utf8");
    let mode = "mainfun";
    if (Object.prototype.hasOwnProperty.call(p, "mode")) {
      mode = p.mode;
    }
    //   else if (Object.prototype.hasOwnProperty.call(g, "mode")) {
    //     mode = g.mode;
    //   }
    let db = new dbs.dbclient();
    let error = dbs.error;
    let fls = new flss.flsClient(db);
    let task2add = function (b, j) {
      fls.task2add(j);
      return b;
    };
    const sandbox = { db, fls, error };
    vm.runInNewContext(data, sandbox);

    b = sandbox[mode](b, p, g, c);
    return b;
  } catch (err) {
    console.error(err);
    return dbs.error(b, 502, "内部错误");
  }
}
module.exports = {
  flsjs,
  readcache,
};
