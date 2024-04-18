import FullCalendar from '@fullcalendar/react';
import Card from 'components/card/Card';
import { useEffect, useState } from 'react'
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import listPlugin from '@fullcalendar/list';
import multiMonthPlugin from '@fullcalendar/multimonth';
import timeGridPlugin from '@fullcalendar/timegrid';
import { Flex, useBreakpointValue, useDisclosure } from '@chakra-ui/react';
import EventView from 'views/admin/task/eventView';
import MeetingView from 'views/admin/meeting/meetingView';
import CallView from 'views/admin/phoneCall/callView';
import { GoDotFill } from "react-icons/go";
import EmailView from 'views/admin/emailHistory/emailView';
import { HasAccess } from '../../../../redux/accessUtils';
import AddEdit from 'views/admin/task/components/AddEdit'

const Calender = (props) => {
    const { data, fetchData } = props
    const [eventView, setEventView] = useState(false)
    const [meetingView, setMeetingView] = useState(false)
    const [callView, setCallView] = useState(false)
    const [emailView, setEmailView] = useState(false)
    const [taskInfo, setTaskInfo] = useState()
    const [meetingInfo, setMeetingInfo] = useState()
    const [callInfo, setCallInfo] = useState()
    const [emailInfo, setEmailInfo] = useState()
    const [date, setDate] = useState()
    const [taskAccess, meetingAccess, callAccess, emailAccess] = HasAccess(['Tasks', 'Meetings', 'Calls', 'Emails']);
    // const { isOpen, onOpen, onClose } = useDisclosure()
    const [taskModel, setTaskModel] = useState(false);

    const user = JSON.parse(localStorage.getItem("user"))

    const handleDateClick = (arg) => {
        setTaskModel(true)
        setDate(arg.dateStr)
    }

    function handleEventClick(info) {
        if (info.event.url) {
            info.jsEvent.preventDefault();
            window.open(info.event.url);
        }

        if (info?.event?.groupId === "task") {
            setTaskInfo(info)
            setEventView(true)
        } else if (info?.event?.groupId === "call") {
            setCallInfo(info)
            setCallView(true)
        } else if (info?.event?.groupId === "meeting") {
            setMeetingInfo(info)
            setMeetingView(true)
        } else if (info?.event?.groupId === "email") {
            setEmailInfo(info)
            setEmailView(true)
        }
    }
    const [currentView, setCurrentView] = useState('');

    useEffect(() => {
        setCurrentView('dayGridMonth');
    }, []);
    return (
        <div>
            <Card >
                {(taskAccess?.view || user?.role === "superAdmin") && <AddEdit isOpen={taskModel} onClose={setTaskModel} fetchData={fetchData} userAction={'add'} />}
                <EventView fetchData={fetchData} isOpen={eventView} onClose={setEventView} info={taskInfo} />
                <MeetingView fetchData={fetchData} isOpen={meetingView} onClose={setMeetingView} info={meetingInfo} />
                <CallView fetchData={fetchData} isOpen={callView} onClose={setCallView} info={callInfo} />
                <EmailView fetchData={fetchData} isOpen={emailView} onClose={setEmailView} info={emailInfo} />

                <div style={{ display: "flex", justifyContent: "end" }}>
                    {
                        (callAccess?.create || user?.role === "superAdmin") &&
                        <Flex alignItems={"center"} fontSize={"14px"} marginRight={"10px"}>
                            <GoDotFill color='green' fontSize={"18px"} /> Calls
                        </Flex>
                    }
                    {
                        (meetingAccess?.create || user?.role === "superAdmin") &&
                        <Flex alignItems={"center"} fontSize={"14px"} marginRight={"10px"}>
                            <GoDotFill color='red' fontSize={"18px"} /> Meetings
                        </Flex>
                    }
                    {
                        (emailAccess?.create || user?.role === "superAdmin") &&
                        <Flex alignItems={"center"} fontSize={"14px"}>
                            <GoDotFill color='blue' fontSize={"18px"} /> Emails
                        </Flex>
                    }
                </div>
                <FullCalendar
                    plugins={[dayGridPlugin, timeGridPlugin, listPlugin, interactionPlugin, multiMonthPlugin]}
                    initialView={currentView}
                    height="600px"
                    dateClick={handleDateClick}
                    events={data}
                    headerToolbar={{
                        left: 'prev,next today',
                        center: 'title',
                        right: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek,multiMonthFourMonth'
                    }}
                    eventClick={handleEventClick}
                    buttonText={{
                        today: 'Today',
                        dayGridMonth: 'Month',
                        timeGridWeek: 'Week',
                        timeGridDay: 'Day',
                        listWeek: 'List',
                    }}
                    views={{
                        multiMonthFourMonth: {
                            type: 'multiMonth',
                            buttonText: 'Multi Month',
                            duration: { months: useBreakpointValue({ base: 4, lg: 4, xl: 6 }) },
                        }
                    }}
                    eventClassNames="custom-fullcalendar"
                />

            </Card>
        </div>
    )
}

export default Calender
