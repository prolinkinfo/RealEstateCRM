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
  const { columnsData, action, setAction, onOpen, isOpen, onClose } = props;

  const textColor = useColorModeValue("secondaryGray.900", "white");
  const borderColor = useColorModeValue("gray.200", "whiteAlpha.100");
  const columns = useMemo(() => columnsData, [columnsData]);
  const [selectedValues, setSelectedValues] = useState([]);
  const user = JSON.parse(localStorage.getItem("user"));
  const [deleteModel, setDelete] = useState(false);
  // const data = useMemo(() => tableData, [tableData]);
  const [data, setData] = useState([
    {
      title: "Lead",
      create: false,
      delete: false,
      update: false,
      view: false,
    },
    {
      title: "Contacts",
      create: false,
      delete: false,
      update: false,
      view: false,
    },
    {
      title: "Property",
      create: false,
      delete: false,
      update: false,
      view: false,
    },
    {
      title: "Task",
      create: false,
      delete: false,
      update: false,
      view: false,
    },
    {
      title: "Meeting",
      create: false,
      delete: false,
      update: false,
      view: false,
    },
    {
      title: "Call",
      create: false,
      delete: false,
      update: false,
      view: false,
    },
    {
      title: "Email",
      create: false,
      delete: false,
      update: false,
      view: false,
    },
  ]);
  const [isLoding, setIsLoding] = useState(false);
  const [gopageValue, setGopageValue] = useState();

  const tableInstance = useTable(
    {
      columns,
      data,
      initialState: { pageIndex: 0 },
    },
    useGlobalFilter,
    useSortBy,
    usePagination
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    page,
    canPreviousPage,
    canNextPage,
    pageOptions,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,
    state: { pageIndex, pageSize },
  } = tableInstance;

  if (pageOptions.length < gopageValue) {
    setGopageValue(pageOptions.length);
  }

  const handleCheckboxChange = (event, value) => {
    if (event.target.checked) {
      setSelectedValues((prevSelectedValues) => [...prevSelectedValues, value]);
    } else {
      setSelectedValues((prevSelectedValues) =>
        prevSelectedValues.filter((selectedValue) => selectedValue !== value)
      );
    }
  };

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
              <Tab>Admin</Tab>
              <Tab>Team Leads</Tab>
              <Tab>Managers</Tab>
              <Tab>Executives</Tab>
              <Tab>Tele Callers</Tab>
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
            <TabPanel pt={4} p={0}>
              <RolePanel
                name={"Admin"}
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
            </TabPanel>
          </TabPanels>
        </Card>
      </Tabs>
      <ChangeAccess
        isOpen={isOpen}
        onClose={onClose}
        onOpen={onOpen}
        borderColor={borderColor}
        data={page}
        headerGroups={headerGroups}
        textColor={textColor}
        column={columns}
        getTableBodyProps={getTableBodyProps}
        page={data}
        setData={setData}
        isLoding={isLoding}
        prepareRow={prepareRow}
      />
    </>
  );
}
