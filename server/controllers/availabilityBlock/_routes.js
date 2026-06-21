const express = require("express");
const availabilityBlock = require("./availabilityBlock");
const auth = require("../../middelwares/auth");

const router = express.Router();

router.get("/", auth, availabilityBlock.index);
router.post("/add", auth, availabilityBlock.add);
router.get("/view/:id", auth, availabilityBlock.view);
router.put("/edit/:id", auth, availabilityBlock.edit);
router.delete("/delete/:id", auth, availabilityBlock.deleteData);
router.post("/deleteMany", auth, availabilityBlock.deleteMany);

module.exports = router;
