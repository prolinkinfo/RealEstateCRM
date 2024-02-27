import { useEffect } from 'react';

const FormDataUse = (values, formData) => {

    useEffect(() => {
        // const appendFormData = (key) => {
        //     if (formData && values[key]) {
        //         formData.append(key, values[key]);
        //     }
        // };

        // // Append each value to formData
        // appendFormData('folderName');
        // appendFormData('createBy');
        // appendFormData('filename');

        Object.entries(values).forEach(([key, value]) => {
            formData.append(key, value);
        });

        // Clean up function
        return () => {
            // Optionally, you can reset or clear the formData here if needed
        };
    }, [values, formData]);
};

export default FormDataUse;


export const commonUtils = {
    formData: (values) => {
        const formData = new FormData();

        Object.entries(values).forEach(([key, value]) => {
            formData.append(key, value);
        });
        values.files.forEach((file) => {
            formData?.append('files', file);
        });
        return formData;
    }
}