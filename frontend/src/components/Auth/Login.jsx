import React, { useState } from 'react';
import { useFormik } from 'formik';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import * as Yup from 'yup';
import axios from 'axios';
import { useUser } from '../../context/UserContext';
import './Login.css';

const Login = () => {
  const { setUser } = useUser();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .email('Invalid email address')
        .required('Email is required'),
      password: Yup.string()
        .min(6, 'Password must be at least 6 characters')
        .required('Password is required'),
    }),
    onSubmit: async (values) => {
      try {
        setLoading(true);

        const { data } = await axios.post(
          'http://localhost:5000/api/auth/login',
          values,
          { withCredentials: true }
        );

        if (data.user) {
          setUser(data.user);
          toast.success('Login successful!');
          data.user.role === 'Admin'
            ? navigate('/dashboard')
            : navigate('/');
        }
      } catch (error) {
        toast.error(
          error.response?.data?.message || 'Login failed. Please try again.'
        );
      } finally {
        setLoading(false);
      }
    },
  });

  return (
    <div className="login-container">
      <h2>Login to Your Account</h2>
      <form onSubmit={formik.handleSubmit} className="login-form">
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            {...formik.getFieldProps('email')}
            className={formik.touched.email && formik.errors.email ? 'error' : ''}
          />
          {formik.touched.email && formik.errors.email && (
            <div className="error-message">{formik.errors.email}</div>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            {...formik.getFieldProps('password')}
            className={
              formik.touched.password && formik.errors.password ? 'error' : ''
            }
          />
          {formik.touched.password && formik.errors.password && (
            <div className="error-message">{formik.errors.password}</div>
          )}
        </div>

        <button
          type="submit"
          disabled={loading || !formik.isValid}
          className="submit-button"
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>

        <p className="register-link">
          Don't have an account? <Link to="/register">Create Account</Link>
        </p>
      </form>
    </div>
  );
};

export default Login;
