import { render, fireEvent, waitFor, screen } from "@testing-library/react";
import RegisterPage from "./RegisterPage";
import { toast } from "react-toastify";
import { registerUserApi } from "../../apis/Api";
import { BrowserRouter as Router, useNavigate } from 'react-router-dom'; // Import Router

// Mock the API.JS file
jest.mock("../../apis/Api");

// Mock the useNavigate hook
jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: jest.fn(),
}));

describe("RegisterPage Component", () => {
    // Clearing all mocks
    afterEach(() => {
        jest.clearAllMocks();
    });

    // Helper function to render with Router
    const renderWithRouter = (ui) => {
        return render(<Router>{ui}</Router>);
    };

    // Test 1
    it("Should display error toast message when passwords do not match", async () => {
        // Rendering the RegisterPage component with Router
        renderWithRouter(<RegisterPage />);

        // Configuring toast.error
        toast.error = jest.fn();

        // Finding elements on the rendered RegisterPage component
        const fullName = await screen.findByPlaceholderText("Full Name");
        const email = await screen.findByPlaceholderText("Email");
        const password = await screen.findByPlaceholderText("Password");
        const confirmPassword = await screen.findByPlaceholderText("Confirm Password");
        const registerBtn = screen.getByText("Register");

        // Simulating filling input locally
        fireEvent.change(fullName, {
            target: {
                value: "Pawan Chaudhary",
            },
        });
        fireEvent.change(email, {
            target: {
                value: "pawan@example.com",
            },
        });
        fireEvent.change(password, {
            target: {
                value: "password123",
            },
        });
        fireEvent.change(confirmPassword, {
            target: {
                value: "password321",
            },
        });

        fireEvent.click(registerBtn);

        // Ensuring all tests are working fine
        await waitFor(() => {
            // Expect toast.error
            expect(toast.error).toHaveBeenCalledWith("Passwords do not match");
        });
    });

    it("Should display success toast message and navigate to login page on successful registration", async () => {
        const mockNavigate = jest.fn();
        useNavigate.mockImplementation(() => mockNavigate);

        // Rendering the RegisterPage component with Router
        renderWithRouter(<RegisterPage />);
        // Mock response for successful registration
        const mockResponse = {
            data: {
                success: true,
            },
        };

        // Configuring mock response
        registerUserApi.mockResolvedValue(mockResponse);

        // Configuring toast.success
        toast.success = jest.fn();

        // Finding elements on the rendered RegisterPage component
        const fullName = await screen.findByPlaceholderText("Full Name");
        const email = await screen.findByPlaceholderText("Email");
        const password = await screen.findByPlaceholderText("Password");
        const confirmPassword = await screen.findByPlaceholderText("Confirm Password");
        const registerBtn = screen.getByText("Register");

        // Simulating filling input locally
        fireEvent.change(fullName, {
            target: {
                value: "Pawan Chaudhary",
            },
        });
        fireEvent.change(email, {
            target: {
                value: "pawan@example.com",
            },
        });
        fireEvent.change(password, {
            target: {
                value: "password123",
            },
        });
        fireEvent.change(confirmPassword, {
            target: {
                value: "password123",
            },
        });

        fireEvent.click(registerBtn);

        // Ensuring all tests are working fine
        await waitFor(() => {
            // Expect API call with data entered
            expect(registerUserApi).toHaveBeenCalledWith({
                fullName: "Pawan Chaudhary",
                email: "pawan@example.com",
                password: "password123",
                confirmPassword: "password123",
            });

            // Expect toast.success
            expect(toast.success).toHaveBeenCalledWith("Registered successfully!");
        });

        await waitFor(() => {
            expect(mockNavigate).toHaveBeenCalledWith('/login');
        });
    });
});
