import { useEffect, useState } from "react";
import { getApi } from "services/api";
import Calender from './components/calender';


const Index = () => {

    const [data, setData] = useState([])
    const user = JSON.parse(localStorage.getItem("user"))


    const fetchData = async () => {
        let result = await getApi(user.role === 'superAdmin' ? 'api/task/' : `api/task/?createBy=${user._id}`);
        setData(result.data);
    }

    useEffect(() => {
        fetchData()
    }, [])


    return (
        <Calender fetchData={fetchData} data={data} />
    )
}

export default Index
