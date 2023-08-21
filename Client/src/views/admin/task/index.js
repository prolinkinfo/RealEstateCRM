import { Tab, TabList, TabPanel, TabPanels, Tabs } from "@chakra-ui/react";
import Calender from './components/calender';
import Task from "./task";
import { useEffect, useState } from "react";
import { getApi } from "services/api";


const Index = () => {

    const [data, setData] = useState([])
    const user = JSON.parse(localStorage.getItem("user"))


    const fetchData = async () => {
        let result = await getApi(user.role === 'admin' ? 'api/task/' : `api/task/?createBy=${user._id}`);
        // let result = await getApi('api/task/');

        setData(result.data);
    }

    useEffect(() => {
        fetchData()
    }, [])


    return (
        <Tabs >
            <TabList sx={{ '& button:focus': { boxShadow: 'none', }, }}>
                <Tab>Calender</Tab>
                <Tab >Task</Tab>
            </TabList>

            <TabPanels>
                <TabPanel>
                    <Calender fetchData={fetchData} data={data} />
                </TabPanel>
                <TabPanel>
                    <Task fetchData={fetchData} data={data} />
                </TabPanel>
            </TabPanels>
        </Tabs>
    )
}

export default Index
