import React, { useContext, useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import '../css/Login.css';
import { SignInApi } from '../services/api';
import { UserContext } from '../store/context';

const Login = () => {
  const navigate = useNavigate();
  const { setUser } = useContext(UserContext);
  const [isSubmitting, setIsSubmitting] = useState(false);

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
      setIsSubmitting(true);
      try {
        const { data } = await SignInApi(values);
        if (data?.role === 2) {
          Swal.fire({
            icon: 'success',
            title: 'Login Successful',
            text: 'You have successfully logged in!',
            timer: 2000,
            showConfirmButton: false,
          }).then(() => {
            setUser(data);
            navigate('/');
          });
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Invalid Credentials',
            text: 'Please check your email and password and try again.',
            timer: 3000,
            showConfirmButton: false,
          });
        }
      } catch (error) {
        Swal.fire({
          icon: 'error',
          title: 'Login Failed',
          text: error?.response?.data?.message || 'Error logging in, please try again later.',
          timer: 2000,
          showConfirmButton: false,
        });
      } finally {
        setIsSubmitting(false);
      }
    },
  });

  return (
    <div className="login-container">
      <div className="login-card shadow-lg p-4 rounded">
        <h2 className="text-center mb-4">Login</h2>
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
          <button
            type="submit"
            className="btn btn-primary w-100"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Logging in...' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;