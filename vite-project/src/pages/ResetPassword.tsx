import { Formik, Form } from "formik";
import * as Yup from "yup";
import {
  TextField,
  Button,
  CircularProgress,
  InputAdornment,
  IconButton,
  Typography,
} from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import { AuthLayout } from "../components/AuthLayout";
import { useState } from "react";
import type { AppDispatch } from "../app/store";
import { resetPasswordThunk } from "../features/auth/authSlice";
// import { AlertMessage } from "../components/common/AlertMessage";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useDispatch } from "react-redux";
import { useAlert } from "../context/AlertContext";

const Schema = Yup.object({
  password: Yup.string()
    .min(6, "Minimum 6 characters")
    .required("Password required"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password")], "Passwords must match")
    .required("Confirm required"),
});

export default function ResetPassword() {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const location: any = useLocation();
  const resetToken = location.state?.resetToken || "";
  const [show, setShow] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const { showAlert } = useAlert();

  return (
    <div className="w-full max-w-[1600px] space-y-10 flex items-center justify-center align-center">
      <AuthLayout
        title="Reset Password"
        subtitle="Set a new password for your account"
      >
        <Formik
          initialValues={{ password: "", confirmPassword: "" }}
          validationSchema={Schema}
          onSubmit={async (values) => {
            if (!resetToken) {
              showAlert("Missing reset token", "error");
              return;
            }
            const res: any = await dispatch(
              resetPasswordThunk({ resetToken, password: values.password })
            );
            if (res.meta.requestStatus === "fulfilled") {
              showAlert("Password updated. Please log in.", "success");
              setTimeout(() => navigate("/login"), 1200);
            } else {
              showAlert(res.payload || "Failed to reset password", "error");
            }
          }}
        >
          {({ values, handleChange, errors, touched, isSubmitting }) => (
            <Form className="space-y-4">
              <TextField
                fullWidth
                label="New Password"
                name="password"
                type={show ? "text" : "password"}
                value={values.password}
                onChange={handleChange}
                error={touched.password && Boolean(errors.password)}
                helperText={touched.password && errors.password}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={() => setShow((s) => !s)} edge="end">
                        {show ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />

              <TextField
                fullWidth
                label="Confirm Password"
                name="confirmPassword"
                type={showConfirm ? "text" : "password"}
                value={values.confirmPassword}
                onChange={handleChange}
                error={
                  touched.confirmPassword && Boolean(errors.confirmPassword)
                }
                helperText={touched.confirmPassword && errors.confirmPassword}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={() => setShowConfirm((s) => !s)} edge="end">
                        {showConfirm ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />

              <Button
                type="submit"
                fullWidth
                variant="contained"
                disabled={isSubmitting}
                className="bg-gradient-to-r from-blue-700 to-blue-500 hover:to-blue-400"
              >
                {isSubmitting ? (
                  <CircularProgress size={20} />
                ) : (
                  "Reset Password"
                )}
              </Button>
            </Form>
          )}
        </Formik>
      </AuthLayout>
    </div>
  );
}
