import Task from "./task";
import { useEffect, useState } from "react";
import { getApi } from "services/api";


const Index = () => {

    const [data, setData] = useState([])
    const user = JSON.parse(localStorage.getItem("user"))


    const fetchData = async () => {
        let result = await getApi(user.role === 'admin' ? 'api/task/' : `api/task/?createBy=${user._id}`);
        setData(result.data);
    }

    useEffect(() => {
        fetchData()
    }, [])


    return (
        <Task fetchData={fetchData} data={data} />
    )
}

export default Index
