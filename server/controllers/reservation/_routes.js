const express = require("express");
const reservation = require("./reservation");
const auth = require("../../middelwares/auth");

const router = express.Router();

router.get("/", auth, reservation.index);
router.get("/availability", auth, reservation.availability);
router.post("/add", auth, reservation.add);
router.get("/view/:id", auth, reservation.view);
router.put("/edit/:id", auth, reservation.edit);
router.delete("/delete/:id", auth, reservation.deleteData);
router.post("/deleteMany", auth, reservation.deleteMany);

module.exports = router;
