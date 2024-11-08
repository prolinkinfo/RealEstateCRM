const mongoose = require("mongoose");
const OpportunityProject = require("../../model/schema/opportunityproject");
const propertyData = require("../../model/schema/property");

const index = async (req, res) => {
  const query = req.query;
  query.deleted = false;
  let result = await OpportunityProject.find(query);
  return res.send(result);
};

const add = async (req, res) => {
  try {
    const { name, requirement, category, property, contact, lead } = req.body;
    if (contact && !mongoose.Types.ObjectId.isValid(contact)) {
      res.status(400).json({ error: "Invalid contact value" });
    }
    if (lead && !mongoose.Types.ObjectId.isValid(lead)) {
      res.status(400).json({ error: "Invalid lead value" });
    }
    const oppotunityDataBody = {
      name,
      requirement,
      category,
      property,
    };

    if (contact) {
      oppotunityDataBody.contact = contact;
    }
    if (lead) {
      oppotunityDataBody.lead = lead;
    }

    const result = new OpportunityProject(oppotunityDataBody);
    await result.save();
    res.status(200).json(result);
  } catch (err) {
    console.error("Failed to create :", err);
    res.status(400).json({ err, error: "Failed to create" });
  }
};

const addMany = async (req, res) => {
  try {
    const data = req.body;
    const insertedOportunityProject = await OpportunityProject.insertMany(data);
    res.status(200).json(insertedOportunityProject);
  } catch (err) {
    console.error("Failed to create OpportunityProject :", err);
    res.status(400).json({ error: "Failed to create OpportunityProject" });
  }
};

const view = async (req, res) => {
  // try {
  //   let result = await OpportunityProject.findOne({
  //     _id: req.params.id,
  //     deleted: false,
  //   });

  //   if (!result) return res.status(404).json({ message: "No Data Found." });

  //   return res.status(200).json(result);
  // } catch (error) {
  //   console.error("Failed :", error);
  //   res
  //     .status(400)
  //     .json({ success: false, message: "Failed to display ", err: error });
  // }
  try {
    let propertyOpportunityProject = await OpportunityProject.findById({
      _id: req.params.id,
    }).populate("property");
    let result = await OpportunityProject.aggregate([
      { $match: { _id: new mongoose.Types.ObjectId(req.params.id) } },
      {
        $lookup: {
          from: "Contacts",
          localField: "contact",
          foreignField: "_id",
          as: "contactList",
        },
      },
      {
        $lookup: {
          from: "Leads",
          localField: "lead",
          foreignField: "_id",
          as: "leadList",
        },
      },
      {
        $lookup: {
          from: "User",
          localField: "createBy",
          foreignField: "_id",
          as: "users",
        },
      },
      { $unwind: { path: "$contactList", preserveNullAndEmptyArrays: true } },
      { $unwind: { path: "$users", preserveNullAndEmptyArrays: true } },
      { $unwind: { path: "$leadList", preserveNullAndEmptyArrays: true } },
      {
        $addFields: {
          setCategory: {
            $cond: {
              if: "$contactList",
              then: "$contactList.fullName",
              else: "$leadList.leadName",
            },
          },
        },
      },
      { $project: { contactList: 0, users: 0, leadList: 0 } },
    ]);

    if (result.length === 0) {
      return res.status(404).json({ message: "No related data found." });
    }
    let response = {
      ...result[0],
      propertyOpportunityProject: propertyOpportunityProject?.property,
    };
    res.status(200).json(response);
  } catch (err) {
    console.error("Error:", err);
    res.status(500).json({ Error: err.message });
  }
};

const edit = async (req, res) => {
  const { name, requirement, category, property, contact, lead } = req.body;

  if (contact && !mongoose.Types.ObjectId.isValid(contact)) {
    res.status(400).json({ error: "Invalid Assign To value" });
  }
  if (lead && !mongoose.Types.ObjectId.isValid(lead)) {
    res.status(400).json({ error: "Invalid Assign To Lead value" });
  }

  const oppotunityDataBody = {
    name,
    requirement,
    category,
    property,
  };
  if (category === "Contact") {
    oppotunityDataBody.contact = contact;
    oppotunityDataBody.lead = null;
  }
  if (category === "Lead") {
    oppotunityDataBody.contact = null;
    oppotunityDataBody.lead = lead;
  }

  try {
    let result = await OpportunityProject.findOneAndUpdate(
      { _id: req.params.id },
      { $set: oppotunityDataBody },
      { new: true }
    );

    res.status(200).json(result);
  } catch (err) {
    console.error("Failed to create OpportunityProject:", err);
    res
      .status(400)
      .json({ error: "Failed to create OpportunityProject : ", err });
  }
};

const deleteData = async (req, res) => {
  try {
    console.log(req.params.id);
    const result = await OpportunityProject.findByIdAndUpdate(req.params.id, {
      deleted: true,
    });
    res.status(200).json({ message: "done", result: result });
  } catch (err) {
    res.status(404).json({ message: "error", err });
  }
};
const deleteMany = async (req, res) => {
  try {
    const result = await OpportunityProject.updateMany(
      { _id: { $in: req.body } },
      { $set: { deleted: true } }
    );
    console.log(result);
    if (result?.matchedCount > 0 && result?.modifiedCount > 0) {
      return res
        .status(200)
        .json({ message: "Opportunity Project Removed successfully", result });
    } else {
      return res.status(404).json({
        success: false,
        message: "Failed to remove Opportunity Project",
      });
    }
  } catch (err) {
    return res.status(404).json({ success: false, message: "error", err });
  }
};
module.exports = { index, add, addMany, view, edit, deleteData, deleteMany };
