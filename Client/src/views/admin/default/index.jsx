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

export default function UserReports() {
  // Chakra Color Mode
  const brandColor = useColorModeValue("brand.500", "white");
  const boxBg = useColorModeValue("secondaryGray.300", "whiteAlpha.100");
  const user = JSON.parse(localStorage.getItem("user"));

  const [task, setTask] = useState([]);
  const [contactData, setContactData] = useState([]);
  const [leadData, setLeadData] = useState([]);
  const [propertyData, setPropertyData] = useState([]);
  const navigate = useNavigate();

  const [contactsView, taskView, leadView, proprtyView] = HasAccess(["Contacts", "Task", "Lead", "Property"]);

  const fetchData = async () => {
    let taskData;
    setTimeout(async () => {
      if (user.role === "superAdmin") {
        taskData = await getApi("api/task/")
      } else if (taskView?.create || taskView?.update || taskView?.delete || taskView?.view) {
        taskData = await getApi(`api/task/?createBy=${user._id}`)
        setTask(taskData?.data);
      }
    }, 4000);
    let contact;
    setTimeout(async () => {
      if (user.role === "superAdmin") {
        contact = await getApi("api/contact/")
      } else if (contactsView?.create || contactsView?.update || contactsView?.delete || contactsView?.view) {
        contact = await getApi(`api/contact/?createBy=${user._id}`)
        setContactData(contact?.data);
      }
    }, 4000);
    let lead;
    setTimeout(async () => {
      if (user.role === "superAdmin") {
        lead = await getApi("api/lead/")
      } else if (leadView?.create || leadView?.update || leadView?.delete || leadView?.view) {
        lead = await getApi(`api/lead/?createBy=${user._id}`)
        setLeadData(lead?.data);
      }
    }, 4000);
    let property;
    setTimeout(async () => {
      if (user.role === "superAdmin") {
        property = await getApi("api/property/")
      } else if (proprtyView?.create || proprtyView?.update || proprtyView?.delete || proprtyView?.view) {
        property = await getApi(`api/property/?createBy=${user._id}`)
        setPropertyData(property?.data);
      }
    }, 4000);
  };

  useEffect(() => {
    fetchData();
  }, []);

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

      <Grid templateColumns="repeat(12, 1fr)" gap={3}>
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
            <Chart dashboard={"dashboard"} />
          </Card>
        </GridItem>
      </Grid>
      {/* <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} my="20px">
        <Card style={{ borderRadius: "0", borderRight: "2px solid #e6e6e6" }}>1</Card>
        <Card style={{ borderRadius: "0", borderRight: "2px solid #e6e6e6" }}>1</Card>
        <Card style={{ borderRadius: "0", borderRight: "2px solid #e6e6e6" }}>1</Card>
        <Card style={{ borderRadius: "0" }}>1</Card>
      </SimpleGrid> */}

    </>
  );
}
