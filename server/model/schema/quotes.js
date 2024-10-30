const mongoose = require("mongoose");
const installmentsSchema = new mongoose.Schema({
  no: {
    type: Number,
  },
  months: {
    type: String,
  },
  per: {
    type: Number,
  },
  startDate: {
    type: Date,
  },
  total: {
    type: Number,
  },
});
const Quotes = new mongoose.Schema({
  lead: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Leads",
  },
  contact: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Contacts",
  },
  property: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Properties",
  },
  category: String,
  salesManagerSign: String,
  buyerImage: String,
  accountName: String,
  accountNumber: Number,
  swiftCode: Number,
  amount: Number,
  bank: String,
  branch: String,
  installments: [installmentsSchema],
  description: String,
  unitPrice: Number,
  createBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  deleted: {
    type: Boolean,
    default: false,
  },
  updatedDate: {
    type: Date,
    default: Date.now,
  },
  createdDate: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Quotes", Quotes, "Quotes");

// ------------------------------------

// const mongoose = require('mongoose');

// const Quotes = new mongoose.Schema({
//     title: String,
//     description: String,
//     approvalIssues: String,
//     billingStreet: String,
//     billingCity: String,
//     billingState: String,
//     billingPostalCode: String,
//     billingCountry: String,
//     shippingStreet: String,
//     shippingCity: String,
//     shippingState: String,
//     shippingPostalCode: String,
//     shippingCountry: String,
//     validUntil: String,
//     quoteNumber: String,
//     lineItems: String,
//     total: String,
//     subtotal: String,
//     discount: String,
//     tax: String,
//     ptax: String,
//     shipping: String,
//     shippingTax: String,
//     grandTotal: String,
//     currency: String,
//     quoteStage: String,
//     paymentTerms: String,
//     terms: String,
//     description: String,
//     approvalStatus: String,
//     invoiceStatus: String,
//     discountType: String,
//     items: [],
//     oppotunity: {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: "Opportunities",
//     },
//     account: {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: "Accounts",
//     },
//     contact: {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: "Contacts",
//     },

//     assignedTo: {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: "User",
//     },
//     createBy: {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: 'User',
//         required: true
//     },
//     modifiedBy: {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: 'User',
//         required: true
//     },
//     isCheck: {
//         type: Boolean,
//         default: false,
//     },
//     deleted: {
//         type: Boolean,
//         default: false,
//     },
//     updatedDate: {
//         type: Date,
//         default: Date.now
//     },
//     createdDate: {
//         type: Date,
//         default: Date.now
//     },
// })

// module.exports = mongoose.model('Quotes', Quotes, 'Quotes');
