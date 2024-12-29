const leadFields = [
  {
    name: "leadName",
    label: "Lead Name",
    type: "text",
    fixed: true,
    delete: false,
    belongsTo: null,
    backendType: "String",
    editable: false,
    isTableField: true,
    options: [],
    validation: [
      {
        require: true,
        message: "",
      },
    ],
  },
  {
    name: "leadStatus",
    label: "Lead Status",
    type: "select",
    fixed: false,
    delete: false,
    belongsTo: null,
    backendType: "Mixed",
    isTableField: true,
    options: [
      {
        name: "Active",
        value: "active",
      },
      {
        name: "Pending",
        value: "pending",
      },
      {
        name: "Sold",
        value: "sold",
      },
    ],
    validation: [
      {
        message: "Invalid type value for Lead Status",
        formikType: "String",
      },
    ],
  },
  {
    name: "leadEmail",
    label: "Lead Email",
    type: "email",
    fixed: true,
    delete: false,
    belongsTo: null,
    backendType: "String",
    isTableField: true,
    options: [],
    validation: [
      {
        require: true,
        message: "",
      },
    ],
  },
  {
    name: "leadMobile",
    label: "Lead Mobile",
    type: "tel",
    fixed: true,
    isDefault: false,
    editable: false,
    delete: false,
    belongsTo: null,
    backendType: "Mixed",
    isTableField: false,
    isView: false,
    options: [],
    validation: [
      {
        require: true,
        message: "",
      },
    ],
  },
  {
    name: "leadCampaign",
    label: "Lead Campaign",
    type: "select",
    fixed: true,
    isDefault: false,
    editable: false,
    delete: false,
    belongsTo: null,
    backendType: "Mixed",
    isTableField: true,
    isView: false,
    options: [
      {
        name: "Referral",
        value: "Referral",
      },
      {
        name: "Online",
        value: "Online",
      },
      {
        name: "Billboard",
        value: "Billboard",
      },
      {
        name: "Activation",
        value: "Activation",
      },
      {
        name: "Agent",
        value: "Agent",
      },
    ],
    validation: [
      {
        require: true,
        message: "Lead Campaign is require ",
      },
    ],
  },
  {
    name: "leadState",
    label: "Lead State",
    type: "select",
    fixed: true,
    isDefault: false,
    editable: false,
    delete: false,
    belongsTo: null,
    backendType: "Mixed",
    isTableField: false,
    isView: false,
    options: [
      {
        name: "Open",
        value: "Open",
      },
      {
        name: "Parking",
        value: "Parking",
      },
      {
        name: "Waiting",
        value: "Waiting",
      },
      {
        name: "Booked",
        value: "Booked",
      },
      {
        name: "Sealed",
        value: "Sealed",
      },
    ],
    validation: [
      {
        require: true,
        message: "",
      },
    ],
  },
  {
    name: "communicationTool",
    label: "Communication Tool",
    type: "select",
    fixed: true,
    isDefault: false,
    editable: false,
    delete: false,
    belongsTo: null,
    backendType: "Mixed",
    isTableField: true,
    isView: false,
    options: [
      {
        name: "WhatsApp",
        value: "WhatsApp",
      },
      {
        name: "Email",
        value: "Email",
      },
      {
        name: "Virtual Meet",
        value: "Virtual Meet",
      },
      {
        name: "Visit",
        value: "Visit",
      },
      {
        name: "Virtual Meet",
        value: "Virtual Meet",
      },
    ],
    validation: [
      {
        require: true,
        message: "Communication Tool is Required",
      },
    ],
  },
  {
    name: "listedFor",
    label: "Listed for",
    type: "select",
    fixed: true,
    isDefault: false,
    editable: false,
    delete: false,
    belongsTo: null,
    backendType: "Mixed",
    isTableField: false,
    isView: false,
    options: [
      {
        name: "Rent",
        value: "Rent",
      },
      {
        name: "Buy",
        value: "Buy",
      },
    ],
    validation: [
      {
        require: true,
        message: "Listed for is Required",
      },
    ],
  },
  {
    name: "associatedListing",
    label: "Associated Listing",
    type: "select",
    fixed: true,
    isDefault: false,
    editable: false,
    delete: false,
    ref: "Properties",
    belongsTo: null,
    backendType: "Mixed",
    isTableField: false,
    isView: false,
    options: [
      {
        name: "From Project 1",
        value: "From Project 1",
      },
      {
        name: "Project 2",
        value: "Project 2",
      },
      {
        name: "Project 3",
        value: "Project 3",
      },
    ],
    validation: [
      {
        require: false,
        message: "",
      },
    ],
  },
  {
    name: "assignUser",
    label: "Assign to User",
    type: "select",
    fixed: true,
    isDefault: false,
    editable: false,
    delete: false,
    ref: "User",
    belongsTo: null,
    backendType: "Mixed",
    isTableField: false,
    isView: false,
    options: [
      {
        name: "From Project 1",
        value: "From Project 1",
      },
      {
        name: "Project 2",
        value: "Project 2",
      },
      {
        name: "Project 3",
        value: "Project 3",
      },
    ],
    validation: [
      {
        require: false,
        message: "",
      },
    ],
  },
  {
    name: "leadMessage",
    label: "Lead Message",
    type: "text",
    fixed: true,
    isDefault: false,
    editable: false,
    delete: false,
    belongsTo: null,
    backendType: "Mixed",
    isTableField: false,
    isView: false,
    options: [
      {
        name: "",
        value: "",
      },
      {
        name: "",
        value: "",
      },
    ],
    validation: [
      {
        require: false,
        message: "",
      },
    ],
  },
  {
    name: "propertyType",
    label: "Property Type",
    type: "select",
    fixed: true,
    isDefault: false,
    editable: false,
    delete: false,
    belongsTo: null,
    backendType: "Mixed",
    isTableField: true,
    isView: false,
    options: [
      {
        name: "Apartment",
        value: "Apartment",
      },
      {
        name: "Land",
        value: "Land",
      },
      {
        name: "Manssonnate",
        value: "Manssonnate",
      },
    ],
    validation: [
      {
        require: true,
        message: "Property Type is Required",
      },
    ],
  },
];
exports.leadFields = leadFields;
