
// Chakra imports
import {
  Flex,
  Heading,
  Icon, IconButton,
  SimpleGrid,
  useColorModeValue
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
import {
  MdAddTask,
  MdContacts,
  MdLeaderboard
} from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { getApi } from "services/api";
import ReportChart from "../reports/components/reportChart";

export default function UserReports() {
  // Chakra Color Mode
  const brandColor = useColorModeValue("brand.500", "white");
  const boxBg = useColorModeValue("secondaryGray.300", "whiteAlpha.100");
  const user = JSON.parse(localStorage.getItem("user"))

  const [task, setTask] = useState([])
  const [contactData, setContactData] = useState([])
  const [leadData, setLeadData] = useState([])
  const [propertyData, setPropertyData] = useState([])
  const navigate = useNavigate()

  const fetchData = async () => {
    let taskData = await getApi(user.role === 'admin' ? 'api/task/' : `api/task/?createBy=${user._id}`);
    let contact = await getApi(user.role === 'admin' ? 'api/contact/' : `api/contact/?createBy=${user._id}`);
    let lead = await getApi(user.role === 'admin' ? 'api/lead/' : `api/lead/?createBy=${user._id}`);
    let property = await getApi(user.role === 'admin' ? 'api/property/' : `api/property/?createBy=${user._id}`);


    setPropertyData(property?.data);
    setLeadData(lead?.data);
    setContactData(contact?.data);
    setTask(taskData?.data);
  }

  useEffect(() => {
    fetchData()
  }, [])


  return (
    <>
      <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} gap='20px' mb='20px'>{/* , "2xl": 6 */}
        <MiniStatistics
          onClick={() => navigate('/task')}
          startContent={<IconBox w='56px' h='56px' bg='linear-gradient(90deg, #4481EB 0%, #04BEFE 100%)' icon={<Icon w='28px' h='28px' as={MdAddTask} color='white' />} />}
          name='Tasks'
          value={task?.length || 0}
        />
        <MiniStatistics
          onClick={() => navigate('/contacts')}
          startContent={<IconBox w='56px' h='56px' bg={boxBg} icon={<Icon w='32px' h='32px' as={MdContacts} color={brandColor} />} />}
          name='Contacts'
          value={contactData?.length || 0}
        />
        <MiniStatistics
          onClick={() => navigate('/lead')}
          startContent={<IconBox w='56px' h='56px' bg={boxBg} icon={<Icon w='32px' h='32px' as={MdLeaderboard} color={brandColor} />} />}
          name='Leads'
          value={leadData?.length || 0}
        />
        <MiniStatistics
          onClick={() => navigate('/properties')}
          startContent={<IconBox w='56px' h='56px' bg={boxBg} icon={<Icon w='32px' h='32px' as={LuBuilding2} color={brandColor} />} />}
          name='property'
          value={propertyData?.length || 0}
        />

        {/* ---------------- */}
        {/* 
        <MiniStatistics
          startContent={<IconBox w='56px' h='56px' bg={boxBg} icon={<Icon w='32px' h='32px' as={MdBarChart} color={brandColor} />} />}
          name='Earnings'
          value='$350.4'
        />
        <MiniStatistics
          startContent={
            <IconBox
              w='56px'
              h='56px'
              bg={boxBg}
              icon={
                <Icon w='32px' h='32px' as={MdAttachMoney} color={brandColor} />
              }
            />
          }
          name='Spend this month'
          value='$642.39'
        />
        <MiniStatistics growth='+23%' name='Sales' value='$574.34' />
        <MiniStatistics
          endContent={
            <Flex me='-16px' mt='10px'>
              <FormLabel htmlFor='balance'>
                <Avatar src={Usa} />
              </FormLabel>
              <Select
                id='balance'
                variant='mini'
                mt='5px'
                me='0px'
                defaultValue='usd'>
                <option value='usd'>USD</option>
                <option value='eur'>EUR</option>
                <option value='gba'>GBA</option>
              </Select>
            </Flex>
          }
          name='Your balance'
          value='$1,000'
        />
        <MiniStatistics
          startContent={<IconBox w='56px' h='56px' bg='linear-gradient(90deg, #4481EB 0%, #04BEFE 100%)' icon={<Icon w='28px' h='28px' as={MdAddTask} color='white' />} />}
          name='Tasks'
          value={154}
        />
        <MiniStatistics
          startContent={<IconBox w='56px' h='56px' bg={boxBg} icon={<Icon w='32px' h='32px' as={MdFileCopy} color={brandColor} />} />}
          name='Total Projects'
          value={1935}
        /> */}
      </SimpleGrid>


      <SimpleGrid columns={{ base: 1 }} gap='20px' mb='20px'>
        <Card>
          <Flex mb={3} alignItems={'center'} justifyContent={"space-between"}>
            <Heading size="md" >
              Report
            </Heading>
            <IconButton color={'green.500'} onClick={() => navigate('/reporting-analytics')} aria-label="Call Fred" borderRadius="10px" size="md" icon={<ViewIcon />} />
          </Flex>
          <HSeparator />
          <ReportChart dashboard={'dashboard'} />
        </Card>
      </SimpleGrid>

      {/* <SimpleGrid columns={{ base: 1, md: 2, xl: 2 }} gap='20px' mb='20px'>
        <TotalSpent />
        <WeeklyRevenue />
      </SimpleGrid>
      <SimpleGrid columns={{ base: 1, md: 1, xl: 2 }} gap='20px' mb='20px'>
        <DailyTraffic />
        <PieCard />
      </SimpleGrid> */}

    </>
  );
}
