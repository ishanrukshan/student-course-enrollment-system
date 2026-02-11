import { useState, useEffect, useCallback, createContext, useContext } from "react";

// ===== Toast Context =====
const ToastContext = createContext(null);

export function useToast() {
    const ctx = useContext(ToastContext);
    if (!ctx) throw new Error("useToast must be used within ToastProvider");
    return ctx;
}

// ===== Toast Provider =====
export function ToastProvider({ children }) {
    const [toasts, setToasts] = useState([]);

    const addToast = useCallback((message, type = "success", duration = 4000) => {
        const id = Date.now() + Math.random();
        setToasts((prev) => [...prev, { id, message, type, duration, exiting: false }]);
    }, []);

    const removeToast = useCallback((id) => {
        setToasts((prev) => prev.map((t) => (t.id === id ? { ...t, exiting: true } : t)));
        setTimeout(() => {
            setToasts((prev) => prev.filter((t) => t.id !== id));
        }, 300);
    }, []);

    const toast = {
        success: (msg, duration) => addToast(msg, "success", duration),
        error: (msg, duration) => addToast(msg, "error", duration),
        warning: (msg, duration) => addToast(msg, "warning", duration),
        info: (msg, duration) => addToast(msg, "info", duration),
    };

    return (
        <ToastContext.Provider value={toast}>
            {children}
            <ToastContainer toasts={toasts} onRemove={removeToast} />
        </ToastContext.Provider>
    );
}

// ===== Toast Container =====
function ToastContainer({ toasts, onRemove }) {
    if (toasts.length === 0) return null;

    return (
        <div className="toast-container">
            {toasts.map((t) => (
                <Toast key={t.id} toast={t} onRemove={onRemove} />
            ))}
        </div>
    );
}

// ===== Single Toast =====
function Toast({ toast, onRemove }) {
    useEffect(() => {
        const timer = setTimeout(() => onRemove(toast.id), toast.duration);
        return () => clearTimeout(timer);
    }, [toast.id, toast.duration, onRemove]);

    const icons = {
        success: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" />
            </svg>
        ),
        error: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" />
            </svg>
        ),
        warning: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" /><line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" />
            </svg>
        ),
        info: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" /><line x1="12" y1="16" x2="12" y2="12" /><line x1="12" y1="8" x2="12.01" y2="8" />
            </svg>
        ),
    };

    return (
        <div className={`toast toast-${toast.type} ${toast.exiting ? "toast-exit" : ""}`}>
            <div className="toast-icon">{icons[toast.type]}</div>
            <span className="toast-message">{toast.message}</span>
            <button className="toast-close" onClick={() => onRemove(toast.id)}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                </svg>
            </button>
            <div className="toast-progress" style={{ animationDuration: `${toast.duration}ms` }} />
        </div>
    );
}

export default ToastProvider;
