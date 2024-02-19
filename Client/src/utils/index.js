import * as yup from 'yup'

// export const generateValidationSchema = (fields) => {
//     return fields.reduce((acc, field) => {
//         acc[field.name] = field.validation.reduce((fieldAcc, rule) => {
//             if (rule.require) {
//                 fieldAcc = fieldAcc.required(rule.message);
//             }
//             if (rule.min) {
//                 fieldAcc = fieldAcc.min(rule.value, rule.message);
//             }
//             if (rule.max) {
//                 fieldAcc = fieldAcc.max(rule.value, rule.message);
//             }
//             if (rule.match) {
//                 const data = new RegExp(rule.value)
//                 const fieldAcc1 = data.test(rule.value);

//                 // fieldAcc = fieldAcc.matches(data, rule.message);
//                 if (!fieldAcc1) {
//                     // If the string doesn't match the regular expression, handle the error or validation failure
//                     console.error(rule.message);
//                 }
//             }
//             // if (rule.formikType) {
//             //     fieldAcc = yup.formikType() || yup.string()
//             // }
//             if (rule.formikType === 'date') {
//                 fieldAcc = fieldAcc.required(rule.message);
//             }
//             // if (rule.formikType === 'email') {
//             //     fieldAcc = fieldAcc.required(rule.message);
//             // }
//             return fieldAcc;
//         }, yup.string());

//         return acc;
//     }, {});
// };

export const generateValidationSchema = (fields) => {
    return fields?.reduce((acc, field) => {
        // let formikValObj = field?.validation?.find(obj => obj?.hasOwnProperty('formikType'));

        acc[field.name] = field.validation.reduce((fieldAcc, rule) => {
            if (rule.require) {
                fieldAcc = fieldAcc.required(rule.message);
            }
            if (rule.min) {
                fieldAcc = fieldAcc.min(rule.value, rule.message);
            }
            if (rule.max) {
                fieldAcc = fieldAcc.max(rule.value, rule.message);
            }
            if (rule.match) {
                const regexPattern = rule?.value?.replace(/^\/|\/$/g, ''); // Remove leading and trailing slashes
                const regex = new RegExp(regexPattern);
                fieldAcc = fieldAcc.matches(regex, rule.message);
            }
            if (rule.formikType === 'date') {
                fieldAcc = fieldAcc.required(rule.message);
            }
            // Add other formikType cases as needed

            return fieldAcc;
        }, yup.string());
        // }, (formikValObj && formikValObj?.formikType) ? yup?.[formikValObj?.formikType]() : yup.string());

        let fieldValidation;
        let formikValidation = field?.validation?.find(obj => obj?.hasOwnProperty('formikType'));
        let fieldFormikType = formikValidation?.formikType?.toLowerCase();

        if (fieldFormikType === 'string') {
            fieldValidation = yup.string()
        } else if (fieldFormikType === 'email') {
            fieldValidation = yup.string().email()
        } else if (fieldFormikType === 'date') {
            fieldValidation = yup.date()
        } else if (fieldFormikType === 'number') {
            fieldValidation = yup.number()
        } else if (fieldFormikType === 'object') {
            fieldValidation = yup.object()
        } else if (fieldFormikType === 'array') {
            fieldValidation = yup.array()
        } else if (fieldFormikType === 'url') {
            fieldValidation = yup.string().url()
        } else if (fieldFormikType === 'boolean') {
            fieldValidation = yup.boolean()
        } else if (fieldFormikType === 'positive') {
            fieldValidation = yup.number().positive()
        } else if (fieldFormikType === "negative") {
            fieldValidation = yup.number().negative()
        } else if (fieldFormikType === "integer") {
            fieldValidation = yup.number().integer()
        } else {
            fieldValidation = yup.string()
        }

        if (field.validation && Array.isArray(field.validation)) {
            field.validation.forEach((validationRule) => {

                if (validationRule.require) {
                    fieldValidation = fieldValidation.required(validationRule.message || 'This field is required');
                }
                if (validationRule.min) {
                    fieldValidation = fieldValidation.min(validationRule.value, validationRule.message || (fieldFormikType === 'date' ? "Date is too small" : 'Value is too small'));
                }
                if (validationRule.max) {
                    fieldValidation = fieldValidation.max(validationRule.value, validationRule.message || (fieldFormikType === 'date' ? "Date is too large" : 'Value is too large'));
                }
                if (validationRule.match) {
                    fieldValidation = fieldValidation.matches(
                        new RegExp(validationRule.match),
                        validationRule.message || 'Value does not match the pattern'
                    );
                }
                if (validationRule?.formikType && validationRule?.message) {
                    fieldValidation = fieldValidation.typeError(validationRule.message)
                }
            });
        }

        return {
            ...acc,
            [field.name]: fieldValidation,
        };

    }, {})
};