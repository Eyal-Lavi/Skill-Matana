import React, { createContext, useCallback, useContext, useRef, useState } from "react";
import ConfirmDialog from "../utils/components/ConfirmDialog/ConfirmDialog";

const ConfirmContext = createContext(null);

export function ConfirmProvider({ children }) {
  const resolveRef = useRef(null);
  const [state, setState] = useState({ isOpen: false, options: null });

  const confirm = useCallback((options = {}) => {
    return new Promise((resolve) => {
      resolveRef.current = resolve;
      setState({
        isOpen: true,
        options: {
          title: "Confirm",
          message: "",
          confirmText: "Confirm",
          cancelText: "Cancel",
          danger: false,
          ...options,
        },
      });
    });
  }, []);

  const close = useCallback((result) => {
    setState({ isOpen: false, options: null });
    const resolve = resolveRef.current;
    resolveRef.current = null;
    resolve?.(result);
  }, []);

  return (
    <ConfirmContext.Provider value={confirm}>
      {children}
      <ConfirmDialog
        isOpen={state.isOpen}
        {...(state.options || {})}
        onConfirm={() => close(true)}
        onCancel={() => close(false)}
        onClose={() => close(false)}
      />
    </ConfirmContext.Provider>
  );
}

export function useConfirm() {
  const ctx = useContext(ConfirmContext);
  if (!ctx) {
    throw new Error("useConfirm must be used within <ConfirmProvider />");
  }
  return ctx;
}

