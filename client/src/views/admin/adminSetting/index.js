import { Icon, SimpleGrid } from '@chakra-ui/react';
import MiniStatistics from "components/card/MiniStatistics";
import IconBox from 'components/icons/IconBox';
import { FaCreativeCommonsBy, FaWpforms } from "react-icons/fa";
import { HiUsers } from "react-icons/hi";
import { TbExchange } from "react-icons/tb";
import { useNavigate } from 'react-router-dom';
import { GrValidate } from "react-icons/gr";
import { TbTableColumn } from "react-icons/tb";
import { VscFileSubmodule } from "react-icons/vsc";
import { IoIosSwitch } from "react-icons/io";

const Index = () => {
    const navigate = useNavigate();
    return (
        <div>
            <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} gap="20px" mb="20px">
                <MiniStatistics
                    fontsize="md"
                    onClick={() => navigate("/user")}
                    startContent={
                        <IconBox
                            w="56px"
                            h="56px"
                            bg="linear-gradient(90deg, #4481EB 0%, #04BEFE 100%)"
                            icon={<Icon w="28px" h="28px" as={HiUsers} color="white" />}
                        />
                    }
                    name="Users"
                />
                <MiniStatistics
                    fontsize="md"
                    onClick={() => navigate("/role")}
                    startContent={
                        <IconBox
                            w="56px"
                            h="56px"
                            bg="linear-gradient(90deg, #4481EB 0%, #04BEFE 100%)"
                            icon={<Icon w="28px" h="28px" as={FaCreativeCommonsBy} color="white" />}
                        />

                    }
                    name="Roles"
                />
                <MiniStatistics
                    fontsize="md"
                    onClick={() => navigate("/change-images")}
                    startContent={
                        <IconBox
                            w="56px"
                            h="56px"
                            bg="linear-gradient(90deg, #4481EB 0%, #04BEFE 100%)"
                            icon={<Icon w="28px" h="28px" as={TbExchange} color="white" />}
                        />

                    }
                    name="Change Images"
                />
                <MiniStatistics
                    fontsize="md"
                    onClick={() => navigate("/custom-Fields")}
                    startContent={
                        <IconBox
                            w="56px"
                            h="56px"
                            bg="linear-gradient(90deg, #4481EB 0%, #04BEFE 100%)"
                            icon={<Icon w="28px" h="28px" as={FaWpforms} color="white" />}
                        />

                    }
                    name="Custom Fields"
                />
                <MiniStatistics
                    fontsize="md"
                    onClick={() => navigate("/validations")}
                    startContent={
                        <IconBox
                            w="56px"
                            h="56px"
                            bg="linear-gradient(90deg, #4481EB 0%, #04BEFE 100%)"
                            icon={<Icon w="28px" h="28px" as={GrValidate} color="white" />}
                        />

                    }
                    name="Validations"

                />
                <MiniStatistics
                    fontsize="md"
                    onClick={() => navigate("/table-field")}
                    startContent={
                        <IconBox
                            w="56px"
                            h="56px"
                            bg="linear-gradient(90deg, #4481EB 0%, #04BEFE 100%)"
                            icon={<Icon w="28px" h="28px" as={TbTableColumn} color="white" />}
                        />
                    }
                    name="Table Fields"
                />
                <MiniStatistics
                    fontsize="md"
                    onClick={() => navigate("/module")}
                    startContent={
                        <IconBox
                            w="56px"
                            h="56px"
                            bg="linear-gradient(90deg, #4481EB 0%, #04BEFE 100%)"
                            icon={<Icon w="28px" h="28px" as={VscFileSubmodule} color="white" />}
                        />
                    }
                    name="Module"
                />
                <MiniStatistics
                    fontsize="md"
                    onClick={() => navigate("/active-deactive-module")}
                    startContent={
                        <IconBox
                            w="56px"
                            h="56px"
                            bg="linear-gradient(90deg, #4481EB 0%, #04BEFE 100%)"
                            icon={<Icon w="28px" h="28px" as={IoIosSwitch} color="white" />}
                        />
                    }
                    name="Active Deactive Module"
                />
            </SimpleGrid>
        </div>
    )
}

export default Index
