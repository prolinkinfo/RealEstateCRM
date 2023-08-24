import * as yup from 'yup'


// Define the yup schema for the main document
export const documentSchema = yup.object().shape({
    folderName: yup.string().required('Folder Name is required'),
    createBy: yup.string().required()
});

