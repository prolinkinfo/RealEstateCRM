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

//                 console.log(fieldAcc1)
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
    return fields.reduce((acc, field) => {

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
            if ((rule.match) && (rule.formikType === 'email')) {
                const emailPattern = rule.pattern || /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
                fieldAcc = fieldAcc.matches(emailPattern, rule.message);
            }
            if (rule.formikType === 'date') {
                fieldAcc = fieldAcc.required(rule.message);
            }
            // Add other formikType cases as needed

            return fieldAcc;
        }, yup.string());

        return acc;
    }, {});
};

