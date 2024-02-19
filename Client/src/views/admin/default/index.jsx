// Chakra imports
import {
  Flex,
  Heading,
  Icon,
  IconButton,
  SimpleGrid,
  useColorModeValue,
  Grid,
  GridItem,
  Progress,
  Box,
  Text,
} from "@chakra-ui/react";
// Assets
// Custom components
import { ViewIcon } from "@chakra-ui/icons";
import Card from "components/card/Card";
import MiniStatistics from "components/card/MiniStatistics";
import IconBox from "components/icons/IconBox";
import { HSeparator } from "components/separator/Separator";
import { useEffect, useState } from "react";
import { LuBuilding2 } from "react-icons/lu";
import { MdAddTask, MdContacts, MdLeaderboard } from "react-icons/md";
import { Link, useNavigate } from "react-router-dom";
import { getApi } from "services/api";
import ReportChart from "../reports/components/reportChart";
import Chart from "components/charts/LineChart.js";
// import Chart from "../reports/components/chart";
import { HasAccess } from "../../../redux/accessUtils";
import PieChart from "components/charts/PieChart";
import ReactApexChart from 'react-apexcharts';
import CountUpComponent from "../../../../src/components/countUpComponent/countUpComponent";

export default function UserReports() {
  // Chakra Color Mode
  const brandColor = useColorModeValue("brand.500", "white");
  const boxBg = useColorModeValue("secondaryGray.300", "whiteAlpha.100");
  const user = JSON.parse(localStorage.getItem("user"));

  const [task, setTask] = useState([]);
  const [contactData, setContactData] = useState([]);
  const [leadData, setLeadData] = useState([]);
  const [data, setData] = useState([]);
  const [propertyData, setPropertyData] = useState([]);
  const navigate = useNavigate();
  const [contactsView, taskView, leadView, proprtyView, emailView, callView, meetingView] = HasAccess(["Contacts", "Task", "Lead", "Property", "Email", "Call", "Meeting"]);

  const options = {
    chart: {
      height: 350,
      type: 'radialBar',
    },
    plotOptions: {
      radialBar: {
        dataLabels: {
          name: {
            fontSize: '22px',
          },
          value: {
            fontSize: '16px',
          },
          total: {
            show: true,
            label: 'Total',
            formatter: function () {
              return 249;
            }
          }
        }
      }
    },
    labels: ['Apples', 'Oranges', 'Bananas', 'Berries'],
  };

  const options4 = {
    chart: {
      type: 'radialBar',
      height: 350,
      width: 380,
    },
    plotOptions: {
      radialBar: {
        size: undefined,
        inverseOrder: true,
        hollow: {
          margin: 40,
          size: '48%',
          background: 'transparent',

        },
        dataLabels: {
          name: {
            fontSize: '22px',
          },
          value: {
            fontSize: '16px',
          },
          total: {
            show: true,
            label: 'Total',
            formatter: function () {
              return 249;
            }
          }
        },
        track: {
          show: false,
        },
        startAngle: -180,
        endAngle: 180

      },
    },
    stroke: {
      lineCap: 'round'
    },
    labels: ['June', 'May', 'April'],
    legend: {
      show: true,
      floating: true,
      position: 'right',
      offsetX: 152,
      offsetY: 215
    },
  }

  const fetchData = async () => {
    let taskData;
    // setTimeout(async () => {
    if (user.role === "superAdmin") {
      taskData = await getApi("api/task/")
    } else if (taskView?.create || taskView?.update || taskView?.delete || taskView?.view) {
      taskData = await getApi(`api/task/?createBy=${user._id}`)
    }
    setTask(taskData?.data);
    // }, 4000);
    let contact;
    // setTimeout(async () => {
    if (user.role === "superAdmin") {
      contact = await getApi("api/contact/")
    } else if (contactsView?.create || contactsView?.update || contactsView?.delete || contactsView?.view) {
      contact = await getApi(`api/contact/?createBy=${user._id}`)
    }
    setContactData(contact?.data);
    // }, 4000);
    let lead;
    // setTimeout(async () => {
    if (user.role === "superAdmin") {
      lead = await getApi("api/lead/")
    } else if (leadView?.create || leadView?.update || leadView?.delete || leadView?.view) {
      lead = await getApi(`api/lead/?createBy=${user._id}`)
    }
    setLeadData(lead?.data);
    // }, 4000);
    let property;
    // setTimeout(async () => {
    if (user.role === "superAdmin") {
      property = await getApi("api/property/")
    } else if (proprtyView?.create || proprtyView?.update || proprtyView?.delete || proprtyView?.view) {
      property = await getApi(`api/property/?createBy=${user._id}`)
    }
    setPropertyData(property?.data);
    // }, 4000);
  };
  useEffect(() => {
    fetchData();
  }, []);

  const fetchProgressChart = async () => {
    let result = await getApi(user.role === 'superAdmin' ? 'api/reporting/line-chart' : `api/reporting/line-chart?createBy=${user._id}`);
    if (result && result.status === 200) {
      setData(result?.data)
    }
  }
  useEffect(() => {
    fetchProgressChart()
  }, [])

  const taskStatus = [
    {
      name: "Completed",
      status: 'completed',
      length: task && task?.length > 0 && task?.filter(item => item?.status === "completed")?.length || 0,
      color: "#4d8f3a"
    },
    {
      name: "Pending",
      status: 'pending',
      length: task && task?.length > 0 && task?.filter(item => item?.status === "pending")?.length || 0,
      color: "#a37f08"
    },
    {
      name: "In Progress",
      status: 'inProgress',
      length: task && task?.length > 0 && task?.filter(item => item?.status === "inProgress")?.length || 0,
      color: "#7038db"
    },
    {
      name: "Todo",
      status: 'todo',
      length: task && task?.length > 0 && task?.filter(item => item?.status === "todo")?.length || 0,
      color: "#1f7eeb"
    },
    {
      name: "On Hold",
      status: 'onHold',
      length: task && task?.length > 0 && task?.filter(item => item?.status === "onHold")?.length || 0,
      color: "#DB5436"
    },
  ]

  return (
    <>
      <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} gap="20px" mb="20px">
        {/* , "2xl": 6 */}
        {(taskView?.create || taskView?.update || taskView?.delete || taskView?.view) &&
          <MiniStatistics
            onClick={() => navigate("/task")}
            startContent={
              <IconBox
                w="56px"
                h="56px"
                bg="linear-gradient(90deg, #4481EB 0%, #04BEFE 100%)"
                icon={<Icon w="28px" h="28px" as={MdAddTask} color="white" />}
              />
            }
            name="Tasks"
            value={task?.length || 0}
          />}
        {(contactsView?.create || contactsView?.update || contactsView?.delete || contactsView?.view) &&
          <MiniStatistics
            onClick={() => navigate("/contacts")}
            startContent={
              <IconBox
                w="56px"
                h="56px"
                bg={boxBg}
                icon={
                  <Icon w="32px" h="32px" as={MdContacts} color={brandColor} />
                }
              />
            }
            name="Contacts"
            value={contactData?.length || 0}
          />}
        {(leadView?.create || leadView?.update || leadView?.delete || leadView?.view) &&
          <MiniStatistics
            onClick={() => navigate("/lead")}
            startContent={
              <IconBox
                w="56px"
                h="56px"
                bg={boxBg}
                icon={
                  <Icon w="32px" h="32px" as={MdLeaderboard} color={brandColor} />
                }
              />
            }
            name="Leads"
            value={leadData?.length || 0}
          />}
        {(proprtyView?.create || proprtyView?.update || proprtyView?.delete || proprtyView?.view) &&
          <MiniStatistics
            onClick={() => navigate("/properties")}
            startContent={
              <IconBox
                w="56px"
                h="56px"
                bg={boxBg}
                icon={
                  <Icon w="32px" h="32px" as={LuBuilding2} color={brandColor} />
                }
              />
            }
            name="Property"
            value={propertyData?.length || 0}
          />}
      </SimpleGrid>

      <Grid Grid templateColumns="repeat(12, 1fr)" gap={3} >
        {/* <GridItem rowSpan={2} colSpan={{ base: 12, md: 6 }}>
          <Card>
            <ReactApexChart options={options} series={[44, 55, 67, 83]} type="radialBar" height={350} />
          </Card>
        </GridItem>
        <GridItem rowSpan={2} colSpan={{ base: 12, md: 6 }}>
          <Card>
            <ReactApexChart options={options4} series={[71, 63, 77]} type="radialBar" height={350} />
          </Card>
        </GridItem> */}
        <GridItem rowSpan={2} colSpan={{ base: 12, md: 6 }}>
          <Card>
            <Flex mb={3} alignItems={"center"} justifyContent={"space-between"}>
              <Heading size="md">Report</Heading>
              <IconButton
                color={"green.500"}
                onClick={() => navigate("/reporting-analytics")}
                aria-label="Call Fred"
                borderRadius="10px"
                size="md"
                icon={<ViewIcon />}
              />
            </Flex>
            <HSeparator />
            <ReportChart dashboard={"dashboard"} />
          </Card>
        </GridItem>
        <GridItem rowSpan={2} colSpan={{ base: 12, md: 6 }}>
          <Card>
            <Flex mb={5} alignItems={"center"} justifyContent={"space-between"}>
              <Heading size="md">Report</Heading>

            </Flex>
            <Box mb={3}>
              <HSeparator />
            </Box>
            <Chart dashboard={"dashboard"} data={data} />
          </Card>
        </GridItem>
      </Grid>
      <SimpleGrid gap="20px" columns={{ base: 1, md: 2, lg: 3 }} my="20px">

        <Card >
          <Heading size="md" pb={3}>Statistics</Heading>
          {data && data.length > 0 && data?.map((item, i) => (
            <>
              {((item.name === 'Lead' && (leadView?.create || leadView?.update || leadView?.delete || leadView?.view)) ||
                (item.name === 'Contact' && (contactsView?.create || contactsView?.update || contactsView?.delete || contactsView?.view)) ||
                (item.name === 'Meeting' && (meetingView?.create || meetingView?.update || meetingView?.delete || meetingView?.view)) ||
                (item.name === 'Call' && (callView?.create || callView?.update || callView?.delete || callView?.view)) ||
                (item.name === 'Email' && (emailView?.create || emailView?.update || emailView?.delete || emailView?.view)) ||
                (item.name === 'Property' && (proprtyView?.create || proprtyView?.update || proprtyView?.delete || proprtyView?.view)) ||
                (item.name === 'Task' && (taskView?.create || taskView?.update || taskView?.delete || taskView?.view))
              )
                &&
                <Box border={"1px solid #e5e5e5"} p={2} m={1} key={i}>
                  <Flex justifyContent={"space-between"}>
                    <Text fontSize="sm" fontWeight={600} pb={2}>{item?.name}</Text>
                    <Text fontSize="sm" fontWeight={600} pb={2}><CountUpComponent targetNumber={item?.length} /></Text>
                  </Flex>
                  <Progress
                    colorScheme={item?.color}
                    size='xs' value={item?.length} width={"100%"} />
                </Box>
              }
            </>

          ))}
        </Card>

        <Card>
          <Heading size="md" pb={2}>Lead Statistics</Heading>
          {(leadView?.create || leadView?.update || leadView?.delete || leadView?.view) &&
            <Grid templateColumns="repeat(12, 1fr)" gap={2}>
              <GridItem colSpan={{ base: 12, md: 6 }}>
                <Box backgroundColor={"#ebf5ff"}
                  borderRadius={"10px"}
                  cursor={"pointer"}
                  onClick={() => navigate('/lead')}
                  p={2} m={1} textAlign={"center"}>
                  <Heading size="sm" pb={3} color={"#1f7eeb"}>Total Leads </Heading>
                  <Text fontWeight={600} color={"#1f7eeb"}><CountUpComponent targetNumber={leadData?.length || 0} /> </Text>
                </Box>
              </GridItem>
              <GridItem colSpan={{ base: 12, md: 6 }}>
                <Box backgroundColor={"#eaf9e6"}
                  borderRadius={"10px"}
                  cursor={"pointer"}
                  onClick={() => navigate('/lead', { state: 'active' })}
                  p={2} m={1} textAlign={"center"}>
                  <Heading size="sm" pb={3} color={"#43882f"} >Active Leads </Heading>
                  <Text fontWeight={600} color={"#43882f"}><CountUpComponent targetNumber={leadData && leadData.length > 0 && leadData?.filter(lead => lead?.leadStatus === "active")?.length || 0} /></Text>
                </Box>
              </GridItem>
              <GridItem colSpan={{ base: 12, md: 6 }}>
                <Box backgroundColor={"#fbf4dd"}
                  onClick={() => navigate('/lead', { state: 'pending' })}
                  borderRadius={"10px"}
                  cursor={"pointer"}
                  p={2} m={1} textAlign={"center"}>
                  <Heading size="sm" pb={3} color={"#a37f08"}>Pending Leads</Heading>
                  <Text fontWeight={600} color={"#a37f08"}><CountUpComponent targetNumber={leadData && leadData.length > 0 && leadData?.filter(lead => lead?.leadStatus === "pending")?.length || 0} /></Text>
                </Box>
              </GridItem>

              <GridItem colSpan={{ base: 12, md: 6 }}>
                <Box backgroundColor={"#ffeeeb"}
                  borderRadius={"10px"}
                  cursor={"pointer"}
                  onClick={() => navigate('/lead', { state: 'sold' })}
                  p={2} m={1} textAlign={"center"}>
                  <Heading size="sm" pb={3} color={"#d6401d"}>Sold Leads </Heading>
                  <Text fontWeight={600} color={"#d6401d"}><CountUpComponent targetNumber={leadData && leadData.length > 0 && leadData?.filter(lead => lead?.leadStatus === "sold")?.length || 0} /></Text>
                </Box>
              </GridItem>
            </Grid>
          }
          <Flex justifyContent={"center"}  >
            <PieChart leadData={leadData} />
          </Flex>

        </Card>

        <Card >
          <Heading size="md" pb={3}>Task Statistics</Heading>
          <Grid templateColumns="repeat(12, 1fr)" gap={2} mb={2}>
            <GridItem colSpan={{ base: 12 }}>
              <Box backgroundColor={"#ebf5ff"}
                borderRadius={"10px"}
                p={2} m={1} textAlign={"center"}>
                <Heading size="sm" pb={3} color={"#1f7eeb"}>Total Tasks </Heading>
                <Text fontWeight={600} color={"#1f7eeb"}><CountUpComponent targetNumber={task?.length || 0} /></Text>
              </Box>
            </GridItem>
          </Grid>
          {taskStatus && taskStatus.length > 0 && taskStatus?.map((item) => (
            <Box my={1.5}>
              <Flex justifyContent={"space-between"} cursor={'pointer'} onClick={() => navigate('/task', { state: item.status })} alignItems={"center"} padding={4} backgroundColor={"#0b0b0b17"} borderRadius={"10px"}>
                <Flex alignItems={"center"}>
                  <Box height={"18px"} width={"18px"} lineHeight={"18px"} textAlign={"center"} border={`1px solid ${item.color}`} display={"flex"} justifyContent={"center"} alignItems={"center"} borderRadius={"50%"} margin={"0 auto"} >
                    <Box backgroundColor={`${item.color}`} height={"10px"} width={"10px"} borderRadius={"50%"}></Box>
                  </Box>

                  <Text ps={2} fontWeight={"bold"} color={`${item.color}`}>{item.name}</Text>

                </Flex>
                <Box fontWeight={"bold"} color={`${item.color}`}><CountUpComponent targetNumber={item?.length} /></Box>
              </Flex>
            </Box>
          ))}
        </Card>
      </SimpleGrid>

    </>
  );
}
