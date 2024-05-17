const express = require("express");
const router = express.Router();

router.use(function timeLog(req, res, next) {
  console.log("Time: ", Date.now());
  next();
});
router.get("/a", function (req, res) {
  res.json({ name: 1 });
});
router.post("/a", function (req, res) {
  res.json({ name: 2 });
});

module.exports = router;
