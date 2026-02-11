import { useState, useCallback, createContext, useContext } from "react";

const ConfirmContext = createContext(null);

export function useConfirm() {
    const ctx = useContext(ConfirmContext);
    if (!ctx) throw new Error("useConfirm must be used within ConfirmProvider");
    return ctx;
}

export function ConfirmProvider({ children }) {
    const [state, setState] = useState(null);

    const confirm = useCallback(({ title = "Confirm", message, confirmText = "Confirm", cancelText = "Cancel", type = "danger" }) => {
        return new Promise((resolve) => {
            setState({ title, message, confirmText, cancelText, type, resolve });
        });
    }, []);

    const handleConfirm = () => {
        state?.resolve(true);
        setState(null);
    };

    const handleCancel = () => {
        state?.resolve(false);
        setState(null);
    };

    return (
        <ConfirmContext.Provider value={confirm}>
            {children}
            {state && (
                <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && handleCancel()}>
                    <div className="confirm-dialog">
                        <div className="confirm-icon-wrap">
                            {state.type === "danger" ? (
                                <div className="confirm-icon confirm-icon-danger">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                                        <line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" />
                                    </svg>
                                </div>
                            ) : (
                                <div className="confirm-icon confirm-icon-info">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                                        <circle cx="12" cy="12" r="10" />
                                        <line x1="12" y1="16" x2="12" y2="12" /><line x1="12" y1="8" x2="12.01" y2="8" />
                                    </svg>
                                </div>
                            )}
                        </div>
                        <h3 className="confirm-title">{state.title}</h3>
                        <p className="confirm-message">{state.message}</p>
                        <div className="confirm-actions">
                            <button onClick={handleCancel} className="btn btn-outline">{state.cancelText}</button>
                            <button onClick={handleConfirm} className={`btn ${state.type === "danger" ? "btn-danger-solid" : "btn-primary"}`}>
                                {state.confirmText}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </ConfirmContext.Provider>
    );
}

export default ConfirmProvider;
