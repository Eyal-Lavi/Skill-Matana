import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { selectIsAuthenticated, selectPermissions } from "../features/auth/authSelectors";

const ProtectedRoute = ({ children, requiredId }) => {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const permissions = useSelector(selectPermissions);
  const hasPermission = permissions.some(p => p.id === requiredId);

  if (!isAuthenticated) {
    return <Navigate to="/auth/login" replace />;
  }
  if (!requiredId) {
    console.warn("Warning: <PermissionRoute> used without requiredId prop.");
    return <Navigate to="/" replace />;

  }

  if (!hasPermission) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};

export default ProtectedRoute;