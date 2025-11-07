import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { TextField, Button } from '@mui/material';
import { Link } from 'react-router-dom';
import { AuthLayout } from '../components/AuthLayout';

const ForgotSchema = Yup.object({
  email: Yup.string().email('Invalid email').required('Email required'),
});

export default function ForgotPassword() {
  return (
    <AuthLayout title="Forgot Password 🔑" subtitle="Enter your email to reset your password">
      <Formik
        initialValues={{ email: '' }}
        validationSchema={ForgotSchema}
        onSubmit={(values) => {
          console.log(values);
          alert('Password reset link sent!');
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

            <Button type="submit" fullWidth variant="contained">
              Send Reset Link
            </Button>

            <div className="text-center text-sm mt-2">
              <Link to="/login" className="text-blue-600 hover:underline">
                Back to login
              </Link>
            </div>
          </Form>
        )}
      </Formik>
    </AuthLayout>
  );
}
