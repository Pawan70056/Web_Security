import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { toast } from 'react-toastify';
import { productPagination } from './../../apis/Api';
import DashboardPage from './Dashboard';
import { BrowserRouter as Router } from 'react-router-dom';
import '@testing-library/jest-dom';

jest.mock('./../../apis/Api');
jest.mock('react-toastify');

const mockUser = {
    _id: "123",
    name: "Test User",
    email: "test@example.com"
};

beforeEach(() => {
    localStorage.setItem('user', JSON.stringify(mockUser));
});

afterEach(() => {
    localStorage.clear();
});

describe("DashboardPage Component", () => {
    // Clear all mocks after each test
    afterEach(() => {
        jest.clearAllMocks();
    });

    const renderWithRouter = (ui) => {
        return render(<Router>{ui}</Router>);
    };

    it("should display an info toast message when no products are found", async () => {
        toast.info = jest.fn();
        const mockResponse = {
            status: 200,
            data: {
                products: [],
                totalProducts: 0,
                resultPerPage: 2
            }
        };
        productPagination.mockResolvedValue(mockResponse);

        renderWithRouter(<DashboardPage />);

        await waitFor(() => {
            expect(productPagination).toHaveBeenCalledWith({ _page: 1, category: '' });
            expect(toast.info).toHaveBeenCalledWith('No Product Found!');
        });
    });

    it("should display an error toast message on API failure", async () => {
        toast.error = jest.fn();
        productPagination.mockRejectedValue(new Error('API error'));

        renderWithRouter(<DashboardPage />);

        await waitFor(() => {
            expect(productPagination).toHaveBeenCalledWith({ _page: 1, category: '' });
            expect(toast.error).toHaveBeenCalledWith('No Product Available:', expect.any(Error));
        });
    });
});
