import { Formik, Form } from "formik";
import * as Yup from "yup";
import { TextField, Button, CircularProgress, Typography } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { AuthLayout } from "../components/AuthLayout";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { forgotPasswordThunk } from "../features/auth/authSlice";
import type { AppDispatch } from "../app/store";
import { useAlert } from "../context/AlertContext";
// import { AlertMessage } from "../components/AlertMessage";

const Schema = Yup.object({
  email: Yup.string().email("Invalid email").required("Email required"),
});

export default function ForgotPassword() {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { showAlert } = useAlert();
  return (
    <AuthLayout title="Forgot Password" subtitle="We will send a verification code to your email">
      <Formik
        initialValues={{ email: "" }}
        validationSchema={Schema}
        onSubmit={async (values) => {
          const res: any = await dispatch(forgotPasswordThunk({ email: values.email }));
          if (res.meta.requestStatus === "fulfilled") {
            showAlert("OTP sent to email." , "success");
            navigate("/verify-otp", { state: { email: values.email } });
          } else {
            showAlert(res.payload, "error");
          }
        }}
      >
        {({ values, handleChange, errors, touched, isSubmitting }) => (
          <Form className="space-y-4">
            <TextField fullWidth label="Email" name="email" value={values.email} onChange={handleChange}
              error={touched.email && Boolean(errors.email)} helperText={touched.email && errors.email} />

            <Button type="submit" fullWidth variant="contained" disabled={isSubmitting}>
              {isSubmitting ? <CircularProgress size={20} /> : "Send OTP"}
            </Button>

            <Typography variant="body2" className="text-center">
              <Link to="/login" className="text-blue-600 hover:underline">Back to Login</Link>
            </Typography>
          </Form>
        )}
      </Formik>

    </AuthLayout>
  );
}
