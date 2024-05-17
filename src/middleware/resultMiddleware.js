const resultMiddleware = (req, res, next) => {
  // 保存原始的 res.json 方法
  const originalJson = res.json;

  // 重写 res.json 方法
  res.json = (data, code = 0, msg = "success") => {
    originalJson.call(res, {
      code: code,
      msg: msg,
      ...data,
    });
  };

  next();
};
module.exports = {
  resultMiddleware,
};
