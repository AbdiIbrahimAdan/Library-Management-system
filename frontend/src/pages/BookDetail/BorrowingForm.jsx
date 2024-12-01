import React, { useState } from 'react';
import axios from 'axios';
import { useUser } from '../../context/UserContext';
import './BorrowingForm.css';

const BorrowingForm = ({ book, onClose, onSuccess }) => {
  const { user } = useUser();
  const [formData, setFormData] = useState({
    borrowDate: new Date().toISOString().split('T')[0],
    returnDate: '',
    purpose: '',
    agreement: false
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Calculate return date limit (e.g., 14 days from today)
  const maxReturnDate = new Date();
  maxReturnDate.setDate(maxReturnDate.getDate() + 14);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.agreement) {
      setError('Please agree to the terms and conditions');
      return;
    }

    try {
      setLoading(true);
      setError('');

      const response = await axios.post(
        `http://localhost:5000/api/borrowings/create`,
        {
          bookId: book._id,
          ...formData
        },
        { withCredentials: true }
      );

      if (response.data.success) {
        onSuccess();
      }
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to submit borrowing request');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="borrowing-form-overlay">
      <div className="borrowing-form-container">
        <button className="close-button" onClick={onClose}>&times;</button>
        
        <h2>Borrow Book</h2>
        <div className="book-summary">
          <img src={book.imageUrl} alt={book.title} className="book-thumbnail" />
          <div className="book-info">
            <h3>{book.title}</h3>
            <p>by {book.author}</p>
            <p className="availability">
              Available Copies: {book.availableCopies}
            </p>
          </div>
        </div>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit} className="borrowing-form">
          <div className="form-group">
            <label>Borrow Date:</label>
            <input
              type="date"
              value={formData.borrowDate}
              disabled
              className="form-control"
            />
          </div>

          <div className="form-group">
            <label>Return Date:</label>
            <input
              type="date"
              value={formData.returnDate}
              onChange={(e) => setFormData({ ...formData, returnDate: e.target.value })}
              min={new Date().toISOString().split('T')[0]}
              max={maxReturnDate.toISOString().split('T')[0]}
              required
              className="form-control"
            />
            <small>Maximum borrowing period is 14 days</small>
          </div>

          <div className="form-group">
            <label>Purpose of Borrowing:</label>
            <textarea
              value={formData.purpose}
              onChange={(e) => setFormData({ ...formData, purpose: e.target.value })}
              required
              className="form-control"
              placeholder="Please state your purpose for borrowing this book"
            />
          </div>

          <div className="form-group checkbox-group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={formData.agreement}
                onChange={(e) => setFormData({ ...formData, agreement: e.target.checked })}
              />
              I agree to return the book in good condition by the return date
            </label>
          </div>

          <div className="borrowing-summary">
            <h4>Borrowing Summary</h4>
            <p>Member Name: {user.name}</p>
            <p>Member ID: {user._id}</p>
            <p>Book Title: {book.title}</p>
            <p>ISBN: {book.ISBN}</p>
          </div>

          <button 
            type="submit" 
            className="submit-button"
            disabled={loading}
          >
            {loading ? 'Processing...' : 'Confirm Borrowing'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default BorrowingForm;