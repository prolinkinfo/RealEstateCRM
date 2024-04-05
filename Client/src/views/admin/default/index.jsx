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
// import Chart from "../reports/components/chart";
import { HasAccess } from "../../../redux/accessUtils";
import PieChart from "components/charts/PieChart";
import CountUpComponent from "../../../../src/components/countUpComponent/countUpComponent";
import Spinner from 'components/spinner/Spinner';

export default function UserReports() {
  // Chakra Color Mode
  const brandColor = useColorModeValue("brand.500", "white");
  const boxBg = useColorModeValue("secondaryGray.300", "whiteAlpha.100");
  const user = JSON.parse(localStorage.getItem("user"));
  const [isLoding, setIsLoding] = useState(false);

  const [allData, setAllData] = useState([]);
  const [data, setData] = useState([]);
  const navigate = useNavigate();
  const [contactsView, taskView, leadView, proprtyView, emailView, callView, meetingView] = HasAccess(["Contacts", "Tasks", "Leads", "Properties", "Emails", "Calls", "Meetings"]);

  const fetchData = async () => {
    let responseData;
    if (user?.role === "superAdmin") {
      responseData = await getApi("api/status/");
    } else if (leadView?.create || leadView?.update || leadView?.delete || leadView?.view) {
      responseData = await getApi(`api/status/?createBy=${user?._id}`);
    }

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
            value={findModuleData("Tasks")}
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
            value={findModuleData("Contacts")}
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
            value={findModuleData("Leads")}
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
            value={findModuleData("Properties")}
          />}
      </SimpleGrid>

      <Grid Grid templateColumns="repeat(12, 1fr)" gap={3} >

        <GridItem rowSpan={2} colSpan={{ base: 12, md: 6 }}>
          <Card>
            <Flex mb={3} alignItems={"center"} justifyContent={"space-between"}>
              <Heading size="md">Email and Call Report</Heading>
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
        base: 1, md: (leadView?.create || leadView?.update || leadView?.delete || leadView?.view) && (taskView?.create || taskView?.update || taskView?.delete || taskView?.view) ? 2 : 2, lg:
          (leadView?.create || leadView?.update || leadView?.delete || leadView?.view) && (taskView?.create || taskView?.update || taskView?.delete || taskView?.view) ? 3 : 2
      }} my="20px">

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

        {(leadView?.create || leadView?.update || leadView?.delete || leadView?.view) && <Card>
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

        {(taskView?.create || taskView?.update || taskView?.delete || taskView?.view) && <Card >
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
        </Card>}
      </SimpleGrid>

    </>
  );
}
