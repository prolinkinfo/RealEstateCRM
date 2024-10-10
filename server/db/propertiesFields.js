const propertiesFields = [
    {
        "name": "name",
        "label": "Name",
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
                "_id": "66e7b6a4e8458ca1196673ce"
            }
        ],
    },
    {
        "name": "status",
        "label": "Status",
        "type": "select",
        "fixed": false,
        "delete": false,
        "belongsTo": null,
        "backendType": "Mixed",
        "isTableField": true,
        "options": [
            {
                "name": "Available",
                "value": "Available",
            },
            {
                "name": "Booked",
                "value": "Booked",
            },
            {
                "name": "Sold",
                "value": "Sold",
            },
            {
                "name": "Blocked",
                "value": "Blocked",
            }
        ],
        "validation": [
            {
                "message": "Invalid type value for Lead Status",
                "formikType": "String",
            },
            {
                "require": true,
                "message": "",
            }
        ],
    },
];
exports.propertiesFields = propertiesFields;