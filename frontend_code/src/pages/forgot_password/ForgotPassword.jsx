import './../forgot_password/forgotpassword.css';  // Import the CSS file
import React, { useState } from 'react';
import { forgotPasswordApi, verifyOtpApi } from '../../apis/Api';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [isSent, setIsSent] = useState(false);
    const [otp, setOtp] = useState('');
    const [password, setPassword] = useState('');

    const handleForgotPassword = async (e) => {
        e.preventDefault();
        try {
            const res = await forgotPasswordApi({ email });
            if (res.status === 200) {
                toast.success(res.data.message);
                setIsSent(true);
            } else {
                toast.error('Failed to send OTP. Please try again.');
            }
        } catch (error) {
            if (error.response && error.response.status === 400) {
                toast.error(error.response.data.message);
            } else {
                console.error(error);
                toast.error('An unexpected error occurred. Please try again.');
            }
        }
    };

    const handleVerify = async (e) => {
        e.preventDefault();
        const data = { email, otp, password };
        try {
            const res = await verifyOtpApi(data);
            if (res.status === 200) {
                toast.success(res.data.message);
            }
        } catch (error) {
            if (error.response && error.response.status === 400) {
                toast.error(error.response.data.message);
            } else {
                toast.error('An unexpected error occurred. Please try again.');
            }
        }
    };

    return (
        <div className='forgot-password-container11'>
            <div className='card11'>
                <div className='image-container11'>
                    <img src='assets/images/forgot_password.png' alt='Forgot Password Illustration' />
                </div>
                <div className='form-container11'>
                    <h3>Forgot Your Password?</h3>
                    <form>
                        <div className='form-group11'>
                            <label htmlFor='email'>
                                Enter your email address and we'll send you a verification link to reset your password
                            </label>
                            <input
                                type='text'
                                className='form-control11'
                                id='email'
                                placeholder='Enter your email'
                                disabled={isSent}
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                        {isSent && (
                            <>
                                <span className='text-success11'>OTP has been sent to {email}✅</span>
                                <div className='form-group11 mt-2'>
                                    <input
                                        onChange={(e) => setOtp(e.target.value)}
                                        type='number'
                                        className='form-control11'
                                        placeholder='Enter OTP'
                                    />
                                </div>
                                <p>Enter New Password</p>
                                <div className='form-group11 mt-2'>
                                    <input
                                        onChange={(e) => setPassword(e.target.value)}
                                        type='password'
                                        className='form-control11'
                                        placeholder='Set New Password'
                                    />
                                </div>

                                <button onClick={handleVerify} className='btn btn-primary11 mt-2'>
                                    Verify OTP & Set Password
                                </button>
                            </>
                        )}
                        {!isSent && (
                            <button onClick={handleForgotPassword} className='btn btn-dark11 mt-2'>
                                Submit
                            </button>
                        )}
                    </form>
                    <a href='/login' className='back-to-login11'>Back to Login</a>
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;
