const express = require("express");
const rentalUnit = require("./rentalUnit");
const auth = require("../../middelwares/auth");

const router = express.Router();

router.get("/", auth, rentalUnit.index);
router.get("/availability", auth, rentalUnit.availability);
router.post("/add", auth, rentalUnit.add);
router.get("/view/:id", auth, rentalUnit.view);
router.put("/edit/:id", auth, rentalUnit.edit);
router.delete("/delete/:id", auth, rentalUnit.deleteData);
router.post("/deleteMany", auth, rentalUnit.deleteMany);

module.exports = router;
