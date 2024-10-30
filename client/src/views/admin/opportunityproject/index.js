import { DeleteIcon, EditIcon, ViewIcon } from "@chakra-ui/icons";
import {
  Grid,
  GridItem,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import CommonDeleteModel from "components/commonDeleteModel";
import { useEffect, useState } from "react";
import { CiMenuKebab } from "react-icons/ci";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { deleteManyApi } from "services/api";
import CommonCheckTable from "../../../components/reactTable/checktable";
import { HasAccess } from "../../../redux/accessUtils";
import { fetchOpportunityProjectData } from "../../../redux/slices/opportunityprojectSlice";
import Editopportunityproject from "./Editopportunityproject";
import ImportModal from "./components/ImportModal";

const Index = () => {
  const title = "Opportunity Project";
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [permission] = HasAccess(["Opportunity Project"]);

  const [isLoding, setIsLoding] = useState(false);
  const [searchDisplay, setSearchDisplay] = useState(false);
  const [action, setAction] = useState(false);
  const [opportunityproject, setOpportunityProject] = useState([]);
  const [deleteMany, setDeleteMany] = useState(false);
  const [editData, setEditData] = useState({});
  const [selectedId, setSelectedId] = useState();
  const [selectedValues, setSelectedValues] = useState([]);
  const [isImport, setIsImport] = useState(false);
  const [userAction, setUserAction] = useState("");
  const { isOpen, onOpen, onClose } = useDisclosure();

  const data = useSelector((state) => state?.opportunityProjectData?.data);
  const searchedDataOut = useSelector(
    (state) => state?.advanceSearchData?.searchResult,
  );

  const fetchData = async () => {
    setIsLoding(true);
    dispatch(fetchOpportunityProjectData());
    setIsLoding(false);
  };

  const actionHeader = {
    Header: "Action",
    accessor: "action",
    isSortable: false,
    center: true,
    cell: ({ row, i }) => (
      <Text fontSize="md" fontWeight="900" textAlign={"center"}>
        <Menu isLazy>
          <MenuButton>
            <CiMenuKebab />
          </MenuButton>
          <MenuList
            minW={"fit-content"}
            transform={"translate(1520px, 173px);"}
          >
            {permission?.update && (
              <MenuItem
                py={2.5}
                icon={<EditIcon fontSize={15} mb={1} />}
                onClick={() => {
                  onOpen();
                  setUserAction("edit");
                  setEditData(row?.original);
                  setSelectedId(row?.values?._id);
                }}
              >
                Edit
              </MenuItem>
            )}
            {permission?.view && (
              <MenuItem
                py={2.5}
                color={"green"}
                icon={<ViewIcon mb={1} fontSize={15} />}
                onClick={() => {
                  navigate(`/opportunityprojectView/${row?.values?._id}`, {
                    state: { OpportunityList: data },
                  });
                }}
              >
                View
              </MenuItem>
            )}
            {permission?.delete && (
              <MenuItem
                py={2.5}
                color={"red"}
                icon={<DeleteIcon fontSize={15} mb={1} />}
                onClick={() => {
                  setDeleteMany(true);
                  setSelectedValues([row?.values?._id]);
                }}
              >
                Delete
              </MenuItem>
            )}
          </MenuList>
        </Menu>
      </Text>
    ),
  };
  const tempTableColumns = [
    { Header: "#", accessor: "_id", isSortable: false, width: 10 },
    {
      Header: "Name",
      accessor: "name",
      cell: (cell) => (
        <div className="selectOpt">
          <Text
            onClick={() =>
              navigate(`/opportunityprojectView/${cell?.row?.original._id}`, {
                state: { OpportunityList: data },
              })
            }
            me="10px"
            sx={{
              "&:hover": { color: "blue.500", textDecoration: "underline" },
              cursor: "pointer",
            }}
            color="brand.600"
            fontSize="sm"
            fontWeight="700"
          >
            {cell?.value}
          </Text>
        </div>
      ),
    },
    { Header: "Requirement", accessor: "requirement" },
    ...(permission?.update || permission?.view || permission?.delete
      ? [actionHeader]
      : []),
  ];

  const handleDeleteOpportunity = async (ids) => {
    try {
      setIsLoding(true);
      let response = await deleteManyApi("api/task/deleteMany", ids);
      if (response?.status === 200) {
        setSelectedValues([]);
        setDeleteMany(false);
        setAction((pre) => !pre);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoding(false);
    }
  };

  useEffect(() => {
    if (window?.location?.pathname === "/opportunityproject") {
      fetchData();
    }
  }, [action]);

  const handleOpen = () => {
    setUserAction("add");
    onOpen();
  };
  const handleClose = () => {
    onClose();
  };

  const handleDeleteClick = async () => {
    try {
      setIsLoding(true);
      let response = await deleteManyApi(
        `api/opportunityproject/deleteMany`,
        selectedValues,
      );
      if (response?.status === 200) {
        setSelectedValues([]);
        setDeleteMany(false);
        setAction((pre) => !pre);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoding(false);
    }
  };

  return (
    <div>
      <Grid templateColumns="repeat(6, 1fr)" mb={3} gap={4}>
        {!isLoding && (
          <GridItem colSpan={6}>
            <CommonCheckTable
              title={title}
              isLoding={isLoding}
              searchDisplay={searchDisplay}
              setSearchDisplay={setSearchDisplay}
              columnData={tempTableColumns ?? []}
              allData={data ?? []}
              AdvanceSearch={false}
              tableData={searchDisplay ? searchedDataOut : data}
              tableCustomFields={
                opportunityproject?.[0]?.fields?.filter(
                  (field) => field?.isTableField === true,
                ) || []
              }
              access={permission}
              action={action}
              setAction={setAction}
              isOpen={isOpen}
              onClose={onclose}
              onOpen={handleOpen}
              selectedValues={selectedValues}
              setSelectedValues={setSelectedValues}
              setDelete={setDeleteMany}
              setIsImport={setIsImport}
            />
            <Editopportunityproject
              isOpen={isOpen}
              onClose={handleClose}
              data={editData}
              selectedId={selectedId}
              action={action}
              setAction={setAction}
              userAction={userAction}
              fetchData={fetchData}
            />
            <CommonDeleteModel
              isOpen={deleteMany}
              onClose={() => setDeleteMany(false)}
              type="Opportunity Project"
              handleDeleteData={handleDeleteClick}
              ids={selectedValues}
            />
            <ImportModal
              text="Opportunity Project file"
              isOpen={isImport}
              onClose={setIsImport}
              customFields={[]}
            />
          </GridItem>
        )}
      </Grid>
    </div>
  );
};

export default Index;
