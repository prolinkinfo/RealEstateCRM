import {
  AddIcon,
  ChevronDownIcon,
  DeleteIcon,
  EditIcon,
} from "@chakra-ui/icons";
import {
  Button,
  Flex,
  Grid,
  GridItem,
  Heading,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
  Text,
  Input,
  useDisclosure,
} from "@chakra-ui/react";
import Card from "components/card/Card";
import { HSeparator } from "components/separator/Separator";
import Spinner from "components/spinner/Spinner";
import { useEffect, useState } from "react";
import { IoIosArrowBack } from "react-icons/io";
import { Link, useNavigate, useParams } from "react-router-dom";
import { getApi , putApi} from "services/api";
import Add from "./Add";
import Edit from "./Edit";
import RoleTable from "./components/roleTable";
import RoleModal from "./components/roleModal";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "../../../redux/slices/localSlice";
import { userSchema } from "schema";
import CommonDeleteModel from "components/commonDeleteModel";
import { deleteApi } from "services/api";
import AddEditUser from "./AddEditUser";
import { useFormik } from "formik";
import { toast } from "react-toastify";

const View = () => {
  const RoleColumn = [
    { Header: "#", accessor: "_id", width: 10, display: false },
    { Header: "Role Name", accessor: "roleName" },
    { Header: "Description", accessor: "description" },
  ];
  const dispatch = useDispatch();
  const userData = useSelector((state) => state?.user?.user);

  const userName =
    typeof userData === "string" ? JSON.parse(userData) : userData;

  const param = useParams();
  const navigate = useNavigate();
  const handleOpenModal = (userData) => {
    setEdit(true);
    dispatch(setUser(userData)); // Dispatch setUser action to set user data
  };

  const [data, setData] = useState();
  const [roleData, setRoleData] = useState([]);
  // const { isOpen, onOpen, onClose } = useDisclosure()
  const [edit, setEdit] = useState(false);
  const [deleteModel, setDelete] = useState(false);
  const [roleModal, setRoleModal] = useState(false);
  const [isLoding, setIsLoding] = useState(false);
  const [action, setAction] = useState(false);
  const [userAction, setUserAction] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [editableField, setEditableField] = useState(null);
  
  const size = "lg";

  const handleOpen = (type) => {
    setUserAction(type);
    setIsOpen(true);
  };
  const handleClose = () => {
    setIsOpen(false);
  };

  const fetchData = async () => {
    setIsLoding(true);
    let response = await getApi("api/user/view/", param?.id);
    setData(response?.data);
    setIsLoding(false);
  };

  useEffect(() => {
    if (param?.id) {
      fetchData();
    }
  }, [action]);

  useEffect(async () => {
    setIsLoding(true);
    let result = await getApi("api/role-access");
    setRoleData(result?.data);
    setIsLoding(false);
  }, []);

  const handleDeleteClick = async () => {
    try {
      setIsLoding(true);
      let response = await deleteApi(`api/user/delete/`, param?.id);
      if (response?.status === 200) {
        setDelete(false);
        navigate(-1);
        setAction((pre) => !pre);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoding(false);
    }
  };

  const handleBlur = (e) => {
    formik.handleSubmit();
    toast.success("User Updated Successfully");
  };

  const initialValues = {
    firstName:  data?.firstName,
    lastName:  data?.lastName,
    username:  data?.username,
    phoneNumber:  data?.phoneNumber,
  };

  const id = window.location.pathname.split("/").pop();

  const formik = useFormik({
    initialValues: initialValues,
    validationSchema: userSchema,
    enableReinitialize: true,
    onSubmit: async (values, { resetForm }) => {
      let response = await putApi(`api/user/edit/${id}`, values);
      if (response?.status === 200) {
        setEditableField(null);
        fetchData();
      }
    },
  });

  const handleDoubleClick = (fieldName, value) => {
    formik.setFieldValue(fieldName, value);
    setEditableField(fieldName);
  };

  return (
    <>
      {isLoding ? (
        <Flex justifyContent={"center"} alignItems={"center"} width="100%">
          <Spinner />
        </Flex>
      ) : (
        <>
          <AddEditUser
            isOpen={isOpen}
            onClose={handleClose}
            data={data}
            selectedId={param?.id}
            userAction={userAction}
            setAction={setAction}
            setUserAction={setUserAction}
            fetchData={fetchData}
          />
          <CommonDeleteModel
            isOpen={deleteModel}
            onClose={() => setDelete(false)}
            type="User"
            handleDeleteData={handleDeleteClick}
            ids={""}
            selectedValues={param?.id}
          />
          <GridItem colSpan={{ base: 4 }}>
            <Heading size="lg" m={3}>
              {data?.firstName || ""}
            </Heading>
          </GridItem>
          <Card>
            <Grid templateColumns={"repeat(12, 1fr)"} gap={4}>
              <GridItem colSpan={{ base: 12, md: 6 }}>
                <Heading size="md" mb={3} textTransform={"capitalize"}>
                  {data?.firstName || data?.lastName
                    ? `${data?.firstName} ${data?.lastName}`
                    : "User"}{" "}
                  Information
                </Heading>
              </GridItem>
              <GridItem colSpan={{ base: 12, md: 6 }}>
                <Flex
                  justifyContent={{ base: "start", sm: "start", md: "end" }}
                >
                  {data?.role === "superAdmin" && (
                    <Menu>
                      <MenuButton
                        variant="outline"
                        colorScheme="blackAlpha"
                        size="sm"
                        va
                        mr={2.5}
                        as={Button}
                        rightIcon={<ChevronDownIcon />}
                      >
                        Actions
                      </MenuButton>
                      <MenuDivider />
                      <MenuList minWidth={"13rem"}>
                        <MenuItem
                          alignItems={"start"}
                          onClick={() => handleOpen("add")}
                          icon={<AddIcon />}
                        >
                          Add
                        </MenuItem>
                        <MenuItem
                          alignItems={"start"}
                          onClick={() => handleOpen("edit")}
                          icon={<EditIcon />}
                          color="green"
                        >
                          Edit
                        </MenuItem>
                        {data?.role !== "superAdmin" &&
                          JSON.parse(localStorage.getItem("user"))?.role ===
                            "superAdmin" && (
                            <>
                              <MenuDivider />
                              <MenuItem
                                alignItems={"start"}
                                onClick={() => setDelete(true)}
                                icon={<DeleteIcon />}
                              >
                                Delete
                              </MenuItem>
                            </>
                          )}
                      </MenuList>
                    </Menu>
                  )}
                  <Link to="/user">
                    <Button
                      leftIcon={<IoIosArrowBack />}
                      variant="brand"
                      size="sm"
                    >
                      Back
                    </Button>
                  </Link>
                </Flex>
              </GridItem>
            </Grid>
            <HSeparator />
            <Grid templateColumns={"repeat(2, 1fr)"} gap={4} mt="5">
              <GridItem colSpan={{ base: 2, md: 1 }}>
                <Text fontSize="sm" fontWeight="bold" color={"blackAlpha.900"}>
                  {" "}
                  First Name{" "}
                </Text>
                {editableField === "firstName" ? (
                  <>
                    <Input
                      id="text"
                      name="firstName"
                      type="text"
                      onChange={formik?.handleChange}
                      onBlur={handleBlur}
                      value={formik?.values?.firstName}
                      borderColor={
                        formik?.errors?.firstName && formik?.touched?.firstName
                          ? "red.300"
                          : null
                      }
                      autoFocus
                    />
                    <Text mb="10px" color={"red"}>
                      {" "}
                      {formik?.errors.firstName &&
                        formik?.touched.firstName &&
                        formik?.errors.firstName}
                    </Text>
                  </>
                ) : (
                  <Text
                    onDoubleClick={() =>
                      handleDoubleClick("firstName", data?.firstName)
                    }
                  >
                    {data?.firstName ? data?.firstName : " - "}
                  </Text>
                )}
                {/* <Text>{data?.firstName ? data?.firstName : " - "}</Text> */}
              </GridItem>
              <GridItem colSpan={{ base: 2, md: 1 }}>
                <Text fontSize="sm" fontWeight="bold" color={"blackAlpha.900"}>
                  {" "}
                  Last Name{" "}
                </Text>
                {editableField === "lastName" ? (
                  <>
                    <Input
                      id="text"
                      name="lastName"
                      type="text"
                      onChange={formik?.handleChange}
                      onBlur={handleBlur}
                      value={formik?.values?.lastName}
                      borderColor={
                        formik?.errors?.lastName && formik?.touched?.lastName
                          ? "red.300"
                          : null
                      }
                      autoFocus
                    />
                    <Text mb="10px" color={"red"}>
                      {" "}
                      {formik?.errors.lastName &&
                        formik?.touched.lastName &&
                        formik?.errors.lastName}
                    </Text>
                  </>
                ) : (
                  <Text
                    onDoubleClick={() =>
                      handleDoubleClick("lastName", data?.lastName)
                    }
                  >
                    {data?.lastName ? data?.lastName : " - "}
                  </Text>
                )}
                {/* <Text>{data?.lastName ? data?.lastName : " - "}</Text> */}
              </GridItem>
              <GridItem colSpan={{ base: 2, md: 1 }}>
                <Text fontSize="sm" fontWeight="bold" color={"blackAlpha.900"}>
                  Phone Number
                </Text>
                {editableField === "phoneNumber" ? (
                  <>
                    <Input
                      id="text"
                      name="phoneNumber"
                      type="text"
                      onChange={formik?.handleChange}
                      onBlur={handleBlur}
                      value={formik?.values?.phoneNumber}
                      borderColor={
                        formik?.errors?.phoneNumber && formik?.touched?.phoneNumber
                          ? "red.300"
                          : null
                      }
                      autoFocus
                    />
                    <Text mb="10px" color={"red"}>
                      {" "}
                      {formik?.errors.phoneNumber &&
                        formik?.touched.phoneNumber &&
                        formik?.errors.phoneNumber}
                    </Text>
                  </>
                ) : (
                  <Text
                    onDoubleClick={() =>
                      handleDoubleClick("phoneNumber", data?.phoneNumber)
                    }
                  >
                    {data?.phoneNumber ? data?.phoneNumber : " - "}
                  </Text>
                )}
                {/* <Text>{data?.phoneNumber ? data?.phoneNumber : " - "}</Text> */}
              </GridItem>
              <GridItem colSpan={{ base: 2, md: 1 }}>
                <Text fontSize="sm" fontWeight="bold" color={"blackAlpha.900"}>
                  {" "}
                  User Email{" "}
                </Text>
                {editableField === "username" ? (
                  <>
                    <Input
                      id="text"
                      name="username"
                      type="text"
                      onChange={formik?.handleChange}
                      onBlur={handleBlur}
                      value={formik?.values?.username}
                      borderColor={
                        formik?.errors?.username && formik?.touched?.username
                          ? "red.300"
                          : null
                      }
                      autoFocus
                    />
                    <Text mb="10px" color={"red"}>
                      {" "}
                      {formik?.errors.username &&
                        formik?.touched.username &&
                        formik?.errors.username}
                    </Text>
                  </>
                ) : (
                  <Text
                    onDoubleClick={() =>
                      handleDoubleClick("username", data?.username)
                    }
                  >
                    {data?.username ? data?.username : " - "}
                  </Text>
                )}
                {/* <Text>{data?.username ? data?.username : " - "}</Text> */}
              </GridItem>
            </Grid>
          </Card>

          {data?.role !== "superAdmin" && (
            <Card mt={3}>
              <RoleTable
                fetchData={fetchData}
                columnsData={RoleColumn ?? []}
                roleModal={roleModal}
                setRoleModal={setRoleModal}
                tableData={data?.roles || []}
                title={"Role"}
              />
            </Card>
          )}
          <RoleModal
            fetchData={fetchData}
            isOpen={roleModal}
            onClose={setRoleModal}
            columnsData={RoleColumn ?? []}
            id={param.id}
            tableData={roleData ?? []}
            interestRoles={data?.roles?.map((item) => item?._id)}
          />

          <Card mt={3}>
            <Grid templateColumns="repeat(6, 1fr)" gap={1}>
              <GridItem colStart={6}>
                <Flex justifyContent={"right"}>
                  <Button
                    onClick={() => {
                      handleOpenModal(userData);
                      handleOpen("edit");
                    }}
                    leftIcon={<EditIcon />}
                    mr={2.5}
                    variant="outline"
                    size="sm"
                    colorScheme="green"
                  >
                    Edit
                  </Button>
                  {data?.role !== "superAdmin" &&
                    JSON.parse(localStorage.getItem("user"))?.role ===
                      "superAdmin" && (
                      <Button
                        size="sm"
                        style={{ background: "red.800" }}
                        onClick={() => setDelete(true)}
                        leftIcon={<DeleteIcon />}
                        colorScheme="red"
                      >
                        Delete
                      </Button>
                    )}
                </Flex>
              </GridItem>
            </Grid>
          </Card>
        </>
      )}
    </>
  );
};

export default View;
