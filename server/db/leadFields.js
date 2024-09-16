const leadFields = [
    {
        "name": "leadName",
        "label": "Lead Name",
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
        "name": "leadStatus",
        "label": "Lead Status",
        "type": "select",
        "fixed": false,
        "delete": false,
        "belongsTo": null,
        "backendType": "Mixed",
        "isTableField": true,
        "options": [
            {
                "name": "Active",
                "value": "active",
            },
            {
                "name": "Pending",
                "value": "pending",
            },
            {
                "name": "Sold",
                "value": "sold",
            }
        ],
        "validation": [
            {
                "message": "Invalid type value for Lead Status",
                "formikType": "String",
            }
        ],
    },
    {
        "name": "leadEmail",
        "label": "Lead Email",
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
    {
        "name": "leadPhoneNumber",
        "label": "Lead Phone Number",
        "type": "tel",
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
];
exports.leadFields = leadFields;
