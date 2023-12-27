import { AddIcon } from "@chakra-ui/icons";
import { Button, Grid, GridItem, useDisclosure } from "@chakra-ui/react";
import CheckTable from "./components/CheckTable";
import { useState } from "react";

const Index = () => {
  const columns = [
    {
      Header: "#",
      accessor: "_id",
      isSortable: false,
      width: 10,
      display:false
    },

    { Header: "title", accessor: "title" },
    { Header: "create", accessor: "create", width: '20px'},
    { Header: "view", accessor: "view",width: '20px' },
    { Header: "update", accessor: "update",width: '20px'},
    { Header: "delete", accessor: "delete",width: '20px' },
  ];
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [action, setAction] = useState(false);
  const size = "lg";

  const handleClick = () => {
    onOpen();
  };

  return (
    <div>
      {/* <Grid templateColumns="repeat(6, 1fr)" mb={3} gap={1}>
                <GridItem colStart={6} textAlign={"right"}>
                    <Button onClick={() => handleClick()} leftIcon={<AddIcon />} variant="brand">Add</Button>
                </GridItem>
            </Grid> */}
      <CheckTable
        isOpen={isOpen}
        onClose={onClose}
        setAction={setAction}
        onOpen={onOpen}
        action={action}
        columnsData={columns}
      />
    </div>
  );
};

export default Index;
