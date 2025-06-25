import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import {selectIsAuthenticated} from "../features/auth/AuthSelectors";

const GuestRoute = ({ children }) => {
  const isAuthenticated = useSelector(selectIsAuthenticated);

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default GuestRoute;
