import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { toast } from 'react-toastify';
import { forgotPasswordApi } from '../../apis/Api';
import ForgotPassword from './ForgotPassword';
import '@testing-library/jest-dom';

jest.mock('../../apis/Api');
jest.mock('react-toastify');

describe('ForgotPassword Component', () => {
    const renderComponent = () => render(<ForgotPassword />);

    it('should send OTP on submitting email and show OTP fields', async () => {
        const mockResponse = { status: 200, data: { message: 'OTP sent successfully' } };
        forgotPasswordApi.mockResolvedValue(mockResponse);
        toast.success = jest.fn();

        renderComponent();

        const emailInput = screen.getByPlaceholderText('Enter your email');
        fireEvent.change(emailInput, { target: { value: 'test@example.com' } });

        const submitButton = screen.getByText('Submit');
        fireEvent.click(submitButton);

        await waitFor(() => {
            expect(forgotPasswordApi).toHaveBeenCalledWith({ email: 'test@example.com' });
            expect(toast.success).toHaveBeenCalledWith('OTP sent successfully');
            expect(screen.getByText(/OTP has been sent to test@example.com/)).toBeInTheDocument();
            expect(screen.getByPlaceholderText('Enter OTP')).toBeInTheDocument();
            expect(screen.getByPlaceholderText('Set New Password')).toBeInTheDocument();
        });
    });
});
