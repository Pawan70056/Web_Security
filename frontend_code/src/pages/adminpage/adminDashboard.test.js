import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { toast } from 'react-toastify';
import { getAllProducts, deleteSingleProductApi } from './../../apis/Api';
import AdminDashboard from './  ';
import '@testing-library/jest-dom';

jest.mock('./../../apis/Api');
jest.mock('react-toastify');

describe("AdminDashboard Component - Product Deletion", () => {
    beforeEach(() => {
        localStorage.setItem('user', JSON.stringify({ _id: "123", name: "Admin" }));
    });

    afterEach(() => {
        jest.clearAllMocks();
        localStorage.clear();
    });

    const mockProducts = [
        { _id: "1", isApproved: true, productTitle: "Product 1", productPrice: 100, productCategory: "Category 1", productLocation: "Location 1", productDescription: "Description 1", postedBy: "User 1" },
        { _id: "2", isApproved: false, productTitle: "Product 2", productPrice: 200, productCategory: "Category 2", productLocation: "Location 2", productDescription: "Description 2", postedBy: "User 2" }
    ];

    const renderComponent = () => render(<AdminDashboard />);

    it("should handle product deletion", async () => {
        deleteSingleProductApi.mockResolvedValue({ status: 200 });
        window.confirm = jest.fn().mockImplementation(() => true);
        toast.success = jest.fn();

        getAllProducts.mockResolvedValue({ status: 200, data: { products: mockProducts } });

        renderComponent();

        await waitFor(() => {
            expect(screen.getByText("Product 1")).toBeInTheDocument();
        });

        fireEvent.click(screen.getAllByText("Delete")[0]);

        await waitFor(() => {
            expect(deleteSingleProductApi).toHaveBeenCalledWith("1");
            expect(toast.success).toHaveBeenCalledWith('Product deleted successfully');
            expect(screen.queryByText("Product 1")).not.toBeInTheDocument();
        });
    });
});
