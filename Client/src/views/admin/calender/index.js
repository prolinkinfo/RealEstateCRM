import { useEffect, useState } from "react";
import { getApi } from "services/api";
import Calender from './components/calender';


const Index = () => {

    const [data, setData] = useState([])
    const user = JSON.parse(localStorage.getItem("user"))


    const fetchTaskData = async () => {
        let result = await getApi(user?.role === 'superAdmin' ? 'api/task/' : `api/task/?createBy=${user._id}`);
        return result?.data?.map(item => ({
            id: item?._id,
            title: item?.title,
            start: item?.start,
            end: item?.end,
            textColor: item?.textColor,
            backgroundColor: item?.backgroundColor,
            borderColor: item?.borderColor,
            url: item?.url,
            allDay: item?.allDay,
            groupId: "task"
        }));
    }

    const fetchCallData = async () => {
        let result = await getApi(user?.role === 'superAdmin' ? 'api/phoneCall' : `api/phoneCall?sender=${user._id}`);
        return result?.data?.map(item => ({
            id: item?._id,
            title: item?.senderName,
            start: item?.startDate,
            backgroundColor: "green",
            groupId: "call"
        }));
    }

    const fetchMeetingData = async () => {
        let result = await getApi(user?.role === 'superAdmin' ? 'api/meeting' : `api/meeting?createdBy=${user._id}`);
        return result?.data?.map(item => ({
            id: item?._id,
            title: item?.agenda,
            start: item?.dateTime,
            backgroundColor: "red",
            groupId: "meeting"
        }));
    }

    const fetchEmailData = async () => {
        let result = await getApi(user.role === 'superAdmin' ? 'api/email/' : `api/email/?sender=${user._id}`);
        return result?.data?.map(item => ({
            id: item?._id,
            title: item?.subject,
            start: item?.startDate,
            end: item?.endDate,
            backgroundColor: "blue",
            groupId: "email"
        }));
    }

    const fetchData = async () => {
        const taskApiData = await fetchTaskData();
        const meetingApiData = await fetchMeetingData();
        const callApiData = await fetchCallData();
        const emailApiData = await fetchEmailData();
        const combinedData = [...taskApiData, ...meetingApiData, ...callApiData, ...emailApiData];
        setData(combinedData);
    };

    useEffect(() => {
        fetchData();
    }, [])

    return (
        <>
            <Calender fetchData={fetchData} data={data} />
        </>
    )
}

export default Index
