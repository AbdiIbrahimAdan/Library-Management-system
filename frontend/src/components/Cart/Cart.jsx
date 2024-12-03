import React from 'react';
import useUserStore from '../../store/userStore';
import { FaTrash, FaPlus, FaMinus } from 'react-icons/fa';

const Cart = () => {
  const { cart, removeFromCart, updateCartQuantity } = useUserStore();

  const handleQuantityChange = (bookId, action) => {
    const book = cart.find((item) => item._id === bookId);
    if (book) {
      const newQuantity = action === 'increase' ? book.quantity + 1 : book.quantity - 1;
      updateCartQuantity(bookId, newQuantity);
    }
  };

  const calculateSubtotal = (price, quantity) => price * quantity;

  const calculateTotal = () =>
    cart.reduce((total, item) => total + calculateSubtotal(item.price, item.quantity), 0);

  return (
    <div className="cart-container">
      <h2>Your Cart</h2>
      {cart.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <table className="cart-table">
          <thead>
            <tr>
              <th>Image</th>
              <th>Title</th>
              <th>Price</th>
              <th>Quantity</th>
              <th>Subtotal</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {cart.map((item) => (
              <tr key={item._id}>
                <td>
                  <img src={item.imageUrl} alt={item.title} className="cart-item-image" />
                </td>
                <td>{item.title}</td>
                <td>${item.price.toFixed(2)}</td>
                <td>
                  <button
                    className="quantity-btn"
                    onClick={() => handleQuantityChange(item._id, 'decrease')}
                  >
                    <FaMinus />
                  </button>
                  <span>{item.quantity}</span>
                  <button
                    className="quantity-btn"
                    onClick={() => handleQuantityChange(item._id, 'increase')}
                  >
                    <FaPlus />
                  </button>
                </td>
                <td>${calculateSubtotal(item.price, item.quantity).toFixed(2)}</td>
                <td>
                  <button
                    className="remove-btn"
                    onClick={() => removeFromCart(item._id)}
                  >
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      <h3>Total: ${calculateTotal().toFixed(2)}</h3>
    </div>
  );
};

export default Cart;
