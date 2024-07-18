
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
import { FaCalendarAlt, FaRupeeSign, FaTasks, FaWpforms } from "react-icons/fa";
import { LuBuilding2 } from "react-icons/lu";
import { PiPhoneCallBold } from "react-icons/pi";
import { FaCreativeCommonsBy } from "react-icons/fa";
import { SiGooglemeet } from "react-icons/si";
import { ROLE_PATH } from "./roles";
import ChangeImage from "views/admin/image";
import Validation from "views/admin/validation";
import CustomField from "views/admin/customField";
import TableField from "views/admin/tableField";
import activeDeactiveModule from "views/admin/activeDeactiveModule";
import { TbExchange, TbTableColumn } from "react-icons/tb";
import { GrValidate } from "react-icons/gr";
import { VscFileSubmodule } from "react-icons/vsc";
import { HiTemplate } from "react-icons/hi";
import { TbBulb } from "react-icons/tb";
import { BsBlockquoteRight } from "react-icons/bs";
import { RiAccountCircleFill } from "react-icons/ri";
import { TbInvoice } from "react-icons/tb";
import { TbFileInvoice } from "react-icons/tb";
// Admin Imports
const MainDashboard = React.lazy(() => import("views/admin/default"));

// My component
const Contact = React.lazy(() => import('views/admin/contact'));
const ContactView = React.lazy(() => import('views/admin/contact/View'));
const ContactImport = React.lazy(() => import("views/admin/contact/components/ContactImport"));

const Quotes = React.lazy(() => import('views/admin/quotes'));
const QuotesView = React.lazy(() => import('views/admin/quotes/View'));
const QuotesImport = React.lazy(() => import("views/admin/quotes/components/QuotesImport"));

const Invoices = React.lazy(() => import('views/admin/invoice'));
const InvoicesView = React.lazy(() => import('views/admin/invoice/View'));
const InvoicesImport = React.lazy(() => import("views/admin/invoice/components/InvoiceImport"));

const User = React.lazy(() => import("views/admin/users"));
const UserView = React.lazy(() => import("views/admin/users/View"));

const Property = React.lazy(() => import("views/admin/property"));
const PropertyView = React.lazy(() => import("views/admin/property/View"));
const PropertyImport = React.lazy(() => import("views/admin/property/components/PropertyImport"))

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
const EmailTemplate = React.lazy(() => import("views/admin/emailTemplate"));
const AddEdit = React.lazy(() => import("views/admin/emailTemplate/AddEdit"));
const templateView = React.lazy(() => import("views/admin/emailTemplate/view.js"));

// Auth Imports
const SignInCentered = React.lazy(() => import("views/auth/signIn"));
// admin setting 
const AdminSetting = React.lazy(() => import("views/admin/adminSetting"));
const validation = React.lazy(() => import("views/admin/validation"));
const module = React.lazy(() => import("views/admin/moduleName"));
const Opportunities = React.lazy(() => import("views/admin/opportunities"));
const OpportunitiesView = React.lazy(() => import("views/admin/opportunities/View"));
const OpportunitiesImport = React.lazy(() => import("views/admin/opportunities/components/OpprtunityImport"));
const Account = React.lazy(() => import("views/admin/account"));
const AccountView = React.lazy(() => import("views/admin/account/View"));
const AccountImport = React.lazy(() => import("views/admin/account/components/AccountImport"));

const routes = [
  // ========================== Dashboard ==========================
  {
    name: "Dashboard",
    layout: [ROLE_PATH.superAdmin, ROLE_PATH.user],
    path: "/default",
    icon: <Icon as={MdHome} width='20px' height='20px' color='inherit' />,
    component: MainDashboard,
  },
  // ========================== Admin Layout ==========================
  // ------------- lead Routes ------------------------
  {
    name: "Leads",
    layout: [ROLE_PATH.superAdmin, ROLE_PATH.user],
    path: "/lead",
    icon: <Icon as={MdLeaderboard} width='20px' height='20px' color='inherit' />,
    component: Lead,
  },
  {
    name: "Leads",
    layout: [ROLE_PATH.superAdmin, ROLE_PATH.user],
    under: "lead",
    parentName: "Leads",
    path: "/leadView/:id",
    component: LeadView,
  },
  {
    name: "Lead Import",
    layout: [ROLE_PATH.superAdmin, ROLE_PATH.user],
    under: "lead",
    parentName: "Leads",
    path: "/leadImport",
    component: LeadImport,
  },
  // --------------- contact Routes --------------------
  {
    name: "Contacts",
    layout: [ROLE_PATH.superAdmin, ROLE_PATH.user],
    path: "/contacts",
    icon: <Icon as={MdContacts} width='20px' height='20px' color='inherit' />,
    component: Contact,
  },
  {
    name: "Contacts",
    layout: [ROLE_PATH.superAdmin, ROLE_PATH.user],
    under: "contacts",
    parentName: "Contacts",
    path: "/contactView/:id",
    component: ContactView,
  },
  {
    name: "Contact Import",
    layout: [ROLE_PATH.superAdmin, ROLE_PATH.user],
    both: true,
    under: "contacts",
    parentName: "Contacts",
    path: "/contactImport",
    component: ContactImport,
  },
  // ------------- Property Routes ------------------------
  {
    name: "Properties",
    layout: [ROLE_PATH.superAdmin, ROLE_PATH.user],
    path: "/properties",
    icon: <Icon as={LuBuilding2} width='20px' height='20px' color='inherit' />,
    component: Property,
  },
  {
    name: "Properties",
    layout: [ROLE_PATH.superAdmin, ROLE_PATH.user],
    parentName: "Properties",
    under: "properties",
    path: "/propertyView/:id",
    component: PropertyView,
  },
  {
    name: "Property Import",
    layout: [ROLE_PATH.superAdmin, ROLE_PATH.user],
    both: true,
    under: "properties",
    parentName: "Properties",
    path: "/propertyImport",
    component: PropertyImport,
  },

  // -----------------------------Opportunities-------------------------------------
  {
    name: "Opportunities",
    layout: [ROLE_PATH.superAdmin, ROLE_PATH.user],
    path: "/opportunities",
    icon: <Icon as={TbBulb} width='20px' height='20px' color='inherit' />,
    component: Opportunities,
  },
  {
    name: "Opportunities",
    layout: [ROLE_PATH.superAdmin, ROLE_PATH.user],
    path: "/opportunitiesView/:id",
    under: "opportunities",
    parentName: "Opportunities",
    icon: <Icon as={TbBulb} width='20px' height='20px' color='inherit' />,
    component: OpportunitiesView,
  },
  {
    name: "Opportunities",
    layout: [ROLE_PATH.superAdmin, ROLE_PATH.user],
    path: "/opprotunitiesImport",
    under: "opportunities",
    parentName: "Opportunities",
    icon: <Icon as={TbBulb} width='20px' height='20px' color='inherit' />,
    component: OpportunitiesImport,
  },
  // -----------------------------Account-------------------------------------
  {
    name: "Account",
    layout: [ROLE_PATH.superAdmin, ROLE_PATH.user],
    path: "/account",
    icon: <Icon as={RiAccountCircleFill} width='20px' height='20px' color='inherit' />,
    component: Account,
  },
  {
    name: "Account",
    layout: [ROLE_PATH.superAdmin, ROLE_PATH.user],
    path: "/accountView/:id",
    under: "account",
    parentName: "Account",
    icon: <Icon as={RiAccountCircleFill} width='20px' height='20px' color='inherit' />,
    component: AccountView,
  },
  {
    name: "Account",
    layout: [ROLE_PATH.superAdmin, ROLE_PATH.user],
    path: "/accountImport",
    under: "account",
    parentName: "Account",
    icon: <Icon as={RiAccountCircleFill} width='20px' height='20px' color='inherit' />,
    component: AccountImport,
  },
  // --------------- Quotes Routes --------------------
  {
    name: "Quotes",
    layout: [ROLE_PATH.superAdmin, ROLE_PATH.user],
    path: "/quotes",
    icon: <Icon as={BsBlockquoteRight} width='20px' height='20px' color='inherit' />,
    component: Quotes,
  },
  {
    name: "Quotes",
    layout: [ROLE_PATH.superAdmin, ROLE_PATH.user],
    under: "quotes",
    parentName: "Quotes",
    path: "/quotesView/:id",
    component: QuotesView,
  },
  {
    name: "Quotes Import",
    layout: [ROLE_PATH.superAdmin, ROLE_PATH.user],
    both: true,
    under: "quotes",
    parentName: "Quotes",
    path: "/quotesImport",
    component: QuotesImport,
  },
  // --------------- Invoices Routes --------------------
  {

    name: "Invoices",
    layout: [ROLE_PATH.superAdmin, ROLE_PATH.user],
    path: "/invoices",
    icon: <Icon as={TbFileInvoice} width='20px' height='20px' color='inherit' />,
    component: Invoices,
  },
  {
    name: "Invoices",
    layout: [ROLE_PATH.superAdmin, ROLE_PATH.user],
    under: "invoices",
    parentName: "Invoices",
    path: "/invoicesView/:id",
    component: InvoicesView,
  },
  {
    name: "Invoices Import",
    layout: [ROLE_PATH.superAdmin, ROLE_PATH.user],
    both: true,
    under: "invoices",
    parentName: "Invoices",
    path: "/invoicesImport",
    component: InvoicesImport,
  },

  // // ------------- Communication Integration Routes ------------------------
  // {
  //   name: "Communication Integration",
  //   layout: [ROLE_PATH.admin, ROLE_PATH.user],

  //   path: "/communication-integration",
  //   icon: <Icon as={GiSatelliteCommunication} width='20px' height='20px' color='inherit' />,
  //   component: Communication,
  // },
  // ------------- Task Routes ------------------------
  {
    name: "Tasks",
    layout: [ROLE_PATH.superAdmin, ROLE_PATH.user],
    path: "/task",
    icon: <Icon as={FaTasks} width='20px' height='20px' color='inherit' />,
    component: Task,
  },
  {
    name: "Tasks",
    layout: [ROLE_PATH.superAdmin, ROLE_PATH.user],
    under: "task",
    parentName: "Tasks",
    path: "/view/:id",
    component: TaskView,
  },
  // ------------- Meeting Routes ------------------------
  {
    name: "Meetings",
    layout: [ROLE_PATH.superAdmin, ROLE_PATH.user],
    path: "/metting",
    icon: <Icon as={SiGooglemeet} width='20px' height='20px' color='inherit' />,
    component: Meeting,
  },
  {
    name: "Meetings ",
    layout: [ROLE_PATH.superAdmin, ROLE_PATH.user],
    under: "Meetings",
    parentName: "Meetings",
    path: "/metting/:id",
    component: MettingView,
  },
  // ------------- Phone Routes ------------------------
  {
    name: "Calls",
    layout: [ROLE_PATH.superAdmin, ROLE_PATH.user],
    path: "/phone-call",
    icon: <Icon as={PiPhoneCallBold} width='20px' height='20px' color='inherit' />,
    component: PhoneCall,
  },
  {
    name: "Calls",
    layout: [ROLE_PATH.superAdmin, ROLE_PATH.user],
    under: "phone-call",
    parentName: "Calls",
    path: "/phone-call/:id",
    component: PhoneCallView,
  },
  // ------------- Email Routes------------------------
  {
    // separator: 'History',
    name: "Emails",
    layout: [ROLE_PATH.superAdmin, ROLE_PATH.user],
    path: "/email",
    icon: <Icon as={AiOutlineMail} width='20px' height='20px' color='inherit' />,
    component: EmailHistory,
  },
  {
    name: "Emails ",
    layout: [ROLE_PATH.superAdmin, ROLE_PATH.user],
    under: "Emails",
    parentName: "Emails",
    path: "/Email/:id",
    component: EmailHistoryView,
  },
  // -----------------------------Email Template-------------------------------------
  {
    name: "Email Template",
    layout: [ROLE_PATH.superAdmin, ROLE_PATH.user],
    path: "/email-template",
    icon: <Icon as={HiTemplate} width='20px' height='20px' color='inherit' />,
    component: EmailTemplate,
  },
  {
    name: "Add Email Template",
    layout: [ROLE_PATH.superAdmin, ROLE_PATH.user],
    under: "email-template",
    parentName: "Email Template",
    path: "/email-template/email-template-addEdit",
    icon: <Icon as={HiTemplate} width='20px' height='20px' color='inherit' />,
    component: AddEdit,
  },
  {
    name: "Email Template",
    layout: [ROLE_PATH.superAdmin, ROLE_PATH.user],
    under: "email-template",
    parentName: "Email Template",
    path: "/email-template/:id",
    icon: <Icon as={HiTemplate} width='20px' height='20px' color='inherit' />,
    component: templateView,
  },
  // ------------- Calender Routes ------------------------
  {
    name: "Calender",
    layout: [ROLE_PATH.superAdmin, ROLE_PATH.user],
    path: "/calender",
    icon: <Icon as={FaCalendarAlt} width='20px' height='20px' color='inherit' />,
    component: Calender,
  },
  // ------------- Payments Routes ------------------------
  {
    name: "Payments",
    layout: [ROLE_PATH.superAdmin, ROLE_PATH.user],
    path: "/payments",
    icon: <Icon as={FaRupeeSign} width='20px' height='20px' color='inherit' />,
    component: Payments,
  },

  // -----------------------------Admin setting-------------------------------------
  {
    name: "Admin Setting",
    layout: [ROLE_PATH.superAdmin, ROLE_PATH.user],
    // parentName: "admin",
    under: "admin",
    path: "/admin-setting",
    component: AdminSetting,
  },
  {
    name: "Roles",
    layout: [ROLE_PATH.superAdmin, ROLE_PATH.user],
    path: "/role",
    under: "role",
    icon: <Icon as={FaCreativeCommonsBy} width='20px' height='20px' color='inherit' />,
    component: Role,
  },
  {
    name: "Custom Fields",
    layout: [ROLE_PATH.superAdmin, ROLE_PATH.user],
    path: "/custom-Fields",
    under: "customField",
    icon: <Icon as={FaWpforms} width='20px' height='20px' color='inherit' />,
    component: CustomField,
  },
  {
    name: "Change Images",
    layout: [ROLE_PATH.superAdmin, ROLE_PATH.user],
    path: "/change-images",
    under: "image",
    icon: <Icon as={TbExchange} width='20px' height='20px' color='inherit' />,
    component: ChangeImage,
  },
  {
    name: "Validation",
    layout: [ROLE_PATH.superAdmin, ROLE_PATH.user],
    path: "/validations",
    under: "Validation",
    icon: <Icon as={GrValidate} width='20px' height='20px' color='inherit' />,
    component: Validation,
  },
  {
    name: "Table Fields",
    layout: [ROLE_PATH.superAdmin, ROLE_PATH.user],
    path: "/table-field",
    under: "tableField",
    icon: <Icon as={TbTableColumn} width='20px' height='20px' color='inherit' />,
    component: TableField,
  },
  {
    name: "Active Deactive Module",
    layout: [ROLE_PATH.superAdmin, ROLE_PATH.user],
    path: "/active-deactive-module",
    under: "activeDeactiveModule",
    icon: <Icon as={TbTableColumn} width='20px' height='20px' color='inherit' />,
    component: activeDeactiveModule,
  },
  {
    name: "Module",
    layout: [ROLE_PATH.superAdmin, ROLE_PATH.user],
    path: "/module",
    under: "module",
    icon: <Icon as={VscFileSubmodule} width='20px' height='20px' color='inherit' />,
    component: module,
  },
  // // ------------- Text message Routes ------------------------
  // {
  //   name: "Text Msg",
  //   layout: [ROLE_PATH.admin, ROLE_PATH.user],
  //
  //   path: "/text-msg",
  //   icon: <Icon as={MdOutlineMessage} width='20px' height='20px' color='inherit' />,
  //   component: TextMsg,
  // },
  // {
  //   name: "Text Msg View",
  //   layout: [ROLE_PATH.admin, ROLE_PATH.user],
  //
  //   under: "text-msg",
  //   path:  text-msg/:id",
  //   component: TextMsgView,
  // },
  // ------------- Document Routes ------------------------
  {
    name: "Documents",
    layout: [ROLE_PATH.superAdmin, ROLE_PATH.user],
    path: "/documents",
    icon: <Icon as={AiFillFolderOpen} width='20px' height='20px' color='inherit' />,
    component: Document,
  },
  // ----------------- Reporting Layout -----------------
  {
    name: "Reporting and Analytics",
    layout: [ROLE_PATH.superAdmin, ROLE_PATH.user],
    path: "/reporting-analytics",
    icon: <Icon as={MdInsertChartOutlined} width='20px' height='20px' color='inherit' />,
    component: Report,
  },
  // ------------- user Routes ------------------------
  {
    name: "Users",
    layout: [ROLE_PATH.superAdmin, ROLE_PATH.user],
    path: "/user",
    under: "user",
    icon: <Icon as={HiUsers} width='20px' height='20px' color='inherit' />,
    component: User,
  },
  {
    name: "User View",
    layout: [ROLE_PATH.superAdmin, ROLE_PATH.user],
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

export default routes;
