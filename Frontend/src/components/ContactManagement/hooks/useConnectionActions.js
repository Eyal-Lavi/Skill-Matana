
import { useCallback } from "react";
import { useDispatch } from "react-redux";
import { authActions } from "../../../features/auth/AuthSlices";

export const useConnectionActions = (onRefresh = () => {}) => {
  const dispatch = useDispatch();
  const handleSendConnectionRequest = useCallback(
    async (selectedUserId, message) => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/connection-requests`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({ targetUserId: selectedUserId, message }),
          }
        );

        if (!response.ok) {
          let serverMessage = "Failed to send request";
          try {
            const errorData = await response.json();
            if (errorData?.message) serverMessage = errorData.message;
          } catch (_) {

          }
          throw new Error(serverMessage);
        }

        onRefresh();
      } catch (err) {
        throw new Error(err?.message || "Failed to send request");
      }
    },
    [onRefresh]
  );

  const handleUpdateRequestStatus = useCallback(
    async (requestId, status) => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/connection-requests/${requestId}`,
          {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({ status }),
          }
        );

        if (!response.ok) {
          let serverMessage = "Failed to update request";
          try {
            const errorData = await response.json();
            if (errorData?.message) serverMessage = errorData.message;
          } catch (_) {}
          throw new Error(serverMessage);
        }

        const data = await response.json();
        
        // If approved and we have new connection data, add it to Redux
        if (status === 'approved' && data.newConnection) {
          dispatch(authActions.addConnection(data.newConnection));
        }

        onRefresh();
      } catch (err) {
        throw new Error(err?.message || "Failed to update request");
      }
    },
    [onRefresh, dispatch]
  );

  const handleCancelRequest = useCallback(
    async (requestId) => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/connection-requests/${requestId}`,
          {
            method: "DELETE",
            credentials: "include",
          }
        );

        if (!response.ok) {
          let serverMessage = "Failed to cancel request";
          try {
            const errorData = await response.json();
            if (errorData?.message) serverMessage = errorData.message;
          } catch (_) {}
          throw new Error(serverMessage);
        }

        onRefresh();
      } catch (err) {
        throw new Error(err?.message || "Failed to cancel request");
      }
    },
    [onRefresh]
  );

  const handleDisconnectConnection = useCallback(
    async (targetUserId) => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/connection-requests/connections/disconnect`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({ targetUserId }),
          }
        );

        if (!response.ok) {
          let serverMessage = "Failed to disconnect";
          try {
            const errorData = await response.json();
            if (errorData?.message) serverMessage = errorData.message;
          } catch (_) {}
          throw new Error(serverMessage);
        }

        onRefresh();
      } catch (err) {
        throw new Error(err?.message || "Failed to disconnect");
      }
    },
    [onRefresh]
  );

  const refreshConnections = useCallback(
    async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/connection-requests/connections`,
          {
            method: "GET",
            credentials: "include",
          }
        );

        if (!response.ok) {
          console.error("Failed to refresh connections");
          return;
        }

        const data = await response.json();
        if (data.data) {
          dispatch(authActions.setConnections(data.data));
        }
      } catch (err) {
        console.error("Failed to refresh connections:", err);
      }
    },
    [dispatch]
  );

  return { handleSendConnectionRequest, handleUpdateRequestStatus, handleCancelRequest, handleDisconnectConnection, refreshConnections };
};
