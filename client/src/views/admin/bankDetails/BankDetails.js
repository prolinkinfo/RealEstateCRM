import React, { useEffect, useState } from "react";
import CommonCheckTable from "components/reactTable/checktable";
import { getApi } from "services/api";
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

import View from "./View";
import { CiMenuKebab } from "react-icons/ci";
import CommonDeleteModel from "components/commonDeleteModel";
import { deleteManyApi } from "services/api";
import { fetchBankData } from "../../../redux/slices/bankDetailsSlice";
import Add from "./components/Add";
import Edit from "./components/Edit";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const BankDetails = () => {
  const title = "Bank Details";
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isLoding, setIsLoding] = useState(false);
  const [action, setAction] = useState(false);
  const [getBankDetails, setGetBankDetails] = useState([]);
  const [selectedValues, setSelectedValues] = useState([]);
  const [selectedId, setSelectedId] = useState();
  const [bankData, setBankData] = useState([]);
  const [deleteMany, setDeleteMany] = useState(false);
  const [edit, setEdit] = useState(false);
  const [deleteModel, setDelete] = useState(false);
  // const [selectedId, setSelectedId] = useState();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const bankAllData = useSelector((state) => state?.bankData?.data);

  useEffect(async () => {
    await dispatch(fetchBankData());
  }, [deleteModel, edit, isOpen]);

  const [permission, emailAccess, callAccess] = HasAccess([
    "BankDetails",
    "Emails",
    "Calls",
  ]);

  const handleDeleteBankDetais = async (ids) => {
    try {
      setIsLoding(true);
      let response = await deleteManyApi("api/bank-details/deleteMany", [ids]);
      if (response?.status === 200) {
        setSelectedValues([]);
        setDelete(false);
        setAction((pre) => !pre);
      }
      setIsLoding(false);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoding(false);
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
                  setEdit(true);
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
                  navigate(`/bankDetailsview/${row?.values?._id}`, {
                    state: { BankList: bankAllData },
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
                  setDelete(true);
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

  const tableColumns = [
    { Header: "#", accessor: "_id", isSortable: false, width: 10 },
    {
      Header: "Account Name",
      accessor: "accountName",
    },
    { Header: "Account Number", accessor: "accountNumber" },
    { Header: "Bank", accessor: "bank" },
    { Header: "Branch", accessor: "branch" },
    { Header: "Swift Code", accessor: "swiftCode" },
    ...(permission?.update || permission?.view || permission?.delete
      ? [actionHeader]
      : []),
  ];
  
  return (
    <>
      <CommonCheckTable
        title={title}
        isLoding={isLoding}
        columnData={tableColumns ?? []}
        allData={bankAllData || []}
        tableData={bankAllData || []}
        tableCustomFields={[]}
        action={action}
        setAction={setAction}
        AdvanceSearch={false}
        access={permission}
        onClose={onclose}
        onOpen={onOpen}
        setDelete={setDelete}
        selectedValues={selectedValues}
        setSelectedValues={setSelectedValues}
        selectType="single"
      />
      <CommonDeleteModel
        isOpen={deleteModel}
        onClose={() => setDelete(false)}
        type="Bank Details"
        handleDeleteData={handleDeleteBankDetais}
        ids={selectedValues}
      />
      <Add
        isOpen={isOpen}
        size={"lg"}
        bankData={tableColumns}
        onClose={onClose}
        setAction={setAction}
        action={action}
      />
      <Edit
        isOpen={edit}
        size={"lg"}
        contactData={tableColumns}
        selectedId={selectedId}
        setSelectedId={setSelectedId}
        onClose={setEdit}
        setAction={setAction}
        getBankDetails={bankAllData}
      />
    </>
  );
};

export default BankDetails;
