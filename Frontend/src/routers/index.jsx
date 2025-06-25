import { createBrowserRouter } from "react-router-dom";
import MainLayout from "../layout/MainLayout";
import Dashboard from "../pages/Dashboard";
import Home from "../pages/Home";
import Authentication from "../pages/Authentication";
import Register from "../pages/Register";
import Login from "../pages/Login";
import ProtectedRoute from "./ProtectedRoute";
import GuestRoute from "./GuestRoute";
import AdminRoute from "./AdminRoute";
import AdminPanel from "../pages/AdminPanel";
import Error from "../pages/Error";

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
              <GuestRoute>
                <Register />
              </GuestRoute>
            ),
          },
        ],
      },
      {
        path: "dashboard",
        element: (
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
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
