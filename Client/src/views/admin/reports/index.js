import Card from "components/card/Card";
import { useEffect, useState } from 'react';
import 'react-datepicker/dist/react-datepicker.css';
import { getApi } from 'services/api';
import ReportChart from './components/reportChart';
import CommonCheckTable from "components/reactTable/checktable";

const Report = () => {
    const title = 'Reports'
    const [data, setData] = useState([])
    const [isLoding, setIsLoding] = useState(false)
    const [selectedValues, setSelectedValues] = useState([]);
    // const [selectedColumns, setSelectedColumns] = useState([]);
    // const [columns, setColumns] = useState([]);

    const user = JSON.parse(localStorage.getItem("user"))

    const tableColumns = [
        { Header: 'Email Sent', accessor: 'emailsent' },
        { Header: "Outbound Calls", accessor: "outboundcall" },
    ];

    // const fetchCustomDataFields = async () => {
    //     const tempTableColumns = [
    //         { Header: '#', accessor: '_id' },
    //         { Header: 'Name', accessor: 'firstName' },
    //         { Header: 'Email Sent', accessor: 'emailsent' },
    //         { Header: "Outbound Calls", accessor: "outboundcall" },
    //     ];
    //     // setSelectedColumns(JSON.parse(JSON.stringify(tempTableColumns)));
    // }

    if (user.role === 'superAdmin') {
        tableColumns.unshift({
            Header: "#",
            accessor: "_id",
            isSortable: false,
            width: 10
        }, { Header: 'Name', accessor: 'firstName' })
    }

    const fetchData = async () => {
        setIsLoding(true)
        let result = await getApi(user.role === 'superAdmin' ? 'api/reporting' : `api/reporting?_id=${user._id}`);
        if (result && result.status === 200) {
            setData(result?.data)
        }
        setIsLoding(false)
    }

    // const [columns, setColumns] = useState([...tableColumns]);
    // const [selectedColumns, setSelectedColumns] = useState([...tableColumns]);
    // const dataColumn = tableColumns?.filter(item => selectedColumns?.find(colum => colum?.Header === item.Header))
    useEffect(() => {
        fetchData()
        // fetchCustomDataFields()
    }, [])

    return (
        <div>
            <ReportChart />
            <Card mt={4}>
                <CommonCheckTable
                    title={title}
                    isLoding={isLoding}
                    columnData={tableColumns ?? []}
                    // dataColumn={dataColumn ?? []}
                    allData={data ?? []}
                    tableData={data}
                    AdvanceSearch={false}
                    checkBox={false}
                    tableCustomFields={[]}
                    deleteMany={true}
                // selectedValues={selectedValues}
                // setSelectedValues={setSelectedValues}
                // selectedColumns={selectedColumns}
                // setSelectedColumns={setSelectedColumns}
                />
            </Card>
        </div>
    )
}

export default Report
