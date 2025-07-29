import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { getFavoritesApi } from './../../apis/Api';
import FavoritePage from './FavouritePage';
import '@testing-library/jest-dom';

jest.mock('./../../apis/Api');
jest.mock('../../components/ProductCard', () => (props) => (
    <div data-testid="product-card">
        <h3>{props.productInformation.productTitle}</h3>
    </div>
));

describe("FavoritePage Component", () => {
    beforeEach(() => {
        localStorage.setItem('user', JSON.stringify({ _id: "123", name: "User" }));
    });

    afterEach(() => {
        jest.clearAllMocks();
        localStorage.clear();
    });

    const mockFavoriteProducts = [
        { _id: "1", productTitle: "Favorite Product 1", productPrice: 100, productDescription: "Description 1", productImage: "image1.jpg" },
        { _id: "2", productTitle: "Favorite Product 2", productPrice: 200, productDescription: "Description 2", productImage: "image2.jpg" }
    ];

    const renderComponent = () => render(<FavoritePage />);

    it("should fetch and display favorite products on initial render", async () => {
        getFavoritesApi.mockResolvedValue({ status: 200, data: { favorites: mockFavoriteProducts } });

        renderComponent();

        // Debugging: Print the DOM to see what's being rendered
        screen.debug();

        await waitFor(() => {
            // Ensure the API call was made
            expect(getFavoritesApi).toHaveBeenCalled();

            // Check for product cards in the document
            const productCards = screen.getAllByTestId("product-card");
            expect(productCards).toHaveLength(mockFavoriteProducts.length);

            // Check for specific product titles
            expect(screen.getByText("Favorite Product 1")).toBeInTheDocument();
            expect(screen.getByText("Favorite Product 2")).toBeInTheDocument();
        });
    });
});
