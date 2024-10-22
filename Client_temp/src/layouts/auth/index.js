import { Suspense, useState } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import routes from "routes.js";

// Chakra imports
import { Box, Flex, useColorModeValue } from "@chakra-ui/react";

// Layout components
import { SidebarContext } from "contexts/SidebarContext";
import Spinner from "components/spinner/Spinner";

// Custom Chakra theme
export default function Auth({ setIsLogin }) {

  // states and functions
  const [toggleSidebar, setToggleSidebar] = useState(false);
  // functions for changing the states from components
  const getRoute = () => {
    return window.location.pathname !== "/auth/full-screen-maps";
  };
  const getRoutes = (routes) => {
    return routes.map((prop, key) => {
      if (prop.layout === "/auth") {
        return (
          <Route
            path={prop.layout + prop.path}
            element={<prop.component />}
            key={key}
          />
        );
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

  const authBg = useColorModeValue("white", "navy.900");
  document.documentElement.dir = "ltr";
  return (
    <Box>
      <SidebarContext.Provider
        value={{
          toggleSidebar,
          setToggleSidebar,
        }}>
        <Box
          bg={authBg}
          float='right'
          minHeight='100vh'
          height='100%'
          position='relative'
          w='100%'
          transition='all 0.33s cubic-bezier(0.685, 0.0473, 0.346, 1)'
          transitionDuration='.2s, .2s, .35s'
          transitionProperty='top, bottom, width'
          transitionTimingFunction='linear, linear, ease'
        >
          {getRoute() ? (
            <Box mx='auto' minH='100vh' >
              <Suspense fallback={
                <Flex justifyContent={'center'} alignItems={'center'} width="100%" height={'100vh'}>
                  <Spinner />
                </Flex>
              }>
                <Routes>
                  {getRoutes(routes)}
                  <Route path="/*" element={<Navigate to="/auth/sign-in" />} />
                </Routes>
              </Suspense>
            </Box>
          ) : null}
        </Box>
      </SidebarContext.Provider>
    </Box>
  );
}
