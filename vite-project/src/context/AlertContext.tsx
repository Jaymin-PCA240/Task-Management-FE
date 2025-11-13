import React, { createContext, useContext, useState } from "react";
import { Alert, Snackbar } from "@mui/material";

interface AlertState {
  open: boolean;
  message: string;
  type: "success" | "error" | "info" | "warning";
}

interface AlertContextType {
  showAlert: (message: string, type?: AlertState["type"]) => void;
}

const AlertContext = createContext<AlertContextType | undefined>(undefined);

export const AlertProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [alert, setAlert] = useState<AlertState>({
    open: false,
    message: "",
    type: "info",
  });

  const showAlert = (message: string, type: AlertState["type"] = "info") => {
    setAlert({ open: true, message, type });
  };

  const handleClose = () => setAlert((prev) => ({ ...prev, open: false }));

  return (
    <AlertContext.Provider value={{ showAlert }}>
      {children}
      <Snackbar
        open={alert.open}
        autoHideDuration={3000}
        onClose={handleClose}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert onClose={handleClose} severity={alert.type} variant="filled" sx={{ width: "100%" }}>
          {alert.message}
        </Alert>
      </Snackbar>
    </AlertContext.Provider>
  );
};

export const useAlert = () => {
  const context = useContext(AlertContext);
  if (!context) throw new Error("useAlert must be used inside AlertProvider");
  return context;
};
