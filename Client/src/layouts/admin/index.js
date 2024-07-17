// Chakra imports
import { Portal, Box, useDisclosure, Flex, Icon } from '@chakra-ui/react';
import Footer from 'components/footer/FooterAdmin.js';
// Layout components
import Navbar from 'components/navbar/NavbarAdmin.js';
import Sidebar from 'components/sidebar/Sidebar.js';
import Spinner from 'components/spinner/Spinner';
import { SidebarContext } from 'contexts/SidebarContext';
import React, { Suspense, useEffect } from 'react';
import { useState } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { ROLE_PATH } from '../../roles';
import newRoutes from 'routes.js';
import { useDispatch, useSelector } from 'react-redux';
import { fetchImage } from '../../redux/slices/imageSlice';
import { getApi } from 'services/api';
import { MdHome, MdLock } from 'react-icons/md';
import DynamicPage from 'views/admin/dynamicPage';
import DynamicPageview from 'views/admin/dynamicPage/DynamicPageview';
import { fetchRouteData } from '../../redux/slices/routeSlice';
import { LuChevronRightCircle } from 'react-icons/lu';
import { fetchRoles } from '../../redux/slices/roleSlice';
import { fetchModules } from '../../redux/slices/moduleSlice';

const MainDashboard = React.lazy(() => import("views/admin/default"));

// Custom Chakra theme
export default function Dashboard(props) {
	const { ...rest } = props;
	// states and functions
	const [fixed] = useState(false);
	const [toggleSidebar, setToggleSidebar] = useState(false);
	const [openSidebar, setOpenSidebar] = useState(false)
	// const user = JSON.parse(localStorage.getItem("user"))
	const userId = JSON.parse(localStorage.getItem("user"))?._id;

	// let routes = newRoutes;
	const [routes, setRoutes] = useState(newRoutes)
	const route = useSelector((state) => state?.route?.data)
	const modules = useSelector((state) => state?.modules?.data)
	const dispatch = useDispatch();

	const pathName = (name) => {
		return `/${name?.toLowerCase()?.replace(/ /g, '-')}`;
	}

	const getRoute = () => {
		return window.location.pathname !== '/admin/full-screen-maps';
	};

	const dynamicRoute = () => {
		let apiData = []

		route && route?.length > 0 && route?.map((item, i) => {
			let rec = routes.find(route => route?.name === item?.moduleName)
			if (!routes.some(route => route?.name === item?.moduleName)) {

				const newRoute = [{
					name: item?.moduleName,
					layout: [ROLE_PATH.superAdmin],
					path: pathName(item.moduleName),
					icon: item?.icon ? (
						<img src={item?.icon} width="20px" height="20px" alt="icon" />
					) : (
						<Icon as={LuChevronRightCircle} width="20px" height="20px" color="inherit" />
					),
					component: DynamicPage,
				},
				{
					name: item?.moduleName,
					layout: [ROLE_PATH.superAdmin],
					under: item?.moduleName,
					parentName: item?.moduleName,
					path: `${pathName(item.moduleName)}/:id`,
					icon: item?.icon ? (
						<img src={item?.icon} width="20px" height="20px" alt="icon" />
					) : (
						<Icon as={LuChevronRightCircle} width="20px" height="20px" color="inherit" />
					),
					component: DynamicPageview,
				}
				]
				setRoutes((pre) => [...pre, ...newRoute])
			} else if (routes.some(route => route?.name === item?.moduleName) && rec.icon?.props?.src !== item?.icon) {

				const updatedData = routes?.map(i => {
					if (i.name === item?.moduleName) {
						return { ...i, icon: <img src={item?.icon} width="20px" height="20px" alt="icon" /> };
					}
					return i;
				});
				setRoutes(updatedData)
			}
			if (routes.find(route => route?.name !== item?.moduleName)) {

				if (!newRoutes.find(route => route?.name?.toLowerCase() === item?.moduleName?.toLowerCase())) {

					const newRoute = [{
						name: item?.moduleName,
						layout: [ROLE_PATH.superAdmin],
						path: pathName(item.moduleName),
						icon: item?.icon ? (
							<img src={item?.icon} width="20px" height="20px" alt="icon" />
						) : (
							<Icon as={LuChevronRightCircle} width="20px" height="20px" color="inherit" />
						),
						component: DynamicPage,
					},
					{
						name: item?.moduleName,
						layout: [ROLE_PATH.superAdmin],
						under: item?.moduleName,
						parentName: item?.moduleName,
						path: `${pathName(item.moduleName)}/:id`,
						icon: item?.icon ? (
							<img src={item?.icon} width="20px" height="20px" alt="icon" />
						) : (
							<Icon as={LuChevronRightCircle} width="20px" height="20px" color="inherit" />
						),
						component: DynamicPageview,
					}
					]

					apiData.push(...newRoute)
				}
			}

		});

		let filterData = [...newRoutes, ...apiData]

		const activeModel = modules?.filter(module => module?.isActive)?.map(module => module?.moduleName);

		const activeRoutes = filterData?.filter(
			(data) =>
				activeModel?.includes(data?.name) ||
				activeModel?.includes(data?.parentName) ||
				!modules?.some(
					(module) =>
						module?.moduleName === data?.name ||
						module?.moduleName === data?.parentName
				)
		);

		setRoutes(activeRoutes)

	};

	const getActiveRoute = (routes) => {
		let activeRoute = 'Prolink';
		for (let i = 0; i < routes.length; i++) {
			if (routes[i].collapse) {
				let collapseActiveRoute = getActiveRoute(routes[i].items);
				if (collapseActiveRoute !== activeRoute) {
					return collapseActiveRoute;
				}
			} else if (routes[i].category) {
				let categoryActiveRoute = getActiveRoute(routes[i].items);
				if (categoryActiveRoute !== activeRoute) {
					return categoryActiveRoute;
				}
			} else {
				if (window.location.href.indexOf(routes[i].path.replace("/:id", "")) !== -1) {
					return routes[i].name;
				}
			}
		}
		return activeRoute;
	};


	useEffect(() => {
		dynamicRoute();
	}, [route, modules]);

	useEffect(async () => {
		if (window.location.pathname === "/default") {
			await dispatch(fetchRouteData());
			await dispatch(fetchImage());
		}
		await dispatch(fetchModules())
	}, []);

	const largeLogo = useSelector((state) => state?.images?.images?.filter(item => item?.isActive === true));

	const under = (routes) => {
		let activeRoute = false
		for (let i = 0; i < routes.length; i++) {
			if (routes[i].collapse) {
				let collapseActiveRoute = getActiveRoute(routes[i].items);
				if (collapseActiveRoute !== activeRoute) {
					return collapseActiveRoute;
				}
			} else if (routes[i].category) {
				let categoryActiveRoute = getActiveRoute(routes[i].items);
				if (categoryActiveRoute !== activeRoute) {
					return categoryActiveRoute;
				}
			} else {
				if (window.location.href.indexOf(routes[i].path.replace("/:id", "")) !== -1) {
					return routes[i];
				}
			}
		}
		return activeRoute;
	};

	const getActiveNavbar = (routes) => {
		let activeNavbar = false;
		for (let i = 0; i < routes.length; i++) {
			if (routes[i].collapse) {
				let collapseActiveNavbar = getActiveNavbar(routes[i].items);
				if (collapseActiveNavbar !== activeNavbar) {
					return collapseActiveNavbar;
				}
			} else if (routes[i].category) {
				let categoryActiveNavbar = getActiveNavbar(routes[i].items);
				if (categoryActiveNavbar !== activeNavbar) {
					return categoryActiveNavbar;
				}
			} else {
				if (window.location.href.indexOf(routes[i].path) !== -1) {
					return routes[i].secondary;
				}
			}
		}
		return activeNavbar;
	};
	const getActiveNavbarText = (routes) => {
		let activeNavbar = false;
		for (let i = 0; i < routes.length; i++) {
			if (routes[i].collapse) {
				let collapseActiveNavbar = getActiveNavbarText(routes[i].items);
				if (collapseActiveNavbar !== activeNavbar) {
					return collapseActiveNavbar;
				}
			} else if (routes[i].category) {
				let categoryActiveNavbar = getActiveNavbarText(routes[i].items);
				if (categoryActiveNavbar !== activeNavbar) {
					return categoryActiveNavbar;
				}
			} else {
				if (window.location.href.indexOf(routes[i].path) !== -1) {
					return routes[i].messageNavbar;
				}
			}
		}
		return activeNavbar;
	};

	const getRoutes = (routes) => {
		return routes.map((prop, key) => {
			// if (!prop.under && prop.layout === '/superAdmin') {
			if (!prop.under && prop.layout?.includes(ROLE_PATH.superAdmin)) {
				return <Route path={prop.path} element={<prop.component />} key={key} />;
			} else if (prop.under) {
				return <Route path={prop.path} element={<prop.component />} key={key} />
			}
			if (prop.collapse) {
				return getRoutes(prop.items);
			}
			if (prop.category) {
				return getRoutes(prop.items);
			} else {
				return null;
			}
		});
	};

	useEffect(() => {
		if (window.location.pathname === "/default") {
			dispatch(fetchRoles(userId))
		}
	}, [userId]);

	document.documentElement.dir = 'ltr';
	const { onOpen } = useDisclosure();
	document.documentElement.dir = 'ltr';
	return (
		<Box>
			<Box>
				<SidebarContext.Provider
					value={{
						toggleSidebar,
						setToggleSidebar
					}}>
					<Sidebar routes={routes} largeLogo={largeLogo} display='none' {...rest} openSidebar={openSidebar} setOpenSidebar={setOpenSidebar} />
					<Box
						float='right'
						minHeight='100vh'
						height='100%'

						overflow='auto'
						position='relative'
						maxHeight='100%'
						// w={{ base: '100%', xl: 'calc( 100% - 290px )' }}
						w={{ base: '100%', xl: openSidebar === true ? 'calc( 100% - 300px )' : 'calc( 100% - 88px )' }}
						maxWidth={{ base: '100%', xl: openSidebar === true ? 'calc( 100% - 300px )' : 'calc( 100% - 88px )' }}
						transition='all 0.33s cubic-bezier(0.685, 0.0473, 0.346, 1)'
						transitionDuration='.2s, .2s, .35s'
						transitionProperty='top, bottom, width'
						transitionTimingFunction='linear, linear, ease'>
						<Portal >
							<Box className="header">
								<Navbar
									onOpen={onOpen}
									logoText={'Horizon UI Dashboard PRO'}
									brandText={getActiveRoute(routes)}
									secondary={getActiveNavbar(routes)}
									message={getActiveNavbarText(routes)}
									routes={routes}
									fixed={fixed}
									under={under(routes)}
									largeLogo={largeLogo}
									openSidebar={openSidebar} setOpenSidebar={setOpenSidebar}
									{...rest}
								/>
							</Box>
						</Portal>
						<Box pt={{ base: "150px", md: "95px", xl: "95px" }}>
							{getRoute() ? (
								<Box mx='auto' pe='20px' minH='84vh' pt='50px' style={{ padding: openSidebar ? '8px 20px 8px 0px' : '8px 20px' }}>
									<Suspense fallback={
										<Flex justifyContent={'center'} alignItems={'center'} width="100%" >
											<Spinner />
										</Flex>
									}>
										<Routes>
											{getRoutes(routes)}
											<Route path="/*" element={<Navigate to="/default" />} />
										</Routes>
									</Suspense>
								</Box>
							) : null}
						</Box>
						<Box>
							<Footer />
						</Box>
					</Box>
				</SidebarContext.Provider>
			</Box>
		</Box>
	);
}
