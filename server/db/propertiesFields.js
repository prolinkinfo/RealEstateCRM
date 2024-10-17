const propertiesFields = [
    {
      "name": "name",
      "label": "Name",
      "type": "text",
      "fixed": true,
      "isDefault": false,
      "editable": false,
      "delete": false,
      "belongsTo": null,
      "backendType": "String",
      "isTableField": true,
      "isView": false,
      "options": [],
      "validation": [
        {
          "require": true,
          "message": ""
        }
      ]
    },
    {
      "name": "status",
      "label": "Status",
      "type": "select",
      "fixed": true,
      "isDefault": false,
      "editable": false,
      "delete": false,
      "belongsTo": null,
      "backendType": "Mixed",
      "isTableField": true,
      "isView": false,
      "options": [
        {
          "name": "Available",
          "value": "Available"
        },
        {
          "name": "Booked",
          "value": "Booked"
        },
        {
          "name": "Sold",
          "value": "Sold"
        },
        {
          "name": "Blocked",
          "value": "Blocked"
        }
      ],
      "validation": [
        {
          "message": "Invalid type value for Lead Status",
          "formikType": "String"
        },
        {
          "require": true,
          "message": ""
        }
      ]
    },
    // {
    //   "name": "Unit",
    //   "label": "Unit ",
    //   "type": "text",
    //   "fixed": true,
    //   "isDefault": false,
    //   "editable": false,
    //   "delete": false,
    //   "belongsTo": null,
    //   "backendType": "Mixed",
    //   "isTableField": false,
    //   "isView": false,
    //   "validation": [
    //     {
    //       "require": true,
    //       "message": ""
    //     }
    //   ]
    // },
    {
      "name": "Floor",
      "label": "Floor",
      "type": "number",
      "fixed": true,
      "isDefault": false,
      "editable": false,
      "delete": false,
      "belongsTo": null,
      "backendType": "Mixed",
      "isTableField": false,
      "isView": false,
      "validation": [
        {
          "require": true,
          "message": ""
        }
      ]
    }
  ];
exports.propertiesFields = propertiesFields;