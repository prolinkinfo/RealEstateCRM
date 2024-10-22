// Chakra imports
import { Portal, Box, useDisclosure, Text, Button, Link, Flex, Icon } from '@chakra-ui/react';
import Footer from 'components/footer/FooterAdmin.js';
// Layout components
import Navbar from 'components/navbar/NavbarAdmin.js';
import Sidebar from 'components/sidebar/Sidebar.js';
import { SidebarContext } from 'contexts/SidebarContext';
import React, { Suspense, useEffect, useState } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { ROLE_PATH } from '../../roles';
import newRoute from 'routes.js';
import { MdHome, MdLock } from 'react-icons/md';
import Spinner from 'components/spinner/Spinner';
import { useDispatch, useSelector } from 'react-redux';
import { fetchImage } from '../../redux/slices/imageSlice';
import { getApi } from 'services/api';
import DynamicPage from 'views/admin/dynamicPage';
import { LuChevronRightCircle } from 'react-icons/lu';
import { FaCalendarAlt } from 'react-icons/fa';
import { fetchModules } from '../../redux/slices/moduleSlice';

const MainDashboard = React.lazy(() => import("views/admin/default"));
const SignInCentered = React.lazy(() => import("views/auth/signIn"));
const Calender = React.lazy(() => import("views/admin/calender"));
const UserView = React.lazy(() => import("views/admin/users/View"));

// Custom Chakra theme
export default function User(props) {
    const { ...rest } = props;
    // states and functions
    const [fixed] = useState(false);
    const [toggleSidebar, setToggleSidebar] = useState(false);
    const [route, setRoute] = useState();
    const [openSidebar, setOpenSidebar] = useState(true)
    const user = JSON.parse(localStorage.getItem("user"))
    const modules = useSelector((state) => state?.modules?.data)
    // functions for changing the states from components
    const getRoute = () => {
        return window.location.pathname !== '/admin/full-screen-maps';
    };


    const fetchRoute = async () => {
        let response = await getApi("api/route/");
        setRoute(response?.data);
    };

    const pathName = (name) => {
        return `/${name.toLowerCase().replace(/ /g, '-')}`;
    }


    useEffect(() => {
        fetchRoute();
    }, []);

    const layoutName = user?.roles?.map(item => `/${item.roleName}`)

    const filterAccess = (rolesData) => {
        return rolesData?.map(role => {
            role.access = role?.access?.filter(access => access.view);
            return role;
        });
    };

    // Example usage:
    const updatedRolesData = filterAccess(user?.roles);
    let access = []
    updatedRolesData?.map((item) => {
        item?.access?.map((data) => access.push(data))
    })

    let mergedPermissions = {};

    access.forEach((permission) => {
        const { title, ...rest } = permission;

        if (!mergedPermissions[title]) {
            mergedPermissions[title] = { ...rest };
        } else {
            // Merge with priority to true values
            Object.keys(rest).forEach((key) => {
                if (mergedPermissions[title][key] !== true) {
                    mergedPermissions[title][key] = rest[key];
                }
            });
        }
    });

    let routes =
        [
            {
                name: "Dashboard",
                layout: [ROLE_PATH.user],
                path: "/default",
                icon: <Icon as={MdHome} width='20px' height='20px' color='inherit' />,
                component: MainDashboard,
            }, {
                name: "Sign In",
                layout: "/auth",
                path: "/sign-in",
                icon: <Icon as={MdLock} width='20px' height='20px' color='inherit' />,
                component: SignInCentered,
            },
            {
                name: "Calender",
                layout: [ROLE_PATH.user],
                path: "/calender",
                icon: <Icon as={FaCalendarAlt} width='20px' height='20px' color='inherit' />,
                component: Calender,
            },
            {
                name: "User View",
                layout: [ROLE_PATH.superAdmin, ROLE_PATH.user],
                parentName: "Email",
                under: "user",
                path: "/userView/:id",
                component: UserView,
            },
        ]

    route?.map((item, i) => {
        if (!newRoute.some(route => route.name === item.moduleName)) {
            return (
                newRoute.push({
                    name: item?.moduleName,
                    layout: [ROLE_PATH.user],
                    path: pathName(item.moduleName),
                    icon: <Icon as={LuChevronRightCircle} width='20px' height='20px' color='inherit' />,
                    component: DynamicPage,
                })
            )
        }
    })
    const accessRoute = newRoute?.filter(item => Object.keys(mergedPermissions)?.find(data => (data?.toLowerCase() === item?.name?.toLowerCase()) || (data?.toLowerCase() === item.parentName?.toLowerCase())))

    // routes.push(...accessRoute)
    let filterData = [...accessRoute]

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
    routes.push(...activeRoutes)

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
    const under = (routes) => {
        let activeRoute = false
        for (let i = 0; i < routes?.length; i++) {
            if (routes[i]?.collapse) {
                let collapseActiveRoute = getActiveRoute(routes[i]?.items);
                if (collapseActiveRoute !== activeRoute) {
                    return collapseActiveRoute;
                }
            } else if (routes[i]?.category) {
                let categoryActiveRoute = getActiveRoute(routes[i]?.items);
                if (categoryActiveRoute !== activeRoute) {
                    return categoryActiveRoute;
                }
            } else {
                if (window.location.href?.indexOf(routes[i]?.path?.replace("/:id", "")) !== -1) {
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
        return routes?.map((prop, key) => {
            // if (!prop.under && prop.layout === '/admin') {
            if (!prop?.under && prop?.layout !== '/auth') {
                return <Route path={prop?.path} element={prop && <prop.component />} key={key} />;
            } else if (prop?.under) {
                return <Route path={prop?.path} element={prop && <prop.component />} key={key} />
            }
            if (prop?.collapse) {
                return getRoutes(prop?.items);
            }
            if (prop?.category) {
                return getRoutes(prop?.items);
            } else {
                return null;
            }
        });
    };
    document.documentElement.dir = 'ltr';
    const { onOpen } = useDisclosure();
    document.documentElement.dir = 'ltr';

    const dispatch = useDispatch();

    useEffect(() => {
        // Dispatch the fetchRoles action on component mount
        dispatch(fetchImage());
        dispatch(fetchModules())

    }, [dispatch]);

    const largeLogo = useSelector((state) => state?.images?.images?.filter(item => item?.isActive === true));


    return (
        <Box>
            <Box>
                <SidebarContext.Provider
                    value={{
                        toggleSidebar,
                        setToggleSidebar
                    }}>
                    <Sidebar routes={routes} display='none' {...rest} openSidebar={openSidebar} setOpenSidebar={setOpenSidebar} largeLogo={largeLogo} />
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
                        <Portal>
                            <Box className='header'>
                                <Navbar
                                    onOpen={onOpen}
                                    logoText={'Horizon UI Dashboard PRO'}
                                    brandText={getActiveRoute(routes)}
                                    secondary={getActiveNavbar(routes)}
                                    message={getActiveNavbarText(routes)}
                                    fixed={fixed}
                                    routes={routes}
                                    under={under(routes)}
                                    largeLogo={largeLogo}
                                    openSidebar={openSidebar} setOpenSidebar={setOpenSidebar}
                                    {...rest}
                                />
                            </Box>
                        </Portal>
                        <Box pt={{ base: "150px", md: "95px", xl: "95px" }}>
                            {getRoute() ? (
                                <Box mx='auto' pe='20px' minH='84vh' pt='50px' style={{ padding: openSidebar ? '8px 20px 8px 20px' : '8px 20px' }}>
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
