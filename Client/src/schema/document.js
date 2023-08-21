import * as yup from 'yup'

const fileSchema = yup.object().shape({
    fileName: yup.string().required('File Name is required'),
});

// Define the yup schema for the main document
export const documentSchema = yup.object().shape({
    folderName: yup.string().required('Folder Name is required'),
    // files: yup.array(),
    createBy: yup.string().required()
});

