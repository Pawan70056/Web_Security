import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { useParams } from 'react-router-dom';
import { singleProductApi, getProductReviewsApi } from '../../apis/Api';
import ProductDetailPage from './ProductDetailPage';
import '@testing-library/jest-dom';

jest.mock('../../apis/Api');
jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useParams: jest.fn()
}));

describe('ProductDetailPage Component', () => {
    beforeEach(() => {
        useParams.mockReturnValue({ id: '1' });
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    const mockProduct = {
        _id: "1",
        productTitle: "Test Product",
        productPrice: 100,
        productDescription: "Test Description",
        productImage: "image.png",
        productCategory: "Test Category",
        productLocation: "Test Location"
    };

    const mockReviews = [
        {
            _id: "1",
            userId: { fullName: "Test User" },
            rating: 5,
            comment: "Great product!",
            createdAt: "2023-01-01T00:00:00Z"
        }
    ];

    const renderComponent = () => render(<ProductDetailPage />);

    it('should fetch and display product details and reviews on initial render', async () => {
        singleProductApi.mockResolvedValue({ status: 200, data: { product: mockProduct } });
        getProductReviewsApi.mockResolvedValue({ status: 200, data: { reviews: mockReviews } });

        renderComponent();

        await waitFor(() => {
            expect(singleProductApi).toHaveBeenCalledWith('1');
            expect(getProductReviewsApi).toHaveBeenCalledWith('1');
            expect(screen.getByText(/Name:\s*Test Product/)).toBeInTheDocument();
            expect(screen.getByText(/Price:\s*NPR\s*100/)).toBeInTheDocument();
            expect(screen.getByText(/Description:\s*Test Description/)).toBeInTheDocument();
            expect(screen.getByText(/Category:\s*Test Category/)).toBeInTheDocument();
            expect(screen.getByText(/Location:\s*Test Location/)).toBeInTheDocument();
            expect(screen.getByText("Great product!")).toBeInTheDocument();
            expect(screen.getByText("Test User")).toBeInTheDocument();
        });
    });
});
