const contactFields = [
    {
        "name": "fullName",
        "label": "Full Name",
        "type": "text",
        "fixed": true,
        "delete": false,
        "belongsTo": null,
        "backendType": "String",
        "editable": false,
        "isTableField": true,
        "options": [],
        "validation": [
            {
                "require": true,
                "message": "",
            },
        ],
    },
    {
        "name": "email",
        "label": "Email",
        "type": "email",
        "fixed": true,
        "delete": false,
        "belongsTo": null,
        "backendType": "String",
        "isTableField": true,
        "options": [],
        "validation": [
            {
                "require": true,
                "message": "",
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
    {
        "name": "phoneNumber",
        "label": "Phone Number",
        "type": "tel",
        "fixed": true,
        "delete": false,
        "belongsTo": null,
        "backendType": "Number",
        "isTableField": true,
        "options": [],
        "validation": [
            {
                "require": true,
                "message": "",
            },
        ],
    },
];
exports.contactFields = contactFields;
