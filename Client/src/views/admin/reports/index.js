import Card from "components/card/Card";
import { useEffect, useState } from 'react';
import 'react-datepicker/dist/react-datepicker.css';
import { getApi } from 'services/api';
import CheckTable from "./components/CheckTable";
import ReportChart from './components/reportChart';

const Report = () => {
    const [data, setData] = useState([])
    const [isLoding, setIsLoding] = useState(false)

    const user = JSON.parse(localStorage.getItem("user"))

    const tableColumns = [
        { Header: 'Email Sent', accessor: 'emailsent' },
        { Header: "Outbound Calls", accessor: "outboundcall" },
    ];

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


    useEffect(() => {
        fetchData()
    }, [])

    return (
        <div>
            <ReportChart />
            <Card mt={4}>
                <CheckTable columnsData={tableColumns} barData={data} isLoding={isLoding} />
            </Card>
        </div>
    )
}

export default Report
