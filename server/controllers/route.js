const express = require('express');
const router = express.Router();

const contactRoute = require('./contact/_routes')
const propertyRoute = require('./property/_routes');
const leadRoute = require('./lead/_routes');
const taskRoute = require('./task/_routes');
const reportingRoute = require('./reporting/_routes');
const documentRoute = require('./document/_routes');
const userRoute = require('./user/_routes');

const route = require('./route/_routes');
const emailRoute = require('./emailHistory/_routes');
const phoneCallRoute = require('./phoneCall/_routes');
const TextMsgRoute = require('./textMsg/_routes');
const meetingRoute = require('./meeting/_routes');
const paymentRoute = require('./payment/_routes');
const roleAccessRoute = require('./roleAccess/_routes');
const imagesRoute = require('./images/_routes');
const customFieldRoute = require("./customField/_routes");
const validationRoute = require("./validation/_routes");
const formRoute = require("./form/_routes");
const statusRoute = require("./status/_routes");
const calendarRoute = require("./calendar/_routes")
const emailTempRoute = require("./emailTemplate/_routes")
const opportunityRoute = require("./opportunities/_routes")
const quotesRoute = require("./quotes/_routes")
const moduleActiveDeactiveRoute = require("./moduleActiveDeactive/_routes")
const accountRoute = require("./account/_routes")
const invoicesRoute = require("./invoices/_routes")

//Api`s
router.use('/contact', contactRoute);
router.use('/property', propertyRoute)
router.use('/lead', leadRoute)
router.use('/task', taskRoute);
router.use('/document', documentRoute);
router.use('/reporting', reportingRoute);
router.use('/user', userRoute);
router.use('/payment', paymentRoute);

router.use('/email', emailRoute);
router.use('/phoneCall', phoneCallRoute);
router.use('/text-msg', TextMsgRoute);
router.use('/meeting', meetingRoute);

router.use("/images", imagesRoute);
router.use('/role-access', roleAccessRoute);
router.use('/route', route);

router.use('/modules', moduleActiveDeactiveRoute);
router.use("/custom-field", customFieldRoute);
router.use("/validation", validationRoute);
router.use("/form", formRoute);
router.use("/status", statusRoute);
router.use("/calendar", calendarRoute);

router.use("/email-temp", emailTempRoute);
router.use("/opportunity", opportunityRoute);
router.use("/quotes", quotesRoute);
router.use("/invoices", invoicesRoute);
router.use("/account", accountRoute);

module.exports = router;