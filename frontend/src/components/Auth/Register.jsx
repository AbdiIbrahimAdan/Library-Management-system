import React, { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import './Register.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
const Register = () => {
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const formik = useFormik({
    initialValues: {
      name: '',
      email: '',
      password: '',
      age: '',
      gender: '',
      country: '',
      location: '',
    },
    validationSchema: Yup.object({
      name: Yup.string()
        .min(2, 'Name must be at least 2 characters')
        .required('Name is required'),
      email: Yup.string()
        .email('Invalid email address')
        .required('Email is required'),
      password: Yup.string()
        .min(6, 'Password must be at least 6 characters')
        .matches(
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
          'Password must contain at least one uppercase letter, one lowercase letter, and one number'
        )
        .required('Password is required'),
      age: Yup.number()
        .min(1, 'Invalid age')
        .max(120, 'Invalid age')
        .required('Age is required'),
      gender: Yup.string()
        .oneOf(['Male', 'Female', 'Other'], 'Invalid gender')
        .required('Gender is required'),
      country: Yup.string()
        .min(2, 'Country must be at least 2 characters')
        .required('Country is required'),
      location: Yup.string()
        .min(2, 'Location must be at least 2 characters')
        .required('Location is required'),
    }),
    onSubmit: async (values) => {
      try {
        setLoading(true);
        setError('');
        
        const response = await axios.post(
          'http://localhost:5000/api/auth/register', 
          values,
          { withCredentials: true }
        );

        if (response.data) {
          toast.success('Registration successful! Redirecting to login...');
          setTimeout(() => navigate('/login'), 3000); // Delay navigation to show the toast
        }
      } catch (error) {
        toast.error(
          error.response?.data?.message || 'Registration failed. Please try again.'
        );
      } finally {
        setLoading(false);
      }
    },
  });

  return (
    <div className="register-container">
      <h2>Create Account</h2>
      
      {error && <div className="error-alert">{error}</div>}
      
      <form onSubmit={formik.handleSubmit} className="register-form">
        <div className="form-group">
          <label htmlFor="name">Name</label>
          <input
            id="name"
            type="text"
            {...formik.getFieldProps('name')}
            className={formik.touched.name && formik.errors.name ? 'error' : ''}
          />
          {formik.touched.name && formik.errors.name && (
            <div className="error-message">{formik.errors.name}</div>
          )}
        </div>

        {/* Similar pattern for other fields */}
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
            className={formik.touched.password && formik.errors.password ? 'error' : ''}
          />
          {formik.touched.password && formik.errors.password && (
            <div className="error-message">{formik.errors.password}</div>
          )}
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="age">Age</label>
            <input
              id="age"
              type="number"
              {...formik.getFieldProps('age')}
              className={formik.touched.age && formik.errors.age ? 'error' : ''}
            />
            {formik.touched.age && formik.errors.age && (
              <div className="error-message">{formik.errors.age}</div>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="gender">Gender</label>
            <select
              id="gender"
              {...formik.getFieldProps('gender')}
              className={formik.touched.gender && formik.errors.gender ? 'error' : ''}
            >
              <option value="">Select gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
            {formik.touched.gender && formik.errors.gender && (
              <div className="error-message">{formik.errors.gender}</div>
            )}
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="country">Country</label>
          <input
            id="country"
            type="text"
            {...formik.getFieldProps('country')}
            className={formik.touched.country && formik.errors.country ? 'error' : ''}
          />
          {formik.touched.country && formik.errors.country && (
            <div className="error-message">{formik.errors.country}</div>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="location">Location</label>
          <input
            id="location"
            type="text"
            {...formik.getFieldProps('location')}
            className={formik.touched.location && formik.errors.location ? 'error' : ''}
          />
          {formik.touched.location && formik.errors.location && (
            <div className="error-message">{formik.errors.location}</div>
          )}
        </div>

        <button 
          type="submit" 
          disabled={loading || !formik.isValid}
          className="submit-button"
        >
          {loading ? 'Registering...' : 'Register'}
        </button>

        <p className="login-link">
          Already have an account? <Link to="/login">Login here</Link>
        </p>
      </form>
      <ToastContainer position="top-center" autoClose={3000} />
    </div>
  );
};

export default Register;