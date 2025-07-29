import axios from "axios";
import logger from "../utils/logger";

const Api = axios.create({
  // baseURL: "https://localhost:8848",
  baseURL: "http://localhost:8848",
  withCredentials: true,
  headers: {
    "Content-Type": "multipart/form-data",
  }
});

// Add a request interceptor to include the token
Api.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      logger.info(`Token attached to request: ${config.url}`);
    }
    logger.info(`API Request: ${config.method.toUpperCase()} ${config.url}`);
    return config;
  },
  error => {
    logger.error(`API Request Error: ${error.message}`);
    return Promise.reject(error);
  }
);

// Add a response interceptor to log responses
Api.interceptors.response.use(
  response => {
    logger.info(`API Response: ${response.status} - ${response.config.url}`);
    return response;
  },
  error => {
    logger.error(`API Response Error: ${error.response?.status} - ${error.message}`);
    return Promise.reject(error);
  }
);


export const loginUserApi = (data) => Api.post('/api/user/login', data)

//creating register api
export const registerUserApi = (data) => Api.post('/api/user/register', data)

// Test API (example usage)
export const testApi = () => Api.get('/test');

// Create product API (example usage)
export const createProductApi = (data) => Api.post('/api/products/create', data);

// Fetch all products (example usage)
export const getAllProducts = () => Api.get('/api/products/get_all_products');

// Fetch single product (example usage)
export const singleProductApi = (id) => Api.get(`/api/products/get_single_product/${id}`);

// Delete single product (example usage)
export const deleteSingleProductApi = (id) => Api.delete(`/api/products/delete_product/${id}`);

// approve the product
export const approveProductApi = (id) => Api.put(`/api/products/approve_product/${id}`);

// Forgot password
export const forgotPasswordApi = (data) => Api.post('api/user/forgot_password', data)

// verify 
export const verifyOtpApi = (data) => Api.post('api/user/verify_otp', data)

//getUserDeatails
export const getUserDetails = (id) => Api.get(`/api/user/get_user/${id}`)

// pagination
export const productPagination = (params) => Api.get('/api/products/pagination', { params });

// update_user
export const updateUserDetails = (userId, userDataToUpdate) =>
  Api.post(`/api/user/update_user/${userId}`, userDataToUpdate);

// Update profile image API call
export const updateProfileImage = (id, formData) => Api.post(`/api/user/update_profile_image/${id}`, formData);

//delete single product
export const deletePost = (productId) => Api.delete(`/api/products/delete_product/${productId}`)

export const getAllProductsByUserId = (id) => Api.get(`/api/products/get_all_product_by_userid/${id}`)

// Add these API calls
export const addToCartApi = (productId) => Api.post('/api/products/add_cart', { productId });
export const removeCartItemApi = (productId) => Api.delete(`/api/products/remove_cart/${productId}`);
export const getCartItemsApi = () => Api.get('/api/products/get_cart');

// add to favourite APIS
// Add to favorites API call
export const addToFavoritesApi = (productId) => Api.post('/api/products/add_favorite', { productId });

// Remove from favorites API call
export const removeFavoriteApi = (productId) => Api.delete(`/api/products/remove_favorite/${productId}`);

// Get favorites API call
export const getFavoritesApi = (id) => Api.get(`/api/products/favorites/${id}`);

//search api
export const searchApi = (params) => Api.get(`/api/products/search`, params)

// Fetch product reviews
export const getProductReviewsApi = (productId) => Api.get(`/api/products/reviews/${productId}`);

// Create a review
export const createReviewApi = (data) => Api.post('/api/products/create_review', data);

//update a review
export const updateReviewApi = (data) => Api.post('/api/products/update_review', data);

export const paymentApi = (data) => Api.post('/api/payment/checkout', data);
export const verifyApi = (id) => Api.post('/api/payment/verify-esewa', id);

// **Booking APIs**
export const bookProductApi = (data) => Api.post('/api/bookings/create', data);
export const getAllBookingsApi = () => Api.get('/api/bookings/all');
export const getBookingByIdApi = (id) => Api.get(`/api/bookings/booking/${id}`);
export const cancelBookingApi = (id) => Api.put(`/api/bookings/cancel/${id}`);
export const logoutUserApi = () => Api.post('/api/user/logout');

