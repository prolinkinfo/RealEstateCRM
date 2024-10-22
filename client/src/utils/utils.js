import * as XLSX from "xlsx";

export const commonUtils = {
    convertJsonToCsvOrExcel: ({ jsonArray, csvColumns, fileName, extension }) => {
        const csvHeader = csvColumns?.length > 0 && csvColumns?.map((col) => col?.Header);

        const csvContent = [
            csvHeader,
            ...jsonArray?.map((row) => csvColumns?.length > 0 && csvColumns?.map((col) => row[col?.accessor]))
        ];

        const ws = XLSX.utils.aoa_to_sheet(csvContent);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Sheet 1');
        XLSX.writeFile(wb, `${fileName}.${extension}`);    // .csv, .xlsx
    }
}