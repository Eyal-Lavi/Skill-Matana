import { createBrowserRouter } from "react-router-dom";
import MainLayout from "../layout/MainLayout";
import Dashboard from "../pages/Dashboard";
import Home from "../pages/Home";
import Authentication from "../pages/Authentication";
import Register from "../pages/Register";
import Login from "../pages/Login";
import GuestRoute from "./GuestRoute";
import AdminRoute from "./AdminRoute";
import AdminPanel from "../pages/AdminPanel";
import Error from "../pages/Error";
import ProtectedRoute from "./ProtectedRoute";
import AuthenticatedRoute from "./AuthenticatedRoute";
import Profile from "../pages/Profile";

const router = createBrowserRouter([
  {
    element: <MainLayout />,
    errorElement: <Error />,
    children: [
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
        ],
      },
      {
        path: "dashboard",
        element: (
          <AuthenticatedRoute>
            <Dashboard />
          </AuthenticatedRoute>
        ),
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
        path: "admin",
        element: (
          <AdminRoute>
            <AdminPanel />
          </AdminRoute>
        ),
      },
    ],
  },
]);

export default router;
