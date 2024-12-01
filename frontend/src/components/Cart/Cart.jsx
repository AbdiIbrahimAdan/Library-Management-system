import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useUser } from '../../context/UserContext';
import { FaTrash, FaTimes } from 'react-icons/fa';
import './Cart.css';

const Cart = ({ onClose }) => {
  const { user } = useUser();
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchCartItems();
  }, []);

  const fetchCartItems = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/cart', {
        withCredentials: true
      });
      setCartItems(response.data.items);
    } catch (error) {
      setError('Failed to fetch cart items');
    } finally {
      setLoading(false);
    }
  };

  const removeFromCart = async (bookId) => {
    try {
      await axios.delete(`http://localhost:5000/api/cart/items/${bookId}`, {
        withCredentials: true
      });
      fetchCartItems();
    } catch (error) {
      setError('Failed to remove item from cart');
    }
  };

  const updateQuantity = async (bookId, newQuantity) => {
    try {
      if (newQuantity < 1) return;
      await axios.put(`http://localhost:5000/api/cart/items/${bookId}`, {
        quantity: newQuantity
      }, {
        withCredentials: true
      });
      fetchCartItems();
    } catch (error) {
      setError('Failed to update quantity');
    }
  };

  const checkout = async () => {
    try {
      await axios.post('http://localhost:5000/api/borrowings/bulk', {
        items: cartItems.map(item => ({
          bookId: item.book._id,
          quantity: item.quantity
        }))
      }, {
        withCredentials: true
      });
      
      // Clear cart after successful checkout
      await axios.delete('http://localhost:5000/api/cart', {
        withCredentials: true
      });
      
      setCartItems([]);
      onClose();
    } catch (error) {
      setError('Checkout failed. Please try again.');
    }
  };

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => {
      return total + (item.book.price * item.quantity);
    }, 0);
  };

  if (loading) {
    return <div className="cart-loading">Loading cart...</div>;
  }

  return (
    <div className="cart-overlay">
      <div className="cart-container">
        <div className="cart-header">
          <h2>Your Cart</h2>
          <button className="close-button" onClick={onClose}>
            <FaTimes />
          </button>
        </div>

        {error && <div className="cart-error">{error}</div>}

        {cartItems.length === 0 ? (
          <div className="cart-empty">
            <p>Your cart is empty</p>
          </div>
        ) : (
          <>
            <div className="cart-items">
              {cartItems.map((item) => (
                <div key={item.book._id} className="cart-item">
                  <img 
                    src={item.book.imageUrl} 
                    alt={item.book.title} 
                    className="cart-item-image"
                  />
                  <div className="cart-item-details">
                    <h3>{item.book.title}</h3>
                    <p>by {item.book.author}</p>
                    <p className="cart-item-price">Ksh.{item.book.price}</p>
                  </div>
                  <div className="cart-item-actions">
                    <div className="quantity-controls">
                      <button 
                        onClick={() => updateQuantity(item.book._id, item.quantity - 1)}
                        disabled={item.quantity <= 1}
                      >
                        -
                      </button>
                      <span>{item.quantity}</span>
                      <button 
                        onClick={() => updateQuantity(item.book._id, item.quantity + 1)}
                        disabled={item.quantity >= item.book.availableCopies}
                      >
                        +
                      </button>
                    </div>
                    <button 
                      className="remove-button"
                      onClick={() => removeFromCart(item.book._id)}
                    >
                      <FaTrash />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="cart-summary">
              <div className="cart-total">
                <span>Total:</span>
                <span>Ksh.{calculateTotal().toFixed(2)}</span>
              </div>
              <button 
                className="checkout-button"
                onClick={checkout}
              >
                Proceed to Checkout
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Cart;