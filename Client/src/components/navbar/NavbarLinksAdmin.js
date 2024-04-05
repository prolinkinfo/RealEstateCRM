// Chakra Imports
import {
	Avatar,
	Button,
	Flex,
	Icon,
	Image,
	Menu,
	MenuButton,
	MenuItem,
	MenuList,
	Text,
	useColorModeValue,
} from "@chakra-ui/react";
// Custom Components
import { ItemContent } from "components/menu/ItemContent";
import { SearchBar } from "components/navbar/searchBar/SearchBar";
import { SidebarResponsive } from "components/sidebar/Sidebar";
import PropTypes from "prop-types";
import { useEffect, useState } from "react";
// Assets
import { MdInfoOutline, MdNotificationsNone } from "react-icons/md";
import { FaEthereum } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { getApi } from "services/api";
import { toast } from "react-toastify";
import jwtDecode from "jwt-decode";
import { ThemeEditor } from "./ThemeEditor";
import FixedPlugin from "components/fixedPlugin/FixedPlugin";
import { useDispatch, useSelector } from "react-redux";
export default function HeaderLinks(props) {
	const { secondary, setOpenSidebar, openSidebar, routes } = props;
	// Chakra Color Mode
	const navbarIcon = useColorModeValue("gray.400", "white");
	let menuBg = useColorModeValue("white", "navy.800");
	const textColor = useColorModeValue("secondaryGray.900", "white");
	const textColorBrand = useColorModeValue("brand.700", "brand.400");
	const ethColor = useColorModeValue("gray.700", "white");
	const borderColor = useColorModeValue("#E6ECFA", "rgba(135, 140, 189, 0.3)");
	const ethBg = useColorModeValue("secondaryGray.300", "navy.900");
	const ethBox = useColorModeValue("white", "navy.800");
	const shadow = useColorModeValue(
		"14px 17px 40px 4px rgba(112, 144, 176, 0.18)",
		"14px 17px 40px 4px rgba(112, 144, 176, 0.06)"
	);
	// const borderButton = useColorModeValue('secondaryGray.500', 'whiteAlpha.200');

	// const [loginUser, setLoginUser] = useState();
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const userData = useSelector(state => state.user.user)

	const data = typeof userData === 'string' ? JSON.parse(userData) : userData
	const user = data?.firstName + " " + data?.lastName;
	const userId = JSON.parse(localStorage.getItem("user"))?._id;
	const loginUser = useSelector((state) => state?.user?.user)


	const [isLogoutScheduled, setIsLogoutScheduled] = useState(false);

	const logOut = (message) => {
		localStorage.clear();
		sessionStorage.clear();
		navigate("/auth");
		if (message) {
			toast.error(message);
		} else {
			toast.success("Log out Successfully");
		}
		setIsLogoutScheduled(true);
	};

	useEffect(() => {
		const token =
			localStorage.getItem("token") || sessionStorage.getItem("token");

		if (token) {
			try {
				const decodedToken = jwtDecode(token);
				const currentTime = Date.now() / 1000; // Convert milliseconds to seconds
				if (decodedToken.exp < currentTime) {
					if (!isLogoutScheduled) {
						logOut("Token has expired");
					}
				} else {
					// Schedule automatic logout when the token expires
					const timeToExpire = (decodedToken.exp - currentTime) * 1000; // Convert seconds to milliseconds
					setTimeout(() => {
						if (!isLogoutScheduled) {
							logOut("Token has expired");
						}
					}, timeToExpire);
				}
			} catch (error) {
				console.error("Error decoding token:", error);
			}
		}
	}, [isLogoutScheduled]);

	return (
		<Flex
			w={{ sm: "100%", md: "auto" }}
			alignItems="center"
			justifyContent={"end"}
			flexDirection="row"
			bg={menuBg}
			flexWrap={secondary ? { base: "wrap", md: "nowrap" } : "unset"}
			p="6px"
			mt={2.5}
			borderRadius="30px"
			boxShadow={shadow}
		>
			{/* <SearchBar
				mb={secondary ? { base: "10px", md: "unset" } : "unset"}
				me="10px"
				borderRadius="30px"
			/> */}

			<Flex
				bg={ethBg}
				display={secondary ? "flex" : "none"}
				borderRadius="30px"
				ms="auto"
				p="6px"
				align="center"
				me="6px"
			>
				<Flex
					align="center"
					justify="center"
					bg={ethBox}
					h="29px"
					w="29px"
					borderRadius="30px"
					me="7px"
				>
					<Icon color={ethColor} w="9px" h="14px" as={FaEthereum} />
				</Flex>
				<Text
					w="max-content"
					color={ethColor}
					fontSize="sm"
					fontWeight="700"
					me="6px"
				>
					1,924
					<Text as="span" display={{ base: "none", md: "unset" }}>
						{" "}
						ETH
					</Text>
				</Text>
			</Flex>

			<SidebarResponsive routes={routes} setOpenSidebar={setOpenSidebar} openSidebar={openSidebar} />

			<Menu>
				<MenuButton p="0px">
					<Icon
						mt="6px"
						as={MdNotificationsNone}
						color={navbarIcon}
						w="18px"
						h="18px"
						me="10px"
					/>
				</MenuButton>
				<MenuList
					boxShadow={shadow}
					p="20px"
					borderRadius="20px"
					bg={menuBg}
					border="none"
					mt="22px"
					me={{ base: "30px", md: "unset" }}
					minW={{ base: "unset", md: "400px", xl: "450px" }}
					maxW={{ base: "360px", md: "unset" }}
				>
					<Flex jusitfy="space-between" w="100%" mb="20px">
						<Text fontSize="md" fontWeight="600" color={textColor}>
							Notifications
						</Text>
						<Text
							fontSize="sm"
							fontWeight="500"
							color={textColorBrand}
							ms="auto"
							cursor="pointer"
						>
							Mark all read
						</Text>
					</Flex>
					<Flex flexDirection="column">
						<MenuItem
							_hover={{ bg: "none" }}
							_focus={{ bg: "none" }}
							px="0"
							borderRadius="8px"
							mb="10px"
						>
							<ItemContent info="Horizon UI Dashboard PRO" aName="Alicia" />
						</MenuItem>
						<MenuItem
							_hover={{ bg: "none" }}
							_focus={{ bg: "none" }}
							px="0"
							borderRadius="8px"
							mb="10px"
						>
							<ItemContent
								info="Horizon Design System Free"
								aName="Josh Henry"
							/>
						</MenuItem>
					</Flex>
				</MenuList>
			</Menu>
			{/* <FixedPlugin /> */}
			{/* <ThemeEditor navbarIcon={navbarIcon} /> */}

			<Menu style={{ zIndex: 1500 }}>
				<MenuButton p="0px">
					<Avatar
						_hover={{ cursor: "pointer" }}
						color="white"
						name={user || "Prolink Infotech"}
						bg="#11047A"
						size="sm"
						w="40px"
						h="40px"
					/>
				</MenuButton>
				<MenuList
					boxShadow={shadow}
					p="0px"
					mt="10px"
					borderRadius="20px"
					bg={menuBg}
					border="none"
				>
					<Flex w="100%" mb="0px">
						<Text
							ps="20px"
							pt="16px"
							pb="10px"
							w="100%"
							borderBottom="1px solid"
							borderColor={borderColor}
							fontSize="sm"
							fontWeight="700"
							textTransform={"capitalize"}
							color={textColor}
						>
							👋&nbsp; Hey, {user}
						</Text>
					</Flex>

					<Flex flexDirection="column" p="10px">
						<MenuItem
							_hover={{ bg: "none" }}
							_focus={{ bg: "none" }}
							borderRadius="8px"
							px="14px"
						>
							<Text fontSize="sm" onClick={() => navigate(`/admin/`)}>
								Home
							</Text>
						</MenuItem>

						{loginUser?.role === "superAdmin" &&
							<MenuItem
								_hover={{ bg: "none" }}
								_focus={{ bg: "none" }}
								borderRadius="8px"
								px="14px"
							>
								<Text
									fontSize="sm"
									onClick={() =>
										navigate('/admin-setting')
									}
								>
									Admin Settings
								</Text>
							</MenuItem>}
						<MenuItem
							_hover={{ bg: "none" }}
							_focus={{ bg: "none" }}
							borderRadius="8px"
							px="14px"
						>
							<Text
								fontSize="sm"
								onClick={() =>
									navigate(
										`/userView/${JSON.parse(localStorage.getItem("user"))?._id}`
									)
								}
							>
								Profile Settings
							</Text>
						</MenuItem>
						{/*<MenuItem _hover={{ bg: 'none' }} _focus={{ bg: 'none' }} borderRadius="8px" px="14px">
							<Text fontSize="sm">Newsletter Settings</Text>
						</MenuItem> */}
						<MenuItem
							_hover={{ bg: "none" }}
							onClick={logOut}
							_focus={{ bg: "none" }}
							color="red.400"
							borderRadius="8px"
							px="14px"
						>
							<Text fontSize="sm">Log out</Text>
						</MenuItem>
					</Flex>
				</MenuList>
			</Menu>
		</Flex>
	);
}

HeaderLinks.propTypes = {
	variant: PropTypes.string,
	fixed: PropTypes.bool,
	secondary: PropTypes.bool,
	onOpen: PropTypes.func,
};
