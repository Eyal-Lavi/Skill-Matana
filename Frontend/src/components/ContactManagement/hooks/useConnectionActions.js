
import { useCallback } from "react";

export const useConnectionActions = (onRefresh = () => {}) => {
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

        onRefresh();
      } catch (err) {
        throw new Error(err?.message || "Failed to update request");
      }
    },
    [onRefresh]
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

  return { handleSendConnectionRequest, handleUpdateRequestStatus, handleCancelRequest };
};
