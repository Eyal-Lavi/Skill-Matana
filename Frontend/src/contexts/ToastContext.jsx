import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
} from "react";

const ToastContext = createContext(null);

function makeId() {
  try {
    // Supported in modern browsers; safe fallback below.
    return crypto.randomUUID();
  } catch {
    return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
  }
}

function ToastViewport({ toasts, onDismiss }) {
  return (
    <div className="sm-toast-viewport" role="region" aria-label="Notifications">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={`sm-toast sm-toast--${t.type}`}
          role="status"
          aria-live="polite"
        >
          <div className="sm-toast__message">{t.message}</div>
          <button
            type="button"
            className="sm-toast__close"
            onClick={() => onDismiss(t.id)}
            aria-label="Dismiss notification"
          >
            ×
          </button>
        </div>
      ))}
    </div>
  );
}

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const timersRef = useRef(new Map());

  const remove = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
    const timer = timersRef.current.get(id);
    if (timer) clearTimeout(timer);
    timersRef.current.delete(id);
  }, []);

  const push = useCallback(
    ({ message, type = "info", duration = 4000 }) => {
      const id = makeId();
      setToasts((prev) => [...prev, { id, message, type }]);

      if (duration && duration > 0) {
        const timer = setTimeout(() => remove(id), duration);
        timersRef.current.set(id, timer);
      }

      return id;
    },
    [remove]
  );

  const api = useMemo(
    () => ({
      push,
      remove,
      success: (message, duration) =>
        push({ message, type: "success", duration }),
      error: (message, duration) => push({ message, type: "error", duration }),
      info: (message, duration) => push({ message, type: "info", duration }),
      warning: (message, duration) =>
        push({ message, type: "warning", duration }),
    }),
    [push, remove]
  );

  return (
    <ToastContext.Provider value={api}>
      {children}
      <ToastViewport toasts={toasts} onDismiss={remove} />
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    throw new Error("useToast must be used within <ToastProvider />");
  }
  return ctx;
}

