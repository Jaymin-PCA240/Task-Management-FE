import { Formik, Form } from "formik";
import * as Yup from "yup";
import { TextField, Button, CircularProgress, Typography } from "@mui/material";
import { useLocation, Link, useNavigate } from "react-router-dom";
import { AuthLayout } from "../components/AuthLayout";
import { useDispatch } from "react-redux";
import { verifyOtpThunk } from "../features/auth/authSlice";
import type { AppDispatch } from "../app/store";
import { useAlert } from "../context/AlertContext";

const Schema = Yup.object({
  email: Yup.string().email("Invalid email").required("Email required"),
  otp: Yup.string().length(6, "6 digit OTP").required("OTP required"),
});

export default function VerifyOTP() {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const location: any = useLocation();
  const initialEmail = location.state?.email || "";
  const { showAlert } = useAlert();

  return (
    <AuthLayout title="Verify Code" subtitle="Enter the 6-digit code sent to your email">
      <Formik
        initialValues={{ email: initialEmail, otp: "" }}
        validationSchema={Schema}
        onSubmit={async (values) => {
          const res: any = await dispatch(verifyOtpThunk({ email: values.email, otp: values.otp }));
          if (res.meta.requestStatus === "fulfilled") {
            const resetToken = res.payload?.data?.resetToken || res.payload?.resetToken || res.payload?.data?.token;
            showAlert(res.payload.message || "OTP Verified.", "success")
            navigate("/reset-password", { state: { resetToken } });
          } else {
            showAlert(res.payload || "OTP invalid", "error")
          }
        }}
      >
        {({ values, handleChange, errors, touched, isSubmitting }) => (
          <Form className="space-y-4">
            <TextField fullWidth label="Email" name="email" disabled={true} value={values.email} onChange={handleChange}
              error={touched.email && Boolean(errors.email)} />

            <TextField fullWidth label="OTP" name="otp" value={values.otp} onChange={handleChange}
              error={touched.otp && Boolean(errors.otp)} helperText={touched.otp && errors.otp} />

            <Button type="submit" fullWidth variant="contained" disabled={isSubmitting}>
              {isSubmitting ? <CircularProgress size={20} /> : "Verify OTP"}
            </Button>

            <Typography variant="body2" className="text-center">
              <Link to="/forgot-password" className="text-blue-600 hover:underline">Resend OTP</Link>
            </Typography>
          </Form>
        )}
      </Formik>

    </AuthLayout>
  );
}
