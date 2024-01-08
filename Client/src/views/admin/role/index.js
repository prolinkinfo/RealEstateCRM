import { AddIcon } from "@chakra-ui/icons";
import { Button, Grid, GridItem, useDisclosure } from "@chakra-ui/react";
import CheckTable from "./components/CheckTable";
import { useEffect, useState } from "react";
import { getApi } from "services/api";

const Index = () => {
  const columns = [
    {
      Header: "#",
      accessor: "_id",
      isSortable: false,
      width: 10,
      display: false
    },

    { Header: "Role Name", accessor: "roleName" },
    { Header: "Description", accessor: "description" }
  ];
  // const { isOpen, onOpen, onClose } = useDisclosure();
  const [action, setAction] = useState(false);
  const [isLoding, setIsLoding] = useState(false);
  const [data, setData] = useState([]);
  const size = "lg";

  // const handleClick = () => {
  //   onOpen();
  // };


  const fetchData = async () => {
    setIsLoding(true);
    let result = await getApi("api/role-access");
    setData(result.data);
    setIsLoding(false);
  };



  return (
    <div>
      {/* <Grid templateColumns="repeat(6, 1fr)" mb={3} gap={1}>
                <GridItem colStart={6} textAlign={"right"}>
                    <Button onClick={() => handleClick()} leftIcon={<AddIcon />} variant="brand">Add</Button>
                </GridItem>
            </Grid> */}
      <CheckTable
        // isOpen={isOpen}
        // onClose={onClose}
        tableData={data}
        setAction={setAction}
        fetchData={fetchData}
        action={action}
        columnsData={columns}
      />
    </div>
  );
};

export default Index;
