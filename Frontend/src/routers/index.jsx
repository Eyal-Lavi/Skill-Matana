import { createBrowserRouter } from "react-router-dom";
import MainLayout from "../layout/MainLayout";
import Dashboard from "../pages/Dashboard";
import Home from "../pages/Home";
import Authentication from "../pages/Authentication";
import Register from "../pages/Register";
import Login from "../pages/Login";

const router = createBrowserRouter([
  {
    element: <MainLayout />,
    children: [
      { path: "/", element: <Home /> },
      {
        path: "auth", element: <Authentication />, children: [
          { path: "login", element: <Login /> },
          { path: "register", element: <Register /> }
        ]

      },
      { path: "dashboard", element: <Dashboard /> },
    ],
  },
]);

export default router;
