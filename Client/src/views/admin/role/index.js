import { Button, Text, useDisclosure } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { getApi } from "services/api";
import CommonCheckTable from "components/reactTable/checktable";
import { IoIosArrowBack } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import RoleModal from "./components/roleModal";
import AddRole from "./Add";

const Index = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [roleModal, setRoleModal] = useState(false);
  const [access, setAccess] = useState([])
  const [roleId, setRoleId] = useState('')
  const [searchboxOutside, setSearchboxOutside] = useState('');
  const [getTagValuesOutSide, setGetTagValuesOutside] = useState([]);
  const [displaySearchData, setDisplaySearchData] = useState(false);
  const [roleName, setRoleName] = useState('')
  const [searchedData, setSearchedData] = useState([]);

  const columns = [
    {
      Header: "#",
      accessor: "_id",
      isSortable: false,
      width: 10,
      display: false
    },
    {
      Header: "Role Name", accessor: "roleName", cell: (cell) => (
        <Text
          me="10px"
          onClick={() => { setRoleModal(true); setRoleName(cell?.value); setRoleId(cell?.row?.original?._id); setAccess(cell?.row?.original?.access); }}
          color='brand.600'
          sx={{ '&:hover': { color: 'blue.500', textDecoration: 'underline', cursor: 'pointer' } }}
          fontSize="sm"
          fontWeight="700"
        >
          {cell?.value}
        </Text>
      )
    },
    { Header: "Description", accessor: "description" }
  ];
  const rowColumns = [
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
  ]
  const [action, setAction] = useState(false);
  const [isLoding, setIsLoding] = useState(false);
  const [data, setData] = useState([]);
  const size = "lg";
  const navigate = useNavigate()

  const fetchData = async () => {
    setIsLoding(true);
    let result = await getApi("api/role-access");
    setData(result.data);
    setIsLoding(false);
  };

  useEffect(() => {
    fetchData()
  }, [action])

  return (
    <div>
      <CommonCheckTable
        title={'Roles'}
        isLoding={isLoding}
        columnData={columns ?? []}
        // dataColumn={columns ?? []}
        allData={data || []}
        tableData={data}
        // AdvanceSearch={() => ""}
        AdvanceSearch={false}
        tableCustomFields={[]}
        searchedDataOut={searchedData}
        searchDisplay={displaySearchData}
        setSearchDisplay={setDisplaySearchData}
        setSearchedDataOut={setSearchedData}
        searchboxOutside={searchboxOutside}
        // setSearchboxOutside={setSearchboxOutside}
        BackButton={<Button onClick={() => navigate('/admin-setting')} variant="brand" size="sm" leftIcon={<IoIosArrowBack />} ml={2}>Back</Button>}
        deleteMany={true}
        access={true}
        checkBox={false}
        getTagValuesOutSide={getTagValuesOutSide}
        setGetTagValuesOutside={setGetTagValuesOutside}
        ManageGrid={false}
        onOpen={onOpen}
        customSearch={true}
      />
      <AddRole isOpen={isOpen} size={"sm"} setAction={setAction} onClose={onClose} />
      {access && <RoleModal isOpen={roleModal}
        setRoleModal={setRoleModal}
        onOpen={onOpen}
        isLoding={isLoding}
        columnsData={rowColumns ?? []}
        name={roleName}
        _id={roleId}
        tableData={access ?? []}
        setAccess={setAccess}
        fetchData={fetchData}
        setAction={setAction}
      />}
    </div>
  );
};

export default Index;
