const express = require("express");
const owner = require("./owner");
const auth = require("../../middelwares/auth");

const router = express.Router();

router.get("/", auth, owner.index);
router.post("/add", auth, owner.add);
router.get("/view/:id", auth, owner.view);
router.put("/edit/:id", auth, owner.edit);
router.delete("/delete/:id", auth, owner.deleteData);
router.post("/deleteMany", auth, owner.deleteMany);

module.exports = router;
