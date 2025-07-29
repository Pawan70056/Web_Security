import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { toast } from "react-toastify";
import { loginUserApi } from './../../apis/Api';
import Loginpage from './Loginpage'; // Import the Loginpage component
import { BrowserRouter as Router, useNavigate } from 'react-router-dom'; // Import Router
import '@testing-library/jest-dom'; 

jest.mock('./../../apis/Api');
jest.mock('react-toastify');
jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: jest.fn(),
}));

describe("Loginpage Component", () => {
    // Clear all mocks after each test
    afterEach(() => {
        jest.clearAllMocks();
    });

    const renderWithRouter = (ui) => {
        return render(<Router>{ui}</Router>);
    };

    it("should display success toast message and navigate to redirect page on successful login", async () => {
        const mockNavigate = jest.fn();
        useNavigate.mockImplementation(() => mockNavigate);

        // Mock successful response
        const mockResponse = {
            data: {
                success: true,
                token: "mockToken",
                userData: { name: "User" }
            }
        };
        loginUserApi.mockResolvedValue(mockResponse);
        toast.success = jest.fn();

        renderWithRouter(<Loginpage />);

        // Fill the form
        fireEvent.change(screen.getByPlaceholderText("Enter your Email"), {
            target: { value: "pawan@example.com" }
        });
        fireEvent.change(screen.getByPlaceholderText("Enter your Password"), {
            target: { value: "password123" }
        });
        fireEvent.click(screen.getByText("Login"));

        await waitFor(() => {
            // Expect API call with data entered
            expect(loginUserApi).toHaveBeenCalledWith({
                email: "pawan@example.com",
                password: "password123"
            });

            // Expect toast.success
            expect(toast.success).toHaveBeenCalledWith("Login Successfully");

            // Expect navigation
            expect(mockNavigate).toHaveBeenCalledWith('/redirect');
        });
    });
    
});