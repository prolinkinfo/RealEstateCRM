import { Icon, SimpleGrid, useColorModeValue } from '@chakra-ui/react';
import MiniStatistics from "components/card/MiniStatistics";
import IconBox from 'components/icons/IconBox';
import { FaCreativeCommonsBy, FaWpforms } from "react-icons/fa";
import { HiUsers } from "react-icons/hi";
import { TbExchange } from "react-icons/tb";
import { useNavigate } from 'react-router-dom';
import { GrValidate } from "react-icons/gr";
import { TbTableColumn } from "react-icons/tb";
import { VscFileSubmodule } from "react-icons/vsc";


const Index = () => {
    const navigate = useNavigate();
    const brandColor = useColorModeValue("brand.500", "white");
    const boxBg = useColorModeValue("secondaryGray.300", "whiteAlpha.100");

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
                // value={task?.length || 0}
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
                // value={contactData?.length || 0}
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
            </SimpleGrid>
        </div>
    )
}

export default Index
