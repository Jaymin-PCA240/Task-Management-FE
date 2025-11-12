import { Formik, Form } from "formik";
import * as Yup from "yup";
import {
  TextField,
  Button,
  CircularProgress,
  InputAdornment,
  IconButton,
} from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { type AppDispatch, type RootState } from "../app/store";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { loginThunk } from "../features/auth/authSlice";
import { AuthLayout } from "../components/AuthLayout";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useAlert } from "../context/AlertContext";

const LoginSchema = Yup.object({
  email: Yup.string().email("Invalid email").required("Email is required"),
  password: Yup.string().required("Password is required"),
});

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const { showAlert } = useAlert();

  const accessToken = useSelector((state: RootState) => state.auth.accessToken);
  useEffect(() => {
    if (accessToken) {
      navigate("/dashboard", { replace: true });
    }
  }, [accessToken, navigate]);

  return (
    <div className="w-full max-w-[1600px] space-y-10 flex items-center justify-center align-center">
      <AuthLayout
        title="Welcome Back 👋"
        subtitle="Log in to continue managing your tasks"
      >
        <Formik
          initialValues={{ email: "", password: "" }}
          validationSchema={LoginSchema}
          onSubmit={async (values) => {
            setLoading(true);
            const res = await dispatch(loginThunk(values));
            setLoading(false);
            if (res.meta.requestStatus === "fulfilled") {
              showAlert("Login successful!", "success");
              navigate("/dashboard");
            } else {
              showAlert("Invalid email or password", "error");
            }
          }}
        >
          {({ values, handleChange, errors, touched }) => (
            <Form className="space-y-4">
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

              <Button
                fullWidth
                variant="contained"
                type="submit"
                disabled={loading}
                className="bg-gradient-to-r from-blue-700 to-blue-500 hover:to-blue-400"
                sx={{
                  mt: 1,
                  py: 1.2,
                  textTransform: "none",
                  fontWeight: 600,
                }}
              >
                {loading ? (
                  <CircularProgress size={22} color="inherit" />
                ) : (
                  "Login"
                )}
              </Button>

              <div className="flex justify-between text-sm mt-2">
                <Link
                  to="/forgot-password"
                  className="text-blue-600 hover:underline"
                >
                  Forgot password?
                </Link>
                <Link to="/register" className="text-blue-600 hover:underline">
                  Create an account
                </Link>
              </div>
            </Form>
          )}
        </Formik>
      </AuthLayout>
    </div>
  );
}
