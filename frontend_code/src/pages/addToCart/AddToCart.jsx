import React, { useEffect, useState } from 'react';
import { getCartItemsApi, paymentApi, removeCartItemApi } from '../../apis/Api';
import { Container, Row, Col, Button, Table } from 'react-bootstrap';
import './CartPage.css';
import { toast } from 'react-toastify';

const CartPage = () => {
    const [cartItems, setCartItems] = useState([]);

    useEffect(() => {
        const fetchCartItems = async () => {
            try {
                const response = await getCartItemsApi();
                if (response.status === 200) {
                    const itemsWithQuantity = response.data.cartItem.map(item => ({ ...item, quantity: 1 }));
                    setCartItems(itemsWithQuantity);
                } else {
                    console.error('Failed to fetch cart items:', response.data.message);
                }
            } catch (error) {
                console.error('Error fetching cart items:', error);
            }
        };
        fetchCartItems();
    }, []);

    const handleRemoveItem = async (itemId) => {
        try {
            const response = await removeCartItemApi(itemId);
            if (response.status === 200) {
                setCartItems(prevItems => prevItems.filter(item => item._id !== itemId));
                toast.success('Product removed from cart!');
            } else {
                console.error('Failed to remove cart item:', response.data.message);
            }
        } catch (error) {
            console.error('Error removing cart item:', error);
        }
    };

    const handleIncreaseQuantity = (itemId) => {
        setCartItems(prevItems =>
            prevItems.map(item =>
                item._id === itemId ? { ...item, quantity: item.quantity + 1 } : item
            )
        );
    };

    const handleDecreaseQuantity = (itemId) => {
        setCartItems(prevItems =>
            prevItems.map(item =>
                item._id === itemId && item.quantity > 1 ? { ...item, quantity: item.quantity - 1 } : item
            )
        );
    };

    const calculateTotal = () => {
        return cartItems.reduce((total, item) => total + (item.productPrice * item.quantity), 0);
    };

    const handleCheckout = async () => {
        const totalAmount = calculateTotal();
        try {
            const response = await paymentApi({ totalAmount, cartItems }); // Include cartItems
            const { formData } = response.data;

            const form = document.createElement('form');
            form.action = "https://rc-epay.esewa.com.np/api/epay/main/v2/form";
            form.method = "POST";

            Object.keys(formData).forEach(key => {
                const input = document.createElement('input');
                input.type = 'hidden';
                input.name = key;
                input.value = formData[key];
                form.appendChild(input);
            });

            document.body.appendChild(form);
            form.submit();
        } catch (error) {
            console.error('Checkout error:', error);
            toast.error('Failed to initiate checkout');
        }
    };

    return (
        <Container className="cart-container">
            <h2 className="text-center">Your Cart ({cartItems.length} items)</h2>
            <Table responsive className="cart-table">
                <thead>
                    <tr>
                        <th>Item</th>
                        <th>Price</th>
                        <th>Quantity</th>
                        <th>Total</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {cartItems.map(item => (
                        <tr key={item._id}>
                            <td>
                                <div className="cart-item">
                                    <img
                                        src={`http://localhost:8848/products/${item.productImage}`}
                                        alt={item.productTitle}
                                        className="cart-item-image"
                                    />
                                    <div className="cart-item-details">
                                        <p className="cart-item-title">{item.productTitle}</p>
                                        <p className="cart-item-subtitle">{item.productDescription}</p>
                                    </div>
                                </div>
                            </td>
                            <td>NPR {item.productPrice.toFixed(2)}</td>
                            <td>
                                <div className="quantity-control">
                                    <Button variant="outline-secondary" onClick={() => handleDecreaseQuantity(item._id)}>-</Button>
                                    <span>{item.quantity}</span>
                                    <Button variant="outline-secondary" onClick={() => handleIncreaseQuantity(item._id)}>+</Button>
                                </div>
                            </td>
                            <td>NPR {(item.productPrice * item.quantity).toFixed(2)}</td>
                            <td>
                                <Button variant="danger" onClick={() => handleRemoveItem(item._id)}>Remove</Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>
            <div className="cart-summary">
                <Row>
                    <Col md={{ span: 4, offset: 8 }}>
                        <div className="summary-item total">
                            <span>Grand Total:</span>
                            <span>NPR {(calculateTotal()).toFixed(2)}</span>
                        </div>
                        <Button variant="dark" className="checkout-button" onClick={handleCheckout}>Check out</Button>
                    </Col>
                </Row>
            </div>
        </Container>
    );
};

export default CartPage;
