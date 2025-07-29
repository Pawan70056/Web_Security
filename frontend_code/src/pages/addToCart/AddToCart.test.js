import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { toast } from 'react-toastify';
import { getCartItemsApi, removeCartItemApi } from './../../apis/Api';
import CartPage from './AddToCart';
import '@testing-library/jest-dom';

jest.mock('./../../apis/Api');
jest.mock('react-toastify');

describe("CartPage Component - Remove Cart Item", () => {
    beforeEach(() => {
        localStorage.setItem('user', JSON.stringify({ _id: "123", name: "User" }));
    });

    afterEach(() => {
        jest.clearAllMocks();
        localStorage.clear();
    });

    const mockCartItems = [
        { _id: "1", productTitle: "Product 1", productPrice: 100, productDescription: "Description 1", productImage: "image1.jpg", quantity: 1 },
        { _id: "2", productTitle: "Product 2", productPrice: 200, productDescription: "Description 2", productImage: "image2.jpg", quantity: 1 }
    ];

    const renderComponent = () => render(<CartPage />);

    it("should handle removing an item from the cart", async () => {
        getCartItemsApi.mockResolvedValue({ status: 200, data: { cartItem: mockCartItems } });
        removeCartItemApi.mockResolvedValue({ status: 200 });
        toast.success = jest.fn();

        renderComponent();

        await waitFor(() => {
            expect(getCartItemsApi).toHaveBeenCalled();
            expect(screen.getByText("Product 1")).toBeInTheDocument();
            expect(screen.getByText("Product 2")).toBeInTheDocument();
        });

        fireEvent.click(screen.getAllByText("Remove")[0]);

        await waitFor(() => {
            expect(removeCartItemApi).toHaveBeenCalledWith("1");
            expect(toast.success).toHaveBeenCalledWith('Product removed from cart!');
            expect(screen.queryByText("Product 1")).not.toBeInTheDocument();
        });
    });
});
