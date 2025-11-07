import { useState } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import {
  TextField,
  Button,
  IconButton,
  InputAdornment,
  Typography,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { Link, useNavigate } from "react-router-dom";
import { AuthLayout } from "../components/AuthLayout";
import { useDispatch, useSelector } from "react-redux";
import { type AppDispatch, type RootState } from "../app/store";
import { registerThunk } from "../features/auth/authSlice";

const SignupSchema = Yup.object({
  name: Yup.string().required("Full name is required"),
  email: Yup.string().email("Invalid email").required("Email is required"),
  password: Yup.string()
    .min(6, "Minimum 6 characters")
    .required("Password is required"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password")], "Passwords must match")
    .required("Confirm password is required"),
});

export default function Signup() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
  // const { loading, error } = useSelector((s: RootState) => s.auth);
  const navigate = useNavigate();

  return (
    <AuthLayout
      title="Create Your Account ✨"
      subtitle="Join TaskFlow to simplify your workflow"
    >
      <Formik
        initialValues={{
          name: "",
          email: "",
          password: "",
          confirmPassword: "",
        }}
        validationSchema={SignupSchema}
        onSubmit={async (values, { setSubmitting }) => {
          setSubmitting(true);
          const res = await dispatch(
            registerThunk({
              name: values.name,
              email: values.email,
              password: values.password,
            })
          );

          setSubmitting(false);
          if (res.meta.requestStatus === "fulfilled") {
            navigate("/login");
          }
        }}
      >
        {({ values, handleChange, errors, touched }) => (
          <Form className="space-y-4">
            <TextField
              fullWidth
              label="Full Name"
              name="name"
              value={values.name}
              onChange={handleChange}
              error={touched.name && Boolean(errors.name)}
              helperText={touched.name && errors.name}
            />

            <TextField
              fullWidth
              label="Email"
              name="email"
              value={values.email}
              onChange={handleChange}
              error={touched.email && Boolean(errors.email)}
              helperText={touched.email && errors.email}
            />

            <TextField
              fullWidth
              label="Password"
              name="password"
              type={showPassword ? "text" : "password"}
              value={values.password}
              onChange={handleChange}
              error={touched.password && Boolean(errors.password)}
              helperText={touched.password && errors.password}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
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
              error={touched.confirmPassword && Boolean(errors.confirmPassword)}
              helperText={touched.confirmPassword && errors.confirmPassword}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowConfirm(!showConfirm)}
                      edge="end"
                    >
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
              sx={{
                mt: 1,
                py: 1.2,
                textTransform: "none",
                fontWeight: 600,
                backgroundColor: "#6366F1",
                "&:hover": { backgroundColor: "#4F46E5" },
              }}
            >
              Sign Up
            </Button>

            <Typography
              variant="body2"
              align="center"
              className="mt-2 text-gray-600"
            >
              Already have an account?{" "}
              <Link to="/login" className="text-blue-600 hover:underline">
                Log in
              </Link>
            </Typography>
          </Form>
        )}
      </Formik>
    </AuthLayout>
  );
}
