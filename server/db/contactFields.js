const contactFields = [
  {
    name: "fullName",
    label: "Full Name",
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
    name: "email",
    label: "Email",
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
    name: "phoneNumber",
    label: "Phone Number",
    type: "tel",
    fixed: true,
    delete: false,
    belongsTo: null,
    backendType: "Number",
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
    name: "campaign",
    label: "Campaign",
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
        message: "Campaign is require ",
      },
    ],
  },
  {
    name: "state",
    label: "State",
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
    name: "message",
    label: "Message",
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
  // {
  //     "name": "facebookProfile",
  //     "label": "Facebook",
  //     "type": "url",
  //     "fixed": true,
  //     "delete": false,
  //     "belongsTo": null,
  //     "backendType": "Mixed",
  //     "isTableField": false,
  //     "validation": [
  //         {
  //             "message": "Invalid type value for facebook",
  //             "formikType": "url",
  //         }
  //     ],
  // },
  // {
  //     "name": "linkedInProfile",
  //     "label": "LinkedIn Profile URL",
  //     "type": "url",
  //     "fixed": true,
  //     "delete": false,
  //     "belongsTo": null,
  //     "backendType": "Mixed",
  //     "isTableField": false,
  //     "validation": [
  //         {
  //             "message": "Invalid type value for LinkedIn Profile URL",
  //             "formikType": "url",
  //         }
  //     ],
  // },
  // {
  //     "name": "twitterHandle",
  //     "label": "Twitter Username",
  //     "type": "url",
  //     "fixed": true,
  //     "delete": false,
  //     "belongsTo": null,
  //     "backendType": "Mixed",
  //     "isTableField": false,
  //     "validation": [
  //         {
  //             "message": "Invalid type value for Twitter Username",
  //             "formikType": "url",
  //         }
  //     ],
  // },
  // {
  //     "name": "otherProfiles",
  //     "label": "Other Social Media Profiles URL",
  //     "type": "url",
  //     "fixed": true,
  //     "delete": false,
  //     "belongsTo": null,
  //     "backendType": "Mixed",
  //     "isTableField": false,
  //     "validation": [
  //         {
  //             "message": "Invalid type value for Other Social Media Profiles URL",
  //             "formikType": "url",
  //         }
  //     ],
  // },
];
exports.contactFields = contactFields;
