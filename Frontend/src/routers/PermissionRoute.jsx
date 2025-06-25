import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const PermissionRoute = ({ children, requiredId }) => {
  const { isLoggedIn, user } = useSelector((state) => state.auth);
  const hasPermission = user?.permissions?.some((p) => p.id === requiredId);

  if (!isLoggedIn || !hasPermission) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default PermissionRoute;