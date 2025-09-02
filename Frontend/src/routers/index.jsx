import { createBrowserRouter, Navigate, Navigate } from "react-router-dom";
import MainLayout from "../layout/MainLayout";
import Dashboard from "../pages/Dashboard";
import DashboardLayout from "../components/DashboardLayout";
import DashboardSkills from "../pages/DashboardSkills";
import DashboardPlaceholder from "../components/DashboardPlaceholder";
import Home from "../pages/Home";
import Authentication from "../pages/Authentication";
import Register from "../pages/Register";
import Login from "../pages/Login";
import GuestRoute from "./GuestRoute";
import AdminRoute from "./AdminRoute";
import AdminPanel from "../pages/AdminPanel";
import AdminLayout from "../components/AdminLayout";
import Error from "../pages/Error";
import ProtectedRoute from "./ProtectedRoute";
import AuthenticatedRoute from "./AuthenticatedRoute";
import Profile from "../pages/Profile";
import ChatAI from "../pages/ChatAI";
import HomeSecond from "../pages/HomeSecond";
import Search from "../pages/Search";
const router = createBrowserRouter([
  {
    element: <MainLayout />,
    errorElement: <Error />,
    children: [
      // { path: "/", element: <HomeSecond /> },
      { path: "/", element: <Home /> },
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
            path: "bookmarks",
            element: <DashboardPlaceholder title="Bookmarks" description="Save and organize your favorite skills and resources" />,
          },
          {
            path: "notifications",
            element: <DashboardPlaceholder title="Notifications" description="Stay updated with your skill-related activities and messages" />,
          },
          {
            path: "settings",
            element: <DashboardPlaceholder title="Settings" description="Customize your dashboard and account preferences" />,
          },
        ],
      },
      // {
      //   path: "search",
      //   element: (
      //     <AuthenticatedRoute>
      //       <Search />
      //     </AuthenticatedRoute>
      //   ),
      // },
      {
        path: "profile",
        element: (
          <AuthenticatedRoute>
            <Profile />
          </AuthenticatedRoute>
        ),
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
          { path: "users", element: <div>Users Management</div> },
          { path: "skills", element: <SkillManagement /> },
          { path: "settings", element: <div>Settings</div> },
        ]
      },
    ],
  },
]);

export default router;
