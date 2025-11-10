import { createBrowserRouter, Navigate } from "react-router-dom";
import MainLayout from "../layout/MainLayout";
import Dashboard from "../pages/dashboard/Dashboard";
import DashboardLayout from "../components/DashboardLayout";
import DashboardSkills from "../pages/dashboard/DashboardSkills";
import DashboardPlaceholder from "../components/DashboardPlaceholder";
import Home from "../pages/home/Home";
import Authentication from "../pages/auth/Authentication";
import Register from "../pages/auth/Register";
import Login from "../pages/auth/Login";
import GuestRoute from "./GuestRoute";
import AdminRoute from "./AdminRoute";
import AdminPanel from "../pages/admin/AdminPanel";
import AdminLayout from "../components/AdminLayout/AdminLayout";
import Error from "../pages/info/Error";
import ProtectedRoute from "./ProtectedRoute";
import AuthenticatedRoute from "./AuthenticatedRoute";
import Profile from "../pages/user/Profile";
import ChatAI from "../pages/ai/ChatAI";
import HomeSecond from "../pages/home/HomeSecond";
import Search from "../pages/search/Search";
import ResetPassword from "../features/auth/ResetPassword";
import ForgotPassword from "../features/auth/ForgotPassword";
import ResetGuardRoute from './ResetGuardRoute';
import SkillManagement from "../components/SkillManagement";
import ContactManagement from "../components/ContactManagement";
import MeetingRoom from "../pages/meeting/MeetingRoom";
import MyAvailability from "../pages/user/MyAvailability";
import Notifications from "../pages/user/Notifications";
import UserManagement from "../components/UserManagement";
import NotificationManagement from "../components/NotificationManagement";
import About from "../pages/info/About";
import TermsPrivacy from "../pages/info/TermsPrivacy";
import Contact from "../pages/contact/Contact";
const router = createBrowserRouter([
  {
    element: <MainLayout />,
    errorElement: <Error />,
    children: [
    
      { path: "/", 
        element:
        <GuestRoute>
          <Home />
        </GuestRoute>
      },
      { path: "/about", element: <About /> },
      { path: "/terms-privacy", element: <TermsPrivacy /> },
      { path: "/contact", element: <Contact /> },
      {
        path: "auth",
        element: <Authentication />,
        children: [
          {
            path: "login",
            element: (
              <GuestRoute>
                <Login />
              </GuestRoute>
            ),
          },
          {
            path: "register",
            element: (
              <GuestRoute >
                <Register />
              </GuestRoute>
            ),
          },
          {
            path:'forgot-password',
            element:(
              <GuestRoute>
                <ForgotPassword/>
              </GuestRoute>
            )
          },
          {
            path:'reset-password/:token',
            element:(
              <ResetGuardRoute>
                <ResetPassword/>
              </ResetGuardRoute>
            )
          },
          {
            path:'reset-password',
            element:<Navigate to='/auth/login'/>
          }
        ],
      },
      {
        path: "dashboard",
        element: (
          <AuthenticatedRoute>
            <DashboardLayout />
          </AuthenticatedRoute>
        ),
        children: [
          {
            index: true,
            element: <Dashboard />,
          },
          {
            path: "search",
            element: <Search />,
          },
          {
            path: "profile",
            element: <Profile />,
          },
          {
            path: "skills",
            element: <DashboardSkills />,
          },
          {
            path: "contact-requests",
            element: <ContactManagement />,
          },
          {
            path: "availability",
            element: <MyAvailability />,
          },
          {
            path: "bookmarks",
            element: <DashboardPlaceholder title="Bookmarks" description="Save and organize your favorite skills and resources" />,
          },
          {
            path: "notifications",
            element: <Notifications />,
          },
          {
            path: "settings",
            element: <DashboardPlaceholder title="Settings" description="Customize your dashboard and account preferences" />,
          },
        ],
      },
      {
        path: "profile",
        element: (
          <AuthenticatedRoute>
            <Profile />
          </AuthenticatedRoute>
        ),
      },
      {
        path: "meeting/:meetingId",
        element: <MeetingRoom />,
      },
      {
        path: "admin",
        element: (
          <AdminRoute>
            <AdminLayout />
          </AdminRoute>
        ),
        children: [
          { index: true, element: <AdminPanel /> },
          { path: "users", element: <UserManagement /> },
          { path: "skills", element: <SkillManagement /> },
          { path: "notifications", element: <NotificationManagement /> },
        ]
      },
    ],
  },
]);

export default router;
