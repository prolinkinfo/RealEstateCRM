const mongoose = require('mongoose');

const Quotes = new mongoose.Schema({
    title: String,
    description: String,
    approvalIssues: String,
    billingStreet: String,
    billingCity: String,
    billingState: String,
    billingPostalCode: String,
    billingCountry: String,
    shippingStreet: String,
    shippingCity: String,
    shippingState: String,
    shippingPostalCode: String,
    shippingCountry: String,
    validUntil: String,
    quoteNumber: String,
    lineItems: String,
    total: String,
    subtotal: String,
    discount: String,
    tax: String,
    ptax: String,
    shipping: String,
    shippingTax: String,
    grandTotal: String,
    currency: String,
    quoteStage: String,
    paymentTerms: String,
    terms: String,
    description: String,
    approvalStatus: String,
    invoiceStatus: String,
    discountType: String,
    items: [],
    oppotunity: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Opportunities",
    },
    account: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Accounts",
    },
    contact: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Contacts",
    },

    assignedTo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    createBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    modifiedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    isCheck: {
        type: Boolean,
        default: false,
    },
    deleted: {
        type: Boolean,
        default: false,
    },
    updatedDate: {
        type: Date,
        default: Date.now
    },
    createdDate: {
        type: Date,
        default: Date.now
    },
})

module.exports = mongoose.model('Quotes', Quotes, 'Quotes');


// Title                     - "Textfield"
// Description               - "TextArea"
// Assigned to               - "Relationship – Users"
// Approval Issues           - "TextArea"
// Account                   - "Relationship – Accounts"
// Contact                   - "Relationship – Contacts"
// Billing Street            - "Textfield"
// Billing City              - "Textfield"
// Billing State             - "Textfield"
// Billing Postal Code       - "Textfield"
// Billing Country           - "Textfield"
// Shipping Street           - "Textfield"
// Shipping City             - "Textfield"
// Shipping State            - "Textfield"
// Shipping Postal Code      - "Textfield"
// Shipping Country          - "Textfield"
// Valid Until               - "Date"
// Quote Number              - "Integer"
// Opportunity               - "Relationship – Opportunities"
// Line Items                - "function"
// Total                     - "Currency"
// Subtotal                  - "Currency"
// Discount                  - "Currency"
// Tax                       - "Currency"
// Shipping                  - "Currency"
// Shipping Tax              - "Drop Down List"
// Grand Total               - "Currency"
// Currency                  - "Drop Down List"
// Quote Stage               - "Drop Down List"
// Payment Terms             - "Drop Down List"
// Terms                     - "Text Area"
// Approval Status           - "Drop Down List"
// Invoice Status            - "Drop Down List                                                               
