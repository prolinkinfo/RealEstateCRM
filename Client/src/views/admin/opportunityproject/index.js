import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { HasAccess } from "../../../redux/accessUtils";
import {
  Grid,
  GridItem,
  Text,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  useDisclosure,
  Select,
} from "@chakra-ui/react";
import {
  DeleteIcon,
  ViewIcon,
  EditIcon,
  EmailIcon,
  PhoneIcon,
} from "@chakra-ui/icons";
import { CiMenuKebab } from "react-icons/ci";
import { getApi } from "services/api";
import { useparams } from "react-router-dom";
import CommonCheckTable from "../../../components/reactTable/checktable";
import Add from "./Add";
import Edit from "./Edit";
import AddEmailHistory from "views/admin/emailHistory/components/AddEmail";
import AddPhoneCall from "views/admin/phoneCall/components/AddPhoneCall";
import ImportModal from "./components/ImportModal";
import { putApi } from "services/api";
import CommonDeleteModel from "components/commonDeleteModel";
import { deleteManyApi } from "services/api";
import {
  getSearchData,
  setGetTagValues,
} from "../../../redux/slices/advanceSearchSlice";
import { useDispatch, useSelector } from "react-redux";
import { fetchLeadData } from "../../../redux/slices/leadSlice";
import { fetchLeadCustomFiled } from "../../../redux/slices/leadCustomFiledSlice";
import { toast } from "react-toastify";
import { fetchOpportunityProjectData } from "../../../redux/slices/opportunityprojectSlice";
import Editopportunityproject from "./Editopportunityproject";
import { deleteApi } from "services/api";

const Index = () => {
  const title = "Opportunity Project";
  const size = "lg";
  const user = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const [permission, emailAccess, callAccess] = HasAccess([
    "Leads",
    "Emails",
    "Calls",
  ]);
  const [isLoding, setIsLoding] = useState(false);
  const [searchDisplay, setSearchDisplay] = useState(false);
  // const [data, setData] = useState([]);
  const [tableColumns, setTableColumns] = useState([]);
  const [columns, setColumns] = useState([]);
  const [dataColumn, setDataColumn] = useState([]);
  const [selectedColumns, setSelectedColumns] = useState([]);
  const [action, setAction] = useState(false);
  // const { isOpen, onOpen, onClose } = useDisclosure();
  const [opportunityproject, setOpportunityProject] = useState([]);
  const [edit, setEdit] = useState(false);
  const [deleteMany, setDeleteMany] = useState(false);
  const [editData, setEditData] = useState({});
  const [deleteModel, setDelete] = useState(false);
  const [addPhoneCall, setAddPhoneCall] = useState(false);
  const [callSelectedId, setCallSelectedId] = useState();
  const [addEmailHistory, setAddEmailHistory] = useState(false);
  const [selectedId, setSelectedId] = useState();
  const [selectedValues, setSelectedValues] = useState([]);
  const [isImport, setIsImport] = useState(false);
  const [emailRec, setEmailRec] = useState("");
  const [phoneRec, setPhoneRec] = useState({});
  const [userAction, setUserAction] = useState("");
  // const [isOpen, setIsOpen] = useState(false)
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [type, setType] = useState("");

  const data = useSelector((state) => state?.opportunityProjectData?.data);
  console.log(data, "Data");
  const searchedDataOut = useSelector(
    (state) => state?.advanceSearchData?.searchResult
  );
  const payload = {
    // leadStatus: location?.state,
    opportunityprojctStatus: location?.state,
  };

  const fetchData = async () => {
    setIsLoding(true);
    dispatch(fetchOpportunityProjectData());
    // let result = await getApi(
    //     user.role === "superAdmin"
    //         ? "api/opportunityproject/"
    //         : `api/opportunityproject/?createBy=${user._id}`
    // );
    // setData(result?.data);
    setIsLoding(false);
  };
  const handleOpenEmail = (id, dataLead) => {
    if (id) {
      setEmailRec(dataLead?.leadEmail);
      setAddEmailHistory(true);
    }
  };

  const setStatusData = async (cell, e) => {
    try {
      setIsLoding(true);
      let response = await putApi(
        `api/opportunityproject/changeStatus/${cell.original._id}`,
        { opportunityprojctStatus: e.target.value }
      );
      if (response.status === 200) {
        setAction((pre) => !pre);
      }
    } catch (e) {
      console.log(e);
    } finally {
      setIsLoding(false);
    }
  };
  const handleOpenAdd = () => {
    onOpen();
    setType("add");
  };
  const changeStatus = (cell) => {
    switch (cell.original.opportunityprojctStatus) {
      case "pending":
        return "pending";
      case "active":
        return "completed";
      case "sold":
        return "onHold";
      default:
        return "completed";
    }
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
                  setType("edit");
                  onOpen();
                  // setEdit(true);
                  setUserAction("edit");
                  setEditData(row?.values);
                  setSelectedId(row?.values?._id);
                  console.log(row?.values?._id, "rowww");
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
                  navigate(`/opportunitiesprojectView/${row?.values?._id}`, {
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
    { Header: "Name", accessor: "name" },
    { Header: "Requirement", accessor: "requirement" },
    // { Header: "Role", accessor: "role" },
    ...(permission?.update || permission?.view || permission?.delete
      ? [actionHeader]
      : []),
  ];

  const handleDeleteOpportunity = async (ids) => {
    try {
      setIsLoding(true);
      let response = await deleteManyApi("api/task/deleteMany", ids);
      if (response.status === 200) {
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
    if (window.location.pathname === "/opportunityproject") {
      // dispatch(fetchOpportunityProjectData());
      fetchData();
    }
  }, [action]);

  useEffect(() => {
    if (location?.state) {
      setSearchDisplay(true);
      dispatch(
        getSearchData({ values: payload, allData: data, type: "Leads" })
      );
      const getValue = [
        {
          name: ["leadStatus"],
          value: location?.state,
        },
      ];
      dispatch(setGetTagValues(getValue.filter((item) => item.value)));
    }
  }, [data, location?.state]);
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
        selectedValues
      );
      console.log(selectedValues, "selectedValues");
      if (response.status === 200) {
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
                  (field) => field?.isTableField === true
                ) || []
              }
              //tableCustomFields={[]}
              access={permission}
              action={action}
              setAction={setAction}
              // selectedColumns={selectedColumns}
              // setSelectedColumns={setSelectedColumns}
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
            {/* <CommonDeleteModel isOpen={deleteMany} onClose={() => setDeleteMany(false)} handleDeleteData={handleDeleteClick} ids={selectedValues} type='User' /> */}
            <CommonDeleteModel
              isOpen={deleteMany}
              onClose={() => setDeleteMany(false)}
              type="Opportunity Project"
              handleDeleteData={handleDeleteClick}
              ids={selectedValues}
            />
            {console.log(deleteMany, "deleteMany")}
          </GridItem>
        )}
      </Grid>
      {console.log(selectedId, "selectedId/selectedId")}
      {/* {isOpen && (
                <Add
                    isOpen={isOpen}
                    size={size}
                    leadData={opportunityproject[0]}
                    onClose={onClose}
                    setAction={setAction}
                    action={action}
                />
            )}
            {edit && (
                <Edit
                    isOpen={edit}
                    size={size}
                    leadData={opportunityproject[0]}
                    selectedId={selectedId}
                    setSelectedId={setSelectedId}
                    onClose={setEdit}
                    setAction={setAction}
                    moduleId={opportunityproject?.[0]?._id}
                />
            )}
            {deleteModel && (
                <CommonDeleteModel
                    isOpen={deleteModel}
                    onClose={() => setDelete(false)}
                    type="opportunity Project"
                    handleDeleteData={handleDeleteLead}
                    ids={selectedValues}
                />
            )}
            {addEmailHistory && (
                <AddEmailHistory
                    fetchData={fetchData}
                    isOpen={addEmailHistory}
                    onClose={setAddEmailHistory}
                    lead={true}
                    id={selectedId}
                    leadEmail={emailRec}
                />
            )}
            {addPhoneCall && (
                <AddPhoneCall
                    fetchData={fetchData}
                    isOpen={addPhoneCall}
                    onClose={setAddPhoneCall}
                    lead={true}
                    id={callSelectedId}
                    LData={phoneRec}
                />
            )}
            {isImport && (
                <ImportModal
                    text="Lead file"
                    isOpen={isImport}
                    onClose={setIsImport}
                    customFields={opportunityproject?.[0]?.fields || []}
                />
            )} */}
    </div>
  );
};

export default Index;
