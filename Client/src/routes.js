
import { Icon } from "@chakra-ui/react";
import { HiUsers } from "react-icons/hi";
import {
  MdContacts,
  MdHome,
  MdInsertChartOutlined,
  MdLeaderboard,
  MdLock
} from "react-icons/md";
// icon
import React from "react";
import { AiFillFolderOpen, AiOutlineMail } from "react-icons/ai";
import { FaCalendarAlt, FaRupeeSign, FaTasks } from "react-icons/fa";
import { LuBuilding2 } from "react-icons/lu";
import { PiPhoneCallBold } from "react-icons/pi";
import { LiaCriticalRole } from "react-icons/lia";
import { SiGooglemeet } from "react-icons/si";
import { ROLE_PATH } from "./roles";

// Admin Imports
const MainDashboard = React.lazy(() => import("views/admin/default"));

// My component
const Contact = React.lazy(() => import('views/admin/contact'));
const ContactView = React.lazy(() => import('views/admin/contact/View'));

const User = React.lazy(() => import("views/admin/users"));
const UserView = React.lazy(() => import("views/admin/users/View"));

const Property = React.lazy(() => import("views/admin/property"));
const PropertyView = React.lazy(() => import("views/admin/property/View"));

const Lead = React.lazy(() => import("views/admin/lead"));
const LeadView = React.lazy(() => import("views/admin/lead/View"));
const LeadImport = React.lazy(() => import("views/admin/lead/components/LeadImport"));

const Communication = React.lazy(() => import("views/admin/communication"));

const Task = React.lazy(() => import("views/admin/task"));
const TaskView = React.lazy(() => import("views/admin/task/components/taskView"));
const Calender = React.lazy(() => import("views/admin/calender"));
const Payments = React.lazy(() => import("views/admin/payments"));
const Role = React.lazy(() => import("views/admin/role"));

const Document = React.lazy(() => import("views/admin/document"));

const EmailHistory = React.lazy(() => import("views/admin/emailHistory"));
const EmailHistoryView = React.lazy(() => import("views/admin/emailHistory/View"));

const Meeting = React.lazy(() => import("views/admin/meeting"));
const MettingView = React.lazy(() => import("views/admin/meeting/View"));

const PhoneCall = React.lazy(() => import("views/admin/phoneCall"));
const PhoneCallView = React.lazy(() => import("views/admin/phoneCall/View"));

const Report = React.lazy(() => import("views/admin/reports"));

const TextMsg = React.lazy(() => import("views/admin/textMsg"));
const TextMsgView = React.lazy(() => import("views/admin/textMsg/View"));

// Auth Imports
const SignInCentered = React.lazy(() => import("views/auth/signIn"));


const user = JSON.parse(localStorage.getItem('user'))// Example array of ROLE_PATH values

const filterAccess = (rolesData) => {
  return rolesData?.map(role => {
    role.access = role?.access?.filter(access => (access.create || access.update || access.delete || access.view));
    return role;
  });
};

// Example usage:
const updatedRolesData = filterAccess(user?.roles);
let access = []
updatedRolesData?.map((item) => {
  item?.access?.map((data) => access.push(data))
})

const mergedPermissions = {};

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

const data = user?.roles && user?.roles?.map(data => `/${data.roleName}`)

const newRoute = [
  // ========================== Dashboard ==========================
  {
    name: "Dashboard",
    layout: data,
    path: "/default",
    icon: <Icon as={MdHome} width='20px' height='20px' color='inherit' />,
    component: MainDashboard,
  },
  // ========================== Admin Layout ==========================
  // ------------- lead Routes ------------------------
  {
    name: "Lead",
    layout: data,
    path: "/lead",
    icon: <Icon as={MdLeaderboard} width='20px' height='20px' color='inherit' />,
    component: Lead,
  },
  {
    name: "Lead View",
    layout: data,
    under: "lead",
    parentName: "Lead",
    path: "/leadView/:id",
    component: LeadView,
  },
  {
    name: "Lead Import",
    layout: data,
    under: "lead",
    parentName: "Lead",
    path: "/leadImport",
    component: LeadImport,
  },
  // --------------- contact Routes --------------------
  {
    name: "Contacts",
    layout: data,
    path: "/contacts",
    icon: <Icon as={MdContacts} width='20px' height='20px' color='inherit' />,
    component: Contact,
  },
  {
    name: "Contact View",
    layout: data,
    under: "contacts",
    parentName: "Contacts",
    path: "/contactView/:id",
    component: ContactView,
  },
  // ------------- Property Routes ------------------------
  {
    name: "Property",
    layout: data,
    path: "/properties",
    icon: <Icon as={LuBuilding2} width='20px' height='20px' color='inherit' />,
    component: Property,
  },
  {
    name: "Property View",
    layout: data,
    parentName: "Property",
    under: "properties",
    path: "/propertyView/:id",
    component: PropertyView,
  },

  // // ------------- Communication Integration Routes ------------------------
  // {
  //   name: "Communication Integration",
  //   layout: data,

  //   path: "/communication-integration",
  //   icon: <Icon as={GiSatelliteCommunication} width='20px' height='20px' color='inherit' />,
  //   component: Communication,
  // },
  // ------------- Task Routes ------------------------
  {
    name: "Task",
    layout: data,
    path: "/task",
    icon: <Icon as={FaTasks} width='20px' height='20px' color='inherit' />,
    component: Task,
  },
  {
    name: "Task View",
    layout: data,
    under: "task",
    parentName: "Task",
    path: "/view/:id",
    component: TaskView,
  },
  // ------------- Meeting Routes ------------------------
  {
    name: "Meeting",
    layout: data,
    path: "/metting",
    icon: <Icon as={SiGooglemeet} width='20px' height='20px' color='inherit' />,
    component: Meeting,
  },
  {
    name: "Meeting View",
    layout: data,
    under: "metting",
    parentName: "Meeting",
    path: "/metting/:id",
    component: MettingView,
  },
  // ------------- Phone Routes ------------------------
  {
    name: "Call",
    layout: data,
    path: "/phone-call",
    icon: <Icon as={PiPhoneCallBold} width='20px' height='20px' color='inherit' />,
    component: PhoneCall,
  },
  {
    name: "Call View",
    layout: data,
    under: "phone-call",
    parentName: "Call",
    path: "/phone-call/:id",
    component: PhoneCallView,
  },
  // ------------- Email Routes------------------------
  {
    // separator: 'History',
    name: "Email",
    layout: data,
    path: "/email",
    icon: <Icon as={AiOutlineMail} width='20px' height='20px' color='inherit' />,
    component: EmailHistory,
  },
  {
    name: "Email View",
    layout: data,
    under: "email",
    parentName: "Email",
    path: "/Email/:id",
    component: EmailHistoryView,
  },
  // ------------- Calender Routes ------------------------
  {
    name: "Calender",
    layout: data,
    path: "/calender",
    icon: <Icon as={FaCalendarAlt} width='20px' height='20px' color='inherit' />,
    component: Calender,
  },
  // ------------- Payments Routes ------------------------
  {
    name: "Payments",
    layout: data,
    path: "/payments",
    icon: <Icon as={FaRupeeSign} width='20px' height='20px' color='inherit' />,
    component: Payments,
  },

  // ------------- Roles Routes ------------------------
  {
    name: "Roles",
    layout: data,
    path: "/role",
    icon: <Icon as={LiaCriticalRole} width='20px' height='20px' color='inherit' />,
    component: Role,
  },
  // // ------------- Text message Routes ------------------------
  // {
  //   name: "Text Msg",
  //   layout: data,
  //
  //   path: "/text-msg",
  //   icon: <Icon as={MdOutlineMessage} width='20px' height='20px' color='inherit' />,
  //   component: TextMsg,
  // },
  // {
  //   name: "Text Msg View",
  //   layout: data,
  //
  //   under: "text-msg",
  //   path:  text-msg/:id",
  //   component: TextMsgView,
  // },
  // ------------- Document Routes ------------------------
  {
    name: "Documents",
    layout: data,
    path: "/documents",
    icon: <Icon as={AiFillFolderOpen} width='20px' height='20px' color='inherit' />,
    component: Document,
  },
  // ----------------- Reporting Layout -----------------
  {
    name: "Reporting and Analytics",
    layout: data,
    path: "/reporting-analytics",
    icon: <Icon as={MdInsertChartOutlined} width='20px' height='20px' color='inherit' />,
    component: Report,
  },
  // ------------- user Routes ------------------------
  {
    name: "Users",
    layout: data,
    path: "/user",
    icon: <Icon as={HiUsers} width='20px' height='20px' color='inherit' />,
    component: User,
  },
  {
    name: "User View",
    layout: data,
    parentName: "Email",
    under: "user",
    path: "/userView/:id",
    component: UserView,
  },
  // ========================== User layout ==========================

  // ========================== auth layout ==========================
  {
    name: "Sign In",
    layout: "/auth",
    path: "/sign-in",
    icon: <Icon as={MdLock} width='20px' height='20px' color='inherit' />,
    component: SignInCentered,
  },
];

let routes = user?.role !== "admin" ?
  [
    {
      name: "Dashboard",
      layout: data,
      path: "/default",
      icon: <Icon as={MdHome} width='20px' height='20px' color='inherit' />,
      component: MainDashboard,
    }, {
      name: "Sign In",
      layout: "/auth",
      path: "/sign-in",
      icon: <Icon as={MdLock} width='20px' height='20px' color='inherit' />,
      component: SignInCentered,
    }
  ] : newRoute

const accessRoute = user?.role !== "admin" && newRoute?.filter(item => Object.keys(mergedPermissions)?.find(data => data === item?.name?.toLowerCase()))
user?.role !== "admin" && routes.push(...accessRoute)

export default routes;
