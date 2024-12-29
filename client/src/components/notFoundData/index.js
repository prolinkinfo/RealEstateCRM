import { Image, Box } from "@chakra-ui/react";
import React from "react";

const DataNotFound = ({ message }) => {
  return (
    <Box display={"flex"} justifyContent={"center"} alignItems={"center"}>
      {message || "-- No Data Found --"}
    </Box>
  );
};

export default DataNotFound;
