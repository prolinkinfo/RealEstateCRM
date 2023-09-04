import Card from "components/card/Card";
import { useEffect, useState } from 'react';
import 'react-datepicker/dist/react-datepicker.css';
import { getApi } from 'services/api';
import CheckTable from "./components/CheckTable";
import ReportChart from './components/reportChart';

const Report = () => {
    const [data, setData] = useState([])

    const user = JSON.parse(localStorage.getItem("user"))

    const tableColumns = [
        { Header: 'Email Sent', accessor: 'emailsent' },
        { Header: "Outbound Calls", accessor: "outboundcall" },
        // { Header: "Text Sent", accessor: "textsent" },
        // { Header: "Lead Assigned", accessor: "leadAssigned" },
    ];

    if (user.role === 'admin') {
        tableColumns.unshift({
            Header: "#",
            accessor: "_id",
            isSortable: false,
            width: 10
        }, { Header: 'Name', accessor: 'firstName' })
    }


    const fetchData = async () => {
        let result = await getApi(user.role === 'admin' ? 'api/reporting' : `api/reporting?_id=${user._id}`);
        if (result && result.status === 200) {
            setData(result?.data)
        }
    }


    useEffect(() => {
        fetchData()
    }, [])

    return (
        <div>
            <ReportChart />
            <Card mt={4}>
                <CheckTable columnsData={tableColumns} barData={data} />
            </Card>
        </div>
    )
}

export default Report
