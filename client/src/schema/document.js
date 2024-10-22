import * as yup from 'yup'


// Define the yup schema for the main document
export const documentSchema = yup.object().shape({
    folderName: yup.string().required('Folder Name is required'),
    filename: yup.string().min(2, 'File Name Must Be At Least 2 Characters'),
    createBy: yup.string().required()
});

