// Chakra imports
import { Portal, Box, useDisclosure, Flex, Spinner } from '@chakra-ui/react';
import Footer from 'components/footer/FooterAdmin.js';
// Layout components
import Navbar from 'components/navbar/NavbarAdmin.js';
import Sidebar from 'components/sidebar/Sidebar.js';
// import Spinner from 'components/spinner/Spinner';
import { SidebarContext } from 'contexts/SidebarContext';
import { Suspense } from 'react';
import { useState } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import routes from 'routes.js';

// Custom Chakra theme
export default function Dashboard(props) {
	const { ...rest } = props;
	// states and functions
	const [fixed] = useState(false);
	const [toggleSidebar, setToggleSidebar] = useState(false);
	// functions for changing the states from components
	const getRoute = () => {
		return window.location.pathname !== '/admin/full-screen-maps';
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
				if (window.location.href.indexOf(routes[i].both === true ? routes[i].path.replace("/:id", "") : routes[i].layout + routes[i].path.replace("/:id", "")) !== -1) {
					return routes[i].name;
				}
			}
		}
		return activeRoute;
	};
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
				if (window.location.href.indexOf(routes[i].layout + routes[i].path.replace("/:id", "")) !== -1) {
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
				if (window.location.href.indexOf(routes[i].layout + routes[i].path) !== -1) {
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
				if (window.location.href.indexOf(routes[i].layout + routes[i].path) !== -1) {
					return routes[i].messageNavbar;
				}
			}
		}
		return activeNavbar;
	};

	const getRoutes = (routes) => {
		return routes.map((prop, key) => {
			if (!prop.under && prop.layout === '/admin') {
				return <Route path={prop.both === true ? prop.path : prop.layout + prop.path} element={<prop.component />} key={key} />;
			} else if (prop.under) {
				return <Route path={prop.layout + prop.path} element={<prop.component />} key={key} />
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
					<Sidebar routes={routes} display='none' {...rest} />
					<Box
						float='right'
						minHeight='100vh'
						height='100%'
						overflow='auto'
						position='relative'
						maxHeight='100%'
						w={{ base: '100%', xl: 'calc( 100% - 290px )' }}
						maxWidth={{ base: '100%', xl: 'calc( 100% - 290px )' }}
						transition='all 0.33s cubic-bezier(0.685, 0.0473, 0.346, 1)'
						transitionDuration='.2s, .2s, .35s'
						transitionProperty='top, bottom, width'
						transitionTimingFunction='linear, linear, ease'>
						<Portal>
							<Box>
								<Navbar
									onOpen={onOpen}
									logoText={'Horizon UI Dashboard PRO'}
									brandText={getActiveRoute(routes)}
									secondary={getActiveNavbar(routes)}
									message={getActiveNavbarText(routes)}
									fixed={fixed}
									under={under(routes)}
									{...rest}
								/>
							</Box>
						</Portal>
						<Box pt={{ base: "150px", md: "95px", xl: "95px" }}>
							{getRoute() ? (
								<Box mx='auto' p={{ base: '20px', md: '30px' }} pe='20px' minH='84vh' pt='50px'>
									<Suspense fallback={
										<Flex justifyContent={'center'} alignItems={'center'} width="100%" >
											<Spinner />
										</Flex>
									}>
										<Routes>
											{getRoutes(routes)}
											<Route path="/*" element={<Navigate to="/admin/default" />} />
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
