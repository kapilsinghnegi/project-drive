import { createContext, useContext, useState, useCallback } from "react";

const ToastContext = createContext(null);

let idCounter = 0;

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const show = useCallback((type, message) => {
    const id = ++idCounter;
    setToasts((prev) => [...prev, { id, type, message }]);

    setTimeout(() => {
      removeToast(id);
    }, 3500);
  }, [removeToast]);

  const toastApi = {
    success: (msg) => show("success", msg),
    error: (msg) => show("error", msg),
    info: (msg) => show("info", msg),
  };

  return (
    <ToastContext.Provider value={toastApi}>
      {children}
      <div className="fixed top-4 right-4 z-50 space-y-2">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={[
              "min-w-[220px] max-w-xs px-4 py-2.5 rounded-lg shadow-lg text-sm flex items-start gap-2 border backdrop-blur",
              toast.type === "success"
                ? "bg-emerald-500/10 border-emerald-500/40 text-emerald-100"
                : toast.type === "error"
                  ? "bg-rose-500/10 border-rose-500/40 text-rose-100"
                  : "bg-slate-700/80 border-slate-500/40 text-slate-100",
            ].join(" ")}
          >
            <span className="mt-0.5">
              {toast.type === "success" && "✔"}
              {toast.type === "error" && "✖"}
              {toast.type === "info" && "ℹ"}
            </span>
            <span>{toast.message}</span>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    // eslint-disable-next-line no-console
    console.warn("useToast must be used within a ToastProvider");
    return {
      success: () => {},
      error: () => {},
      info: () => {},
    };
  }
  return ctx;
}


