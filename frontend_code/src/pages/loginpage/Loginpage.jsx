import React, { useState } from 'react';
import { FaUser, FaLock, FaEye, FaEyeSlash } from 'react-icons/fa';
import './../loginpage/login.css';
import { toast } from "react-toastify";
import { useNavigate } from 'react-router-dom';
import { loginUserApi } from './../../apis/Api';
import ReCAPTCHA from 'react-google-recaptcha';
import logger from '../../utils/logger';

const Loginpage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [captchaToken, setCaptchaToken] = useState(null);
  const navigate = useNavigate();

  const onCaptchaChange = (token) => {
    setCaptchaToken(token);
    logger.info('CAPTCHA verified.');
  };

  const validate = () => {
    let isValid = true;
    setEmailError('');
    setPasswordError('');

    if (email.trim() === '' || !email.includes('@')) {
      setEmailError('Please enter a valid email');
      isValid = false;
    }
    if (password.trim() === '') {
      setPasswordError('Please enter the password');
      isValid = false;
    }
    if (!captchaToken) {
      toast.error('Please verify the CAPTCHA');
      return false;
    }
    return isValid;
  };

  const handlePasswordInput = (password) => {
    setPassword(password);
  };

  const handleLogin = async (event) => {
    event.preventDefault();

    if (!validate()) {
      logger.warn('Login attempt with missing fields.');
      return;
    }

    const data = {
      email,
      password,
      captchaToken,
    };

    try {
      logger.info(`Attempting login for email: ${email}`);
      const res = await loginUserApi(data);

      if (res.data.success) {
        toast.success('Login Successfully');

        if (res.data.passwordExpiryMessage) {
          toast.warn(res.data.passwordExpiryMessage, {
            position: "top-right",
            autoClose: 5000,
          });
        }

        localStorage.setItem('token', res.data.token || '');
        localStorage.setItem('user', JSON.stringify(res.data.userData || {}));
        navigate('/redirect');
      } else {
        toast.error(res.data.message);
        logger.warn(`Login failed for user: ${email}`);
      }
    } catch (error) {
      logger.error(`Login error: ${error.message}`);
      console.error('Login Error:', error.response?.data || error.message);
      toast.error(error.response?.data?.message || 'An error occurred. Please try again.');
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div
      className="d-flex justify-content-center align-items-center vh-100"
      style={{
        backgroundImage: 'url("/assets/images/bg1.png")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div className="card p-5 shadow-lg login-card glass-effect" style={{ borderRadius: '20px', maxWidth: '400px', width: '100%' }}>
        <div className="text-center mb-4">
          <img src="/assets/images/website_logo.png" alt="Logo" className="mb-3" style={{ width: '60px' }} />
          <h2 className="fw-bold">Welcome Back</h2>
          <p className="text-muted">Please login to your account</p>
        </div>
        <form>
          <div className="mb-3">
            <label className="form-label fw-semibold">Email Address</label>
            <div className="input-group">
              <span className="input-group-text bg-white border-end-0"><FaUser /></span>
              <input
                onChange={(e) => setEmail(e.target.value)}
                type="text"
                className='form-control border-start-0'
                placeholder='example@email.com'
              />
            </div>
            {emailError && <div className="text-danger small mt-1">{emailError}</div>}
          </div>
          <div className="mb-3">
            <label className="form-label fw-semibold">Password</label>
            <div className="input-group">
              <span className="input-group-text bg-white border-end-0"><FaLock /></span>
              <input
                onChange={(e) => handlePasswordInput(e.target.value)}
                type={showPassword ? 'text' : 'password'}
                className='form-control border-start-0'
                placeholder='••••••••'
              />
              <span className="input-group-text bg-white" style={{ cursor: 'pointer' }} onClick={togglePasswordVisibility}>
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>
            {passwordError && <div className="text-danger small mt-1">{passwordError}</div>}
          </div>
          <div className="mb-3 d-flex justify-content-between align-items-center">
            <ReCAPTCHA
              sitekey="6LdvAbgqAAAAAJzHc6E2UGeUL9Ms90btkyaGlL4J"
              onChange={onCaptchaChange}
            />
          </div>
          <div className="mb-3 text-end">
            <a href="/forgot_password" className="text-decoration-none text-primary small">Forgot password?</a>
          </div>
          <button onClick={handleLogin} type="submit" className="btn btn-primary w-100 fw-semibold">Login</button>
        </form>
        <div className="text-center mt-4">
          <span className="text-muted">Don't have an account? </span>
          <a href="/register" className="text-decoration-none text-primary fw-semibold">Sign up</a>
        </div>
      </div>
    </div>
  );
};

export default Loginpage;
