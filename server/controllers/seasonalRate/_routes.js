const express = require("express");
const seasonalRate = require("./seasonalRate");
const auth = require("../../middelwares/auth");

const router = express.Router();

router.get("/", auth, seasonalRate.index);
router.post("/add", auth, seasonalRate.add);
router.get("/view/:id", auth, seasonalRate.view);
router.put("/edit/:id", auth, seasonalRate.edit);
router.delete("/delete/:id", auth, seasonalRate.deleteData);
router.post("/deleteMany", auth, seasonalRate.deleteMany);

module.exports = router;
