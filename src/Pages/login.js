import React, { useContext } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../css/Login.css'; // Optional: Custom styles for the login page
import { SignInApi } from '../services/api';
import { UserContext } from '../store/context';

const Login = () => {
  const navigate = useNavigate();
  const {user,setUser} = useContext(UserContext)

  // Formik form setup and validation
  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .email('Please enter a valid email address')
        .required('Email is required'),
      password: Yup.string()
        .min(6, 'Password must be at least 6 characters long')
        .required('Password is required'),
    }),
    onSubmit: async (values) => {
      try {
        // Replace this with actual login API logic
        console.log("Login values:", values);
        const {data} = await SignInApi(values)
        console.log("🚀 ~ onSubmit: ~ res:", data)
        // Mock login response
        
        if (data?.role == 2) {
          toast.success('Login successful', {
            position: 'top-right',
            autoClose: 3000,
          });
          setUser(data)
          navigate('/'); // Navigate to dashboard or any other route
        } else {
          toast.error('Invalid credentials, please try again', {
            position: 'top-right',
            autoClose: 3000,
          });
        }
      } catch (error) {
        console.error('Error logging in:', error);
        toast.error(error?.response?.data?.message || 'Error logging in, please try again later', {
          position: 'top-right',
          autoClose: 3000,
        });
      }
    },
  });

  return (
    <div className="login-container">
      <div className="login-card">
        <h2>Login</h2>
        <form onSubmit={formik.handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Email</label>
            <input
              type="email"
              className="form-control"
              name="email"
              value={formik.values.email}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              required
            />
            {formik.touched.email && formik.errors.email && (
              <div className="text-danger">{formik.errors.email}</div>
            )}
          </div>
          <div className="mb-3">
            <label className="form-label">Password</label>
            <input
              type="password"
              className="form-control"
              name="password"
              value={formik.values.password}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              required
            />
            {formik.touched.password && formik.errors.password && (
              <div className="text-danger">{formik.errors.password}</div>
            )}
          </div>
          <button type="submit" className="btn btn-primary w-100">Login</button>
        </form>
      </div>
      <ToastContainer />
    </div>
  );
};

export default Login;
