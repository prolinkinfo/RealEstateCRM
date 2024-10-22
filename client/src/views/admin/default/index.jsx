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
import { useNavigate } from "react-router-dom";
import { getApi } from "services/api";
import ReportChart from "../reports/components/reportChart";
import Chart from "components/charts/LineChart.js";
import { HasAccess } from "../../../redux/accessUtils";
import PieChart from "components/charts/PieChart";
import CountUpComponent from "../../../../src/components/countUpComponent/countUpComponent";
import Spinner from 'components/spinner/Spinner';
import { useSelector } from "react-redux";

export default function UserReports() {
  // Chakra Color Mode
  const brandColor = useColorModeValue("brand.500", "white");
  const boxBg = useColorModeValue("secondaryGray.300", "whiteAlpha.100");
  const user = JSON.parse(localStorage.getItem("user"));
  const [isLoding, setIsLoding] = useState(false);

  const [allData, setAllData] = useState([]);
  const [data, setData] = useState([]);
  const navigate = useNavigate();
  const modules = useSelector((state) => state?.modules?.data)
  const [contactsView, taskView, leadView, proprtyView] = HasAccess(["Contacts", "Tasks", "Leads", "Properties"]);

  const fetchData = async () => {
    let responseData = await getApi(user?.role === 'superAdmin' ? `api/status/` : `api/status/?createBy=${user?._id}`);
    setAllData(responseData?.data?.data);
  };


  const fetchProgressChart = async () => {
    setIsLoding(true);
    let result = await getApi(user?.role === 'superAdmin' ? 'api/reporting/line-chart' : `api/reporting/line-chart?createBy=${user?._id}`);
    if (result && result?.status === 200) {
      setData(result?.data)
    }
    setIsLoding(false);
  }
  useEffect(() => {
    fetchProgressChart()
  }, [])


  const findModuleData = (title) => {
    const filterData = data?.find(item => item?.name === title)
    return filterData?.length || 0
  }

  const findLeadStatus = (title) => {
    const filterData = allData?.leadData?.filter(item => item?.leadStatus === title)
    return filterData?.length || 0
  }
  const findTaskStatus = (title) => {
    const filterData = allData?.taskData?.filter(item => item?.status === title)
    return filterData?.length || 0
  }

  const leadModule = modules?.find(({ moduleName }) => moduleName === "Leads")
  const contactModule = modules?.find(({ moduleName }) => moduleName === "Contacts")
  const propertiesModule = modules?.find(({ moduleName }) => moduleName === "Properties")
  const tasksModule = modules?.find(({ moduleName }) => moduleName === "Tasks")
  const reportModule = modules?.find(({ moduleName }) => moduleName === "Reporting and Analytics")
  const emailModule = modules?.find(({ moduleName }) => moduleName === "Emails")
  const callModule = modules?.find(({ moduleName }) => moduleName === "Calls")

  const taskStatus = [
    {
      name: "Completed",
      status: 'completed',
      length: findTaskStatus('completed'),
      color: "#4d8f3a"
    },
    {
      name: "Pending",
      status: 'pending',
      length: findTaskStatus('pending'),
      color: "#a37f08"
    },
    {
      name: "In Progress",
      status: 'inProgress',
      length: findTaskStatus('inProgress'),
      color: "#7038db"
    },
    {
      name: "Todo",
      status: 'todo',
      length: findTaskStatus('todo'),
      color: "#1f7eeb"
    },
    {
      name: "On Hold",
      status: 'onHold',
      length: findTaskStatus('onHold'),
      color: "#DB5436"
    },
  ]
  const navigateTo = {
    Lead: '/lead',
    Contact: '/contacts',
    Meeting: '/metting',
    Call: '/phone-call',
    Task: '/task',
    Email: '/email',
    Property: '/properties',
  };

  useEffect(() => {
    fetchData();
  }, [user?._id]);

  return (
    <>
      <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} gap="20px" mb="20px">
        {(taskView?.create || taskView?.update || taskView?.delete || taskView?.view) && (tasksModule?.isActive) &&
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
            value={findModuleData("Tasks")}
          />}
        {(contactsView?.create || contactsView?.update || contactsView?.delete || contactsView?.view) && (contactModule?.isActive) &&
          < MiniStatistics
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
            value={findModuleData("Contacts")}
          />}
        {(leadView?.create || leadView?.update || leadView?.delete || leadView?.view) && (leadModule?.isActive) &&
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
            value={findModuleData("Leads")}
          />}
        {(proprtyView?.create || proprtyView?.update || proprtyView?.delete || proprtyView?.view) && (propertiesModule?.isActive) &&
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
            value={findModuleData("Properties")}
          />}
      </SimpleGrid>

      <Grid Grid templateColumns="repeat(12, 1fr)" gap={3} >
        {
          (emailModule?.isActive || callModule?.isActive) &&
          <GridItem rowSpan={2} colSpan={{ base: 12, md: 6 }}>
            <Card>
              <Flex mb={3} alignItems={"center"} justifyContent={"space-between"}>
                <Heading size="md">{(emailModule?.isActive && callModule?.isActive) ? "Email and Call" : emailModule?.isActive ? "Email" : callModule?.isActive ? "Call" : ""} Report</Heading>
                {
                  reportModule?.isActive &&
                  <IconButton
                    color={"green.500"}
                    onClick={() => navigate("/reporting-analytics")}
                    aria-label="Call Fred"
                    borderRadius="10px"
                    size="md"
                    icon={<ViewIcon />}
                  />
                }
              </Flex>
              <HSeparator />
              <ReportChart dashboard={"dashboard"} />
            </Card>
          </GridItem>
        }
        <GridItem rowSpan={2} colSpan={{ base: 12, md: 6 }}>
          <Card>
            <Flex mb={5} alignItems={"center"} justifyContent={"space-between"}>
              <Heading size="md">Module Data Report</Heading>

            </Flex>
            <Box mb={3}>
              <HSeparator />
            </Box>
            <Chart dashboard={"dashboard"} data={data} />
          </Card>
        </GridItem>
      </Grid>
      <SimpleGrid gap="20px" columns={{
        base: 1, md: leadView?.view && taskView?.view ? 2 : 2, lg:
          leadView?.view && taskView?.view ? 3 : 2
      }} my="20px">

        {
          data && data.length > 0 &&
          <Card >
            <Heading size="md" pb={3}>Statistics</Heading>
            {
              !isLoding ?
                data && data.length > 0 && data?.map((item, i) => (
                  <>
                    <Box border={"1px solid #e5e5e5"} p={2} m={1} cursor={'pointer'} key={i} onClick={() => navigate(navigateTo[item.name])}>
                      <Flex justifyContent={"space-between"}>
                        <Text fontSize="sm" fontWeight={600} pb={2}>{item?.name}</Text>
                        <Text fontSize="sm" fontWeight={600} pb={2}><CountUpComponent targetNumber={item?.length} /></Text>
                      </Flex>
                      <Progress
                        colorScheme={item?.color}
                        size='xs' value={item?.length} width={"100%"} />
                    </Box>
                  </>

                )) : <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}><Spinner /></div>
            }
          </Card>
        }

        {leadView?.view && (leadModule?.isActive) && <Card>
          <Heading size="md" pb={2}>Lead Statistics</Heading>
          {(leadView?.view) &&
            <Grid templateColumns="repeat(12, 1fr)" gap={2}>
              <GridItem colSpan={{ base: 12, md: 6 }}>
                <Box backgroundColor={"#ebf5ff"}
                  borderRadius={"10px"}
                  cursor={"pointer"}
                  onClick={() => navigate('/lead')}
                  p={2} m={1} textAlign={"center"}>
                  <Heading size="sm" pb={3} color={"#1f7eeb"}>Total Leads </Heading>
                  <Text fontWeight={600} color={"#1f7eeb"}><CountUpComponent targetNumber={allData?.leadData?.length || 0} /> </Text>
                </Box>
              </GridItem>
              <GridItem colSpan={{ base: 12, md: 6 }}>
                <Box backgroundColor={"#eaf9e6"}
                  borderRadius={"10px"}
                  cursor={"pointer"}
                  onClick={() => navigate('/lead', { state: 'active' })}
                  p={2} m={1} textAlign={"center"}>
                  <Heading size="sm" pb={3} color={"#43882f"} >Active Leads </Heading>
                  <Text fontWeight={600} color={"#43882f"}><CountUpComponent targetNumber={findLeadStatus("active")} /></Text>
                </Box>
              </GridItem>
              <GridItem colSpan={{ base: 12, md: 6 }}>
                <Box backgroundColor={"#fbf4dd"}
                  onClick={() => navigate('/lead', { state: 'pending' })}
                  borderRadius={"10px"}
                  cursor={"pointer"}
                  p={2} m={1} textAlign={"center"}>
                  <Heading size="sm" pb={3} color={"#a37f08"}>Pending Leads</Heading>
                  <Text fontWeight={600} color={"#a37f08"}><CountUpComponent targetNumber={findLeadStatus("pending")} /></Text>
                </Box>
              </GridItem>

              <GridItem colSpan={{ base: 12, md: 6 }}>
                <Box backgroundColor={"#ffeeeb"}
                  borderRadius={"10px"}
                  cursor={"pointer"}
                  onClick={() => navigate('/lead', { state: 'sold' })}
                  p={2} m={1} textAlign={"center"}>
                  <Heading size="sm" pb={3} color={"#d6401d"}>Sold Leads </Heading>
                  <Text fontWeight={600} color={"#d6401d"}><CountUpComponent targetNumber={findLeadStatus("sold")} /></Text>
                </Box>
              </GridItem>
            </Grid>
          }
          <Flex justifyContent={"center"}  >
            <PieChart leadData={allData?.leadData} />
          </Flex>

        </Card>}

        {taskView?.view && (tasksModule?.isActive) && <Card >
          <Heading size="md" pb={3}>Task Statistics</Heading>
          <Grid templateColumns="repeat(12, 1fr)" gap={2} mb={2}>
            <GridItem colSpan={{ base: 12 }}>
              <Box backgroundColor={"#ebf5ff"}
                onClick={() => navigate('/task')}
                borderRadius={"10px"} cursor={'pointer'}
                p={2} m={1} textAlign={"center"}>
                <Heading size="sm" pb={3} color={"#1f7eeb"}>Total Tasks </Heading>
                <Text fontWeight={600} color={"#1f7eeb"}><CountUpComponent targetNumber={allData?.taskData?.length || 0} /></Text>
              </Box>
            </GridItem>
          </Grid>
          {taskStatus && taskStatus.length > 0 && taskStatus?.map((item, i) => (
            <Box my={1.5} key={i}>
              {/* <Flex justifyContent={"space-between"} cursor={'pointer'} onClick={() => navigate('/task', { state: item.status })} alignItems={"center"} padding={4} backgroundColor={"#0b0b0b17"} borderRadius={"10px"}> */}
              <Flex justifyContent={"space-between"} cursor={'pointer'} alignItems={"center"} padding={4} backgroundColor={"#0b0b0b17"} borderRadius={"10px"}>
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
        </Card>}
      </SimpleGrid>

    </>
  );
}
