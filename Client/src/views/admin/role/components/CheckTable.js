import {
  Box,
  Checkbox,
  Flex,
  Grid,
  GridItem,
  Menu,
  Button,
  Tab,
  TabList,
  Table,
  Tabs,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  useColorModeValue,
  TabPanels,
  TabPanel,
} from "@chakra-ui/react";
import { useEffect, useMemo, useState } from "react";
import {
  useGlobalFilter,
  usePagination,
  useSortBy,
  useTable,
} from "react-table";

// Custom components
import { AddIcon, DeleteIcon } from "@chakra-ui/icons";
import Card from "components/card/Card";
import CountUpComponent from "components/countUpComponent/countUpComponent";
import Pagination from "components/pagination/Pagination";
import Spinner from "components/spinner/Spinner";
import { FaSort, FaSortDown, FaSortUp } from "react-icons/fa";
import { Link } from "react-router-dom";
import { getApi } from "services/api";
import ChangeAccess from "../changeAccess";
import RolePanel from "./rolePanel";

export default function CheckTable(props) {
  const { columnsData, action, setAction } = props;

  const columns = [
    {
      Header: "#",
      accessor: "_id",
      isSortable: false,
      width: 10,
      display: false
    },
    { Header: "title", accessor: "title" },
    { Header: "create", accessor: "create", width: '20px' },
    { Header: "view", accessor: "view", width: '20px' },
    { Header: "update", accessor: "update", width: '20px' },
    { Header: "delete", accessor: "delete", width: '20px' },
  ];


  const textColor = useColorModeValue("secondaryGray.900", "white");
  const borderColor = useColorModeValue("gray.200", "whiteAlpha.100");
  // const columns = useMemo(() => columnsData, [columnsData]);
  const [selectedValues, setSelectedValues] = useState([]);
  const user = JSON.parse(localStorage.getItem("user"));
  const [deleteModel, setDelete] = useState(false);
  // const data = useMemo(() => tableData, [tableData]);
  const [data, setData] = useState([]);
  const [accessModal, setAccessModal] = useState('');

  const [isLoding, setIsLoding] = useState(false);

  const fetchData = async () => {
    setIsLoding(true);
    let result = await getApi("api/role-access");
    setData(result.data);
    setIsLoding(false);
  };


  // const tableInstance = useTable(
  //   {
  //     columns,
  //     data,
  //     initialState: { pageIndex: 0 },
  //   },
  //   useGlobalFilter,
  //   useSortBy,
  //   usePagination
  // );

  // const {
  //   getTableProps,
  //   getTableBodyProps,
  //   headerGroups,
  //   prepareRow,
  //   page,
  //   canPreviousPage,
  //   canNextPage,
  //   pageOptions,
  //   pageCount,
  //   gotoPage,
  //   nextPage,
  //   previousPage,
  //   setPageSize,
  //   state: { pageIndex, pageSize },
  // } = tableInstance;

  useEffect(() => {
    if (fetchData) fetchData();
  }, []);

  // if (pageOptions.length < gopageValue) {
  //   setGopageValue(pageOptions.length);
  // }

  // const handleCheckboxChange = (event, value) => {
  //   if (event.target.checked) {
  //     setSelectedValues((prevSelectedValues) => [...prevSelectedValues, value]);
  //   } else {
  //     setSelectedValues((prevSelectedValues) =>
  //       prevSelectedValues.filter((selectedValue) => selectedValue !== value)
  //     );
  //   }
  // };

  const handleClick = () => {
    props.onOpen();
  };

  return (
    <>
      <Tabs>
        <Grid templateColumns="repeat(3, 1fr)" mb={3} gap={1}>
          <GridItem colSpan={2}>
            <TabList
              sx={{
                border: "none",
                "& button:focus": { boxShadow: "none" },
                "& button": {
                  margin: "0 5px",
                  border: "2px solid #8080803d",
                  borderTopLeftRadius: "10px",
                  borderTopRightRadius: "10px",
                  borderBottom: 0,
                },
                '& button[aria-selected="true"]': {
                  border: "2px solid brand.200",
                  borderBottom: 0,
                },
              }}
            >
              {data.map((item) => (
                <Tab onClick={() => setAccessModal(item._id)}>{item.roleName}</Tab>
              ))}
              {/* <Tab>Admin</Tab>
              <Tab>Team Leads</Tab>
              <Tab>Managers</Tab>
              <Tab>Executives</Tab>
              <Tab>Tele Callers</Tab> */}
            </TabList>
          </GridItem>
        </Grid>
        <Card
          direction="column"
          w="100%"
          px="0px"
          overflowX={{ sm: "scroll", lg: "hidden" }}
        >
          <TabPanels>
            {data.map((item, index) => (
              <TabPanel key={index} pt={4} p={0}>
                <RolePanel
                  name={item.roleName}
                  // borderColor={borderColor}
                  // // data={page}
                  // data={item.access}
                  // headerGroups={headerGroups}
                  // textColor={textColor}
                  // column={columns}
                  // getTableBodyProps={getTableBodyProps}
                  // page={data}
                  // isLoding={isLoding}
                  // prepareRow={prepareRow}
                  // handleCheckboxChange={handleCheckboxChange}
                  // selectedValues={selectedValues}
                  // setDelete={setDelete}
                  handleClick={handleClick}
                  _id={accessModal ? accessModal : (item.roleName === 'user' && item._id) }
                  // onClose={onClose}
                  // onOpen={onOpen}
                  // userRole={userRole}
                  isLoding={isLoding} columnsData={columns}  tableData={item.access} fetchData={fetchData} setAction={setAction}
                />
              </TabPanel>
            ))}
            {/* <TabPanel pt={4} p={0}>
            <RolePanel
                name={"Team Leads"}
                borderColor={borderColor}
                data={page}
                headerGroups={headerGroups}
                textColor={textColor}
                column={columns}
                getTableBodyProps={getTableBodyProps}
                page={data}
                isLoding={isLoding}
                prepareRow={prepareRow}
                handleCheckboxChange={handleCheckboxChange}
                selectedValues={selectedValues}
                setDelete={setDelete}
                handleClick={handleClick}
              />
            </TabPanel>
            <TabPanel pt={4} p={0}>
            <RolePanel
                name={"Managers"}
                borderColor={borderColor}
                data={page}
                headerGroups={headerGroups}
                textColor={textColor}
                column={columns}
                getTableBodyProps={getTableBodyProps}
                page={data}
                isLoding={isLoding}
                prepareRow={prepareRow}
                handleCheckboxChange={handleCheckboxChange}
                selectedValues={selectedValues}
                setDelete={setDelete}
                handleClick={handleClick}
              />
            </TabPanel>
            <TabPanel pt={4} p={0}>
            <RolePanel
                name={"Executives"}
                borderColor={borderColor}
                data={page}
                headerGroups={headerGroups}
                textColor={textColor}
                column={columns}
                getTableBodyProps={getTableBodyProps}
                page={data}
                isLoding={isLoding}
                prepareRow={prepareRow}
                handleCheckboxChange={handleCheckboxChange}
                selectedValues={selectedValues}
                setDelete={setDelete}
                handleClick={handleClick}
              />
            </TabPanel>
            <TabPanel pt={4} p={0}>
            <RolePanel
                name={"Tele Callers"}
                borderColor={borderColor}
                data={page}
                headerGroups={headerGroups}
                textColor={textColor}
                column={columns}
                getTableBodyProps={getTableBodyProps}
                page={data}
                isLoding={isLoding}
                prepareRow={prepareRow}
                handleCheckboxChange={handleCheckboxChange}
                selectedValues={selectedValues}
                setDelete={setDelete}
                handleClick={handleClick}
              />
            </TabPanel> */}
          </TabPanels>
        </Card>
      </Tabs>
     
    </>
  );
}
