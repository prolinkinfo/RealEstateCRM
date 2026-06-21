const express = require("express");
const paymentRecord = require("./paymentRecord");
const auth = require("../../middelwares/auth");

const router = express.Router();

router.get("/", auth, paymentRecord.index);
router.post("/add", auth, paymentRecord.add);
router.get("/view/:id", auth, paymentRecord.view);
router.put("/edit/:id", auth, paymentRecord.edit);
router.delete("/delete/:id", auth, paymentRecord.deleteData);
router.post("/deleteMany", auth, paymentRecord.deleteMany);

module.exports = router;
