import FullCalendar from '@fullcalendar/react';
import Card from 'components/card/Card';
import { useEffect, useState } from 'react'
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import listPlugin from '@fullcalendar/list';
import multiMonthPlugin from '@fullcalendar/multimonth';
import timeGridPlugin from '@fullcalendar/timegrid';
import { Flex, useBreakpointValue, useDisclosure } from '@chakra-ui/react';
import AddTask from 'views/admin/task/components/addTask';
import EventView from 'views/admin/task/eventView';
import MeetingView from 'views/admin/meeting/meetingView';
import CallView from 'views/admin/phoneCall/callView';
import { GoDotFill } from "react-icons/go";
import EmailView from 'views/admin/emailHistory/emailView';

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

    const { isOpen, onOpen, onClose } = useDisclosure()

    const handleDateClick = (arg) => {
        onOpen()
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
                <AddTask isOpen={isOpen} fetchData={fetchData} onClose={onClose} date={date} />
                <EventView fetchData={fetchData} isOpen={eventView} onClose={setEventView} info={taskInfo} />

                <MeetingView fetchData={fetchData} isOpen={meetingView} onClose={setMeetingView} info={meetingInfo} />
                <CallView fetchData={fetchData} isOpen={callView} onClose={setCallView} info={callInfo} />
                <EmailView fetchData={fetchData} isOpen={emailView} onClose={setEmailView} info={emailInfo}/>

                <div style={{display:"flex",justifyContent:"end"}}>
                    <Flex alignItems={"center"} fontSize={"12px"} marginRight={"10px"}>
                        <GoDotFill color='green' /> Calls
                    </Flex>
                    <Flex alignItems={"center"} fontSize={"12px"} marginRight={"10px"}>
                        <GoDotFill color='red' /> Meetings
                    </Flex>
                    <Flex alignItems={"center"} fontSize={"12px"}>
                        <GoDotFill color='blue' /> Emails
                    </Flex>
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
