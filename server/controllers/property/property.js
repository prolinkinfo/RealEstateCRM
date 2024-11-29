const { Lead } = require("../../model/schema/lead");
const { Property } = require("../../model/schema/property");
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const { Contact } = require("../../model/schema/contact");
const PhoneCall = require("../../model/schema/phoneCall");
const { default: mongoose } = require("mongoose");
const Email = require("../../model/schema/email");
const ejs = require("ejs");
const puppeteer = require("puppeteer");
const moment = require("moment");
const quotes = require("../../model/schema/quotes");

const index = async (req, res) => {
  const query = req.query;
  query.deleted = false;
  let allData = await Property.find(query)
    .populate({
      path: "createBy",
      match: { deleted: false },
    })
    .exec();

  const result = allData.filter((item) => item.createBy !== null);
  res.send(result);
};

const add = async (req, res) => {
  try {
    req.body.createdDate = new Date();
    const property = new Property(req.body);
    await property.save();
    res.status(200).json(property);
  } catch (err) {
    console.error("Failed to create Property:", err);
    res.status(400).json({ error: "Failed to create Property" });
  }
};

const buildApartmentData = (floorCount, unitData) => {
  let apartmentData = [];

  for (let i = 1; i <= floorCount; i++) {
    let floorUnits = unitData?.map((item, index) => ({
      flateName: i * 100 + (index + 1),
      status: "Available",
      unitType: item?._id,
    }));

    apartmentData.push({
      floorNumber: i,
      flats: floorUnits,
    });
  }

  return apartmentData;
};

const addApartmentData = (oldUnits, newUnitTypeId) => {
  let newFloors = oldUnits?.map((item, i) => ({
    ...item,
    flats: [
      ...item.flats,
      {
        flateName: (i + 1) * 100 + (item?.flats?.length + 1),
        status: "Available",
        unitType: newUnitTypeId,
      },
    ],
  }));

  return newFloors;
};

const deleteUnitType = async (req, res) => {
  try {
    const { id } = req.params;
    const { unitTypeId } = req.body;
    const updatedProperty = await Property.findByIdAndUpdate(
      { _id: id },
      { $pull: { unitType: { _id: unitTypeId } } },
      { new: true }
    );
    res.status(200).json(updatedProperty);
  } catch (error) {
    console.error("Failed to Delete");
  }
};

const addUnits = async (req, res) => {
  try {
    const { id } = req.params;
    const { units, type } = req.body;

    let result;

    if (type === "A") {
      let newUnit = units;

      const property = await Property.findById(id).lean();
      newUnit.order = (property?.unitType?.length || 0) + 1;
      newUnit._id = new mongoose.Types.ObjectId();

      result = await Property.updateOne(
        { _id: id },
        { $push: { unitType: newUnit } }
      );

      const updatedProperty = await Property.findById(id).lean();

      if (updatedProperty?.units && updatedProperty?.units?.length > 0) {
        const newUnits = addApartmentData(updatedProperty?.units, newUnit?._id);
        await Property.updateOne({ _id: id }, { $set: { units: newUnits } });
      } else {
        const flates = buildApartmentData(
          updatedProperty?.Floor,
          updatedProperty?.unitType
        );
        result = await Property.updateOne(
          { _id: id },
          { $set: { units: flates } }
        );
      }
    } else if (type === "E") {
      const updatedProperty = await Property.findById(id).lean();

      const unitTypeLookup = units?.reduce((acc, curr) => {
        acc[curr?._id] = curr?.order;
        return acc;
      }, {});

      const updatedUnits = updatedProperty?.units.map((unit) => {
        const sortedFlats = [...unit?.flats].sort((a, b) => {
          return unitTypeLookup[a?.unitType] - unitTypeLookup[b?.unitType];
        });

        return {
          ...unit,
          flats: unit?.flats.map((flat, index) => ({
            ...flat,
            status: sortedFlats?.[index]?.status,
            unitType: sortedFlats?.[index]?.unitType,
          })),
        };
      });

      result = await Property.updateOne(
        { _id: id },
        { $set: { unitType: units, units: updatedUnits } }
      );
    }

    res.status(200).json(result);
  } catch (err) {
    console.error("Failed to create Property:", err);
    res.status(400).json({ error: "Failed to create Property" });
  }
};

const editUnit = async (req, res) => {
  try {
    const { id } = req.params;

    let result;

    result = await Property.updateOne(
      { _id: id, "unitType._id": req?.body?._id },
      { $set: { "unitType.$": req?.body } }
    );

    res.status(200).json(result);
  } catch (err) {
    console.error("Failed to create Property:", err);
    res.status(400).json({ error: "Failed to create Property" });
  }
};

const updateUnitTypeId = async (req, res) => {
  try {
    const { id, unitid, newUnitType } = req.params;
    const updatedUnitTypeId = await Property.updateOne(
      { _id: id, "units.flats._id": unitid },
      { $set: { "units.$[].flats.$[flat].unitType": newUnitType } },
      {
        arrayFilters: [{ "flat._id": unitid }],
        new: true,
      }
    );
    res.status(200).json(updatedUnitTypeId);
  } catch (error) {
    console.log(error);
  }
};

const findPropertyAndFloor = async (id, floor, unit) => {
  const property = await Property?.findById(id)?.lean();
  if (!property) return { error: "Property not found" };

  const selectedFloor = property?.units?.find(
    (item) => item?._id?.toString() === floor?._id?.toString()
  );
  if (!selectedFloor) return { error: "Floor not found" };

  const flatIndex = selectedFloor?.flats?.findIndex(
    (item) => item?._id?.toString() === unit?._id?.toString()
  );
  if (flatIndex === -1) return { error: "Flat not found" };

  return { selectedFloor, flatIndex };
};

const changeUnitStatus = async (req, res) => {
  try {
    const { id } = req?.params;
    const { floor, unit } = req?.body;

    const { selectedFloor, flatIndex, error } = await findPropertyAndFloor(
      id,
      floor,
      unit
    );
    if (error) return res?.status(404)?.json({ error });

    selectedFloor.flats[flatIndex] = unit;

    const result = await Property.updateOne(
      { _id: id, "units._id": floor?._id },
      { $set: { "units.$.flats": selectedFloor?.flats } }
    );

    res?.status(200)?.json(result);
  } catch (err) {
    console?.error("Failed to create Property:", err);
    res?.status(400)?.json({ error: "Failed to create Property" });
  }
};

const offerLetterStorage = multer({
  storage: multer.diskStorage({
    destination: function (req, file, cb) {
      const uploadDir = "uploads/offer-letter";
      fs.mkdirSync(uploadDir, { recursive: true });
      cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
      const uploadDir = "uploads/offer-letter";
      const filePath = path.join(uploadDir, file.originalname);

      // Check if the file already exists in the destination directory
      if (fs.existsSync(filePath)) {
        // For example, you can append a timestamp to the filename to make it unique
        const timestamp = Date.now() + Math.floor(Math.random() * 90);
        cb(
          null,
          file.originalname.split(".")[0] +
            "-" +
            timestamp +
            "." +
            file.originalname.split(".")[1]
        );
      } else {
        cb(null, file.originalname);
      }
    },
  }),
});

const getOrdinalSuffix = (number) => {
  const suffix = ["th", "st", "nd", "rd"][number % 10] || "th";
  return number % 100 === 11 || number % 100 === 12 || number % 100 === 13
    ? "th"
    : suffix;
};

const genrateOfferLetter = async (req, res) => {
  try {
    const { id } = req?.params;
    let unit = JSON?.parse(req?.body?.unit);
    unit.status = "Booked";
    const floor = JSON?.parse(req?.body?.floor);
    const url = req.protocol + "://" + req.get("host");

    const buyerImageUrl = `${url}/api/property/offer-letter/${req?.files?.buyerImage?.[0]?.filename}`;
    const salesManagerSignUrl = `${url}/api/property/offer-letter/${req?.files?.salesManagerSign?.[0]?.filename}`;
    const property = await Property.findById(id).lean();
    let purchaser = "";
    if (req?.body?.lead) {
      const lead = await Lead.findOne({
        _id: new mongoose.Types.ObjectId(req?.body?.lead),
      }).lean();
      purchaser = lead?.leadName;
    }
    if (req?.body?.contact) {
      const contact = await Contact?.findOne({
        _id: new mongoose.Types.ObjectId(req?.body?.contact),
      }).lean();
      purchaser = contact?.fullName;
    }

    const unitType = property?.unitType?.find(
      (item) => item?._id?.toString() === unit?.unitType?.toString()
    );

    let description = `SALE OF ${property?.name} ${
      unitType?.name
    } APARTMENT NUMBER ${unit?.flateName} ON ${
      floor?.floorNumber
    }${getOrdinalSuffix(floor?.floorNumber)} FLOOR IN ${
      property?.location
    } APARTMENT ON L.R. NO. ${property?.lrNo || "-"}. `;

    const templatePath = path.join(__dirname, "templates", "offerLetter.ejs");

    const footerTemplate = `
        <hr style="border: 1px solid #000; margin: 0;">
      <div style="font-size: 15px; text-align: center; width: 100%; margin-top: 5px;">
        <div style="border-top: 2px solid #000; margin-bottom: 5px; padding-top: 5px;">
          <span style="font-weight: bold;">ZUQRUF DEVELOPERS</span>
        </div>
        <span style="font-size: 12px;">Page <span class="pageNumber"></span> / <span class="totalPages"></span></span>
      </div>`;

    const htmlContnet = await ejs.renderFile(templatePath, {
      ...req?.body,
      property,
      installments: JSON?.parse(req?.body?.installments),
      description: description,
      unitPrice: unitType?.price,
      buyerImageUrl,
      salesManagerSignUrl,
      footerContain: "",
      purchaser,
      currentDate: moment().format("DD/MM/yyyy"),
    });
    
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    await page.setContent(htmlContnet, { waitUntil: "load" });

    const pdfBuffer = await page.pdf({
      format: "A4",
      printBackground: true,
      displayHeaderFooter: true,
      footerTemplate: footerTemplate,
    });

    const { selectedFloor, flatIndex, error } = await findPropertyAndFloor(
      id,
      floor,
      unit
    );

    if (error) return res?.status(404)?.json({ error });

    selectedFloor.flats[flatIndex] = unit;

    await Property.updateOne(
      { _id: id, "units._id": floor?._id },
      { $set: { "units.$.flats": selectedFloor?.flats } }
    );

    if (req.body.lead) {
      const lead = await Lead.findOne({
        _id: new mongoose.Types.ObjectId(req?.body?.lead),
      }).lean();

      const contactFeild = new Contact({
        fullName: lead?.leadName,
        email: lead?.leadEmail,
        phoneNumber: lead?.leadPhoneNumber,
        campaign: lead?.leadCampaign,
        state: lead?.leadState,
        communicationTool: lead?.communicationTool,
        listedFor: lead?.listedFor,
        interestProperty: [lead?.associatedListing],
        deleted: false,
        createBy: req?.user?.userId,
        createdDate: new Date(),
      });

      await contactFeild.save();
    }

    await browser.close();

    let offerLatterFeiledPayload = {
      category: req.body.category,
      accountName: req?.body?.accountName,
      bank: req?.body?.bank,
      branch: req?.body?.branch,
      accountNumber: req?.body?.accountNumber,
      swiftCode: req?.body?.swiftCode,
      salesManagerSign: req?.body?.salesManagerSign,
      buyerImage: req?.body?.buyerImage,
      description: req?.body?.description,
      unitPrice: req?.body?.unitPrice,
      amount: req?.body?.amount,
      property: id,
      installments: JSON.parse(req?.body?.installments),
      createBy: req?.user?.userId,
    };

    if (offerLatterFeiledPayload?.category === "lead") {
      offerLatterFeiledPayload.lead = req?.body?.lead;
    } else if (offerLatterFeiledPayload?.category === "contact") {
      offerLatterFeiledPayload.contact = req?.body?.contact;
    }

    const offerLatterFeild = new quotes(offerLatterFeiledPayload);
    await offerLatterFeild.save();
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=offer-letter.pdf"
    );

    res.end(pdfBuffer);
  } catch (err) {
    console?.error("Failed to create Property:", err);
    res?.status(400)?.json({ error: "Failed to create Property" });
  }
};

const addMany = async (req, res) => {
  try {
    const data = req.body;
    const insertedProperty = await Property.insertMany(data);
    res.status(200).json(insertedProperty);
  } catch (err) {
    console.error("Failed to create Property :", err);
    res.status(400).json({ error: "Failed to create Property" });
  }
};

const edit = async (req, res) => {
  try {
    let property = await Property.findById(req.params.id).lean();

    let result = await Property.updateOne(
      { _id: req.params.id },
      { $set: req.body }
    );

    if (
      req?.body?.Floor !== undefined &&
      req?.body?.Floor !== property?.Floor
    ) {
      if (Number(property?.Floor) < Number(req?.body?.Floor)) {
        const flates = buildApartmentData(req?.body?.Floor, property?.unitType);
        await Property.updateOne(
          { _id: req.params.id },
          {
            $push: {
              units: flates?.slice(property?.Floor),
            },
          }
        );
      } else {
        const flates = property?.units?.slice(0, req?.body?.Floor);
        await Property.updateOne(
          { _id: req.params.id },
          { $set: { units: flates } }
        );
      }
    }

    res.status(200).json(result);
  } catch (err) {
    console.error("Failed to Update Property:", err);
    res.status(400).json({ error: "Failed to Update Property" });
  }
};

const view = async (req, res) => {
  const { id } = req.params;
  let property = await Property.findOne({ _id: id });
  let result = await Contact.find({ deleted: false });

  let phoneCall = await PhoneCall.aggregate([
    {
      $match: {
        property: { $in: [new mongoose.Types.ObjectId(id)] }, // Match calls where the property array contains the specific propertyId
      },
    },
    {
      $lookup: {
        from: "Contacts",
        localField: "createByContact",
        foreignField: "_id",
        as: "contact",
      },
    },
    {
      $lookup: {
        from: "Leads", // Assuming this is the collection name for 'leads'
        localField: "createByLead",
        foreignField: "_id",
        as: "createByrefLead",
      },
    },
    {
      $lookup: {
        from: "User",
        localField: "sender",
        foreignField: "_id",
        as: "users",
      },
    },
    {
      $lookup: {
        from: "User",
        localField: "salesAgent",
        foreignField: "_id",
        as: "salesAgent",
      },
    },
    {
      $lookup: {
        from: "Properties",
        localField: "property",
        foreignField: "_id",
        as: "properties",
      },
    },
    { $unwind: { path: "$users", preserveNullAndEmptyArrays: true } },
    { $unwind: { path: "$contact", preserveNullAndEmptyArrays: true } },
    {
      $unwind: { path: "$createByrefLead", preserveNullAndEmptyArrays: true },
    },
    { $unwind: { path: "$salesAgent", preserveNullAndEmptyArrays: true } },
    { $match: { "users.deleted": false } },
    {
      $addFields: {
        senderName: { $concat: ["$users.firstName", " ", "$users.lastName"] },
        deleted: {
          $cond: [
            { $eq: ["$contact.deleted", false] },
            "$contact.deleted",
            { $ifNull: ["$createByrefLead.deleted", false] },
          ],
        },
        createByName: {
          $cond: {
            if: "$contact",
            then: {
              $concat: [
                "$contact.title",
                " ",
                "$contact.firstName",
                " ",
                "$contact.lastName",
              ],
            },
            else: { $concat: ["$createByrefLead.leadName"] },
          },
        },
        salesAgentName: {
          $cond: {
            if: { $ne: ["$salesAgent", null] },
            then: {
              $concat: ["$salesAgent.firstName", " ", "$salesAgent.lastName"],
            },
            else: "",
          },
        },
      },
    },
    { $project: { contact: 0, createByrefLead: 0, users: 0, salesAgent: 0 } },
  ]);

  let Emails = await Email.aggregate([
    {
      $match: {
        property: { $in: [new mongoose.Types.ObjectId(id)] }, // Match calls where the property array contains the specific propertyId
      },
    },
    {
      $lookup: {
        from: "Leads", // Assuming this is the collection name for 'leads'
        localField: "createByLead",
        foreignField: "_id",
        as: "createByrefLead",
      },
    },
    {
      $lookup: {
        from: "Contacts", // Assuming this is the collection name for 'contacts'
        localField: "createByContact",
        foreignField: "_id",
        as: "createByRef",
      },
    },
    {
      $lookup: {
        from: "User",
        localField: "sender",
        foreignField: "_id",
        as: "users",
      },
    },
    { $unwind: { path: "$users", preserveNullAndEmptyArrays: true } },
    { $unwind: { path: "$createByRef", preserveNullAndEmptyArrays: true } },
    { $unwind: { path: "$createByrefLead", preserveNullAndEmptyArrays: true } },
    { $match: { "users.deleted": false } },
    {
      $addFields: {
        senderName: { $concat: ["$users.firstName", " ", "$users.lastName"] },
        deleted: {
          $cond: [
            { $eq: ["$createByRef.deleted", false] },
            "$createByRef.deleted",
            { $ifNull: ["$createByrefLead.deleted", false] },
          ],
        },
        createByName: {
          $cond: {
            if: "$createByRef",
            then: {
              $concat: [
                "$createByRef.title",
                " ",
                "$createByRef.firstName",
                " ",
                "$createByRef.lastName",
              ],
            },
            else: { $concat: ["$createByrefLead.leadName"] },
          },
        },
      },
    },
    {
      $project: {
        createByRef: 0,
        createByrefLead: 0,
        users: 0,
      },
    },
  ]);

  let filteredContacts = result?.filter((contact) =>
    contact.interestProperty?.includes(id)
  );

  if (!property) return res.status(404).json({ message: "no Data Found." });
  res.status(200).json({ property, filteredContacts, phoneCall, Emails });
};

const deleteData = async (req, res) => {
  try {
    const property = await Property.findByIdAndUpdate(req.params.id, {
      deleted: true,
    });
    res.status(200).json({ message: "done", property });
  } catch (err) {
    res.status(404).json({ message: "error", err });
  }
};

const deleteMany = async (req, res) => {
  try {
    const property = await Property.updateMany(
      { _id: { $in: req.body } },
      { $set: { deleted: true } }
    );
    res.status(200).json({ message: "done", property });
  } catch (err) {
    res.status(404).json({ message: "error", err });
  }
};

// const storage = multer.diskStorage({
// destination: function (req, file, cb) {
//     const uploadDir = 'uploads/Property/PropertyPhotos';
//     fs.mkdirSync(uploadDir, { recursive: true });
//     cb(null, uploadDir);
// },
// filename: function (req, file, cb) {
//     const uploadDir = 'uploads/Property';
//     const filePath = path.join(uploadDir, file.originalname);

//     // Check if the file already exists in the destination directory
//     if (fs.existsSync(filePath)) {
//         // For example, you can append a timestamp to the filename to make it unique
//         const timestamp = Date.now() + Math.floor(Math.random() * 90);
//         cb(null, file.originalname.split('.')[0] + '-' + timestamp + '.' + file.originalname.split('.')[1]);
//     } else {
//         cb(null, file.originalname);
//     }
// },
// });

const upload = multer({
  storage: multer.diskStorage({
    destination: function (req, file, cb) {
      const uploadDir = "uploads/Property/PropertyPhotos";
      fs.mkdirSync(uploadDir, { recursive: true });
      cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
      const uploadDir = "uploads/Property/PropertyPhotos";
      const filePath = path.join(uploadDir, file.originalname);

      // Check if the file already exists in the destination directory
      if (fs.existsSync(filePath)) {
        // For example, you can append a timestamp to the filename to make it unique
        const timestamp = Date.now() + Math.floor(Math.random() * 90);
        cb(
          null,
          file.originalname.split(".")[0] +
            "-" +
            timestamp +
            "." +
            file.originalname.split(".")[1]
        );
      } else {
        cb(null, file.originalname);
      }
    },
  }),
});

const propertyPhoto = async (req, res) => {
  try {
    const { id } = req.params;

    if (!req.files || req.files.length === 0) {
      res.status(400).send("No files uploaded.");
      return;
    }
    const url = req.protocol + "://" + req.get("host");

    const file = req?.files.map((file) => ({
      img: `${url}/api/property/property-photos/${file.filename}`,
      createOn: new Date(),
    }));

    await Property.updateOne(
      { _id: id },
      { $push: { propertyPhotos: { $each: file } } }
    );
    res.send("File uploaded successfully.");
  } catch (err) {
    console.error("Failed to create Property:", err);
    res.status(400).json({ error: "Failed to create Property" });
  }
};
// --
const virtualTours = multer({
  storage: multer.diskStorage({
    destination: function (req, file, cb) {
      const uploadDir = "uploads/Property/virtual-tours-or-videos";
      fs.mkdirSync(uploadDir, { recursive: true });
      cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
      const uploadDir = "uploads/Property/virtual-tours-or-videos";
      const filePath = path.join(uploadDir, file.originalname);

      // Check if the file already exists in the destination directory
      if (fs.existsSync(filePath)) {
        // For example, you can append a timestamp to the filename to make it unique
        const timestamp = Date.now() + Math.floor(Math.random() * 90);
        cb(
          null,
          file.originalname.split(".")[0] +
            "-" +
            timestamp +
            "." +
            file.originalname.split(".")[1]
        );
      } else {
        cb(null, file.originalname);
      }
    },
  }),
});

const VirtualToursorVideos = async (req, res) => {
  try {
    const { id } = req.params;

    if (!req.files || req.files.length === 0) {
      res.status(400).send("No files uploaded.");
      return;
    }
    const url = req.protocol + "://" + req.get("host");

    const file = req?.files.map((file) => ({
      img: `${url}/api/property/virtual-tours-or-videos/${file.filename}`,
      createOn: new Date(),
    }));

    await Property.updateOne(
      { _id: id },
      { $push: { virtualToursOrVideos: { $each: file } } }
    );
    res.send("File uploaded successfully.");
  } catch (err) {
    console.error("Failed to create Property:", err);
    res.status(400).json({ error: "Failed to create Property" });
  }
};

const FloorPlansStorage = multer({
  storage: multer.diskStorage({
    destination: function (req, file, cb) {
      const uploadDir = "uploads/Property/floor-plans";
      fs.mkdirSync(uploadDir, { recursive: true });
      cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
      const uploadDir = "uploads/Property/floor-plans";
      const filePath = path.join(uploadDir, file.originalname);

      // Check if the file already exists in the destination directory
      if (fs.existsSync(filePath)) {
        // For example, you can append a timestamp to the filename to make it unique
        const timestamp = Date.now() + Math.floor(Math.random() * 90);
        cb(
          null,
          file.originalname.split(".")[0] +
            "-" +
            timestamp +
            "." +
            file.originalname.split(".")[1]
        );
      } else {
        cb(null, file.originalname);
      }
    },
  }),
});

const FloorPlans = async (req, res) => {
  try {
    const { id } = req.params;

    if (!req.files || req.files.length === 0) {
      res.status(400).send("No files uploaded.");
      return;
    }
    const url = req.protocol + "://" + req.get("host");

    const file = req?.files.map((file) => ({
      img: `${url}/api/property/floor-plans/${file.filename}`,
      createOn: new Date(),
    }));

    await Property.updateOne(
      { _id: id },
      { $push: { floorPlans: { $each: file } } }
    );
    res.send("File uploaded successfully.");
  } catch (err) {
    console.error("Failed to create Property:", err);
    res.status(400).json({ error: "Failed to create Property" });
  }
};
// --
const PropertyDocumentsStorage = multer({
  storage: multer.diskStorage({
    destination: function (req, file, cb) {
      const uploadDir = "uploads/Property/property-documents";
      fs.mkdirSync(uploadDir, { recursive: true });
      cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
      const uploadDir = "uploads/Property/property-documents";
      const filePath = path.join(uploadDir, file.originalname);

      // Check if the file already exists in the destination directory
      if (fs.existsSync(filePath)) {
        // For example, you can append a timestamp to the filename to make it unique
        const timestamp = Date.now() + Math.floor(Math.random() * 90);
        cb(
          null,
          file.originalname.split(".")[0] +
            "-" +
            timestamp +
            "." +
            file.originalname.split(".")[1]
        );
      } else {
        cb(null, file.originalname);
      }
    },
  }),
});

const PropertyDocuments = async (req, res) => {
  try {
    const { id } = req.params;

    if (!req.files || req.files.length === 0) {
      res.status(400).send("No files uploaded.");
      return;
    }
    const url = req.protocol + "://" + req.get("host");

    const file = req?.files.map((file) => ({
      filename: file.filename,
      img: `${url}/api/property/property-documents/${file.filename}`,
      createOn: new Date(),
    }));

    await Property.updateOne(
      { _id: id },
      { $push: { propertyDocuments: { $each: file } } }
    );
    res.send("File uploaded successfully.");
  } catch (err) {
    console.error("Failed to create Property:", err);
    res.status(400).json({ error: "Failed to create Property" });
  }
};

module.exports = {
  index,
  add,
  addUnits,
  changeUnitStatus,
  addMany,
  offerLetterStorage,
  editUnit,
  deleteUnitType,
  updateUnitTypeId,
  genrateOfferLetter,
  view,
  edit,
  deleteData,
  deleteMany,
  upload,
  propertyPhoto,
  virtualTours,
  VirtualToursorVideos,
  FloorPlansStorage,
  FloorPlans,
  PropertyDocumentsStorage,
  PropertyDocuments,
};
