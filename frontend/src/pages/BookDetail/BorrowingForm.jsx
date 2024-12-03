import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './BorrowingForm.css';

const BorrowingForm = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { book } = location.state || {}; // Get the book from the state passed from Book.jsx
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    borrowDate: new Date(),
    returnDate: new Date(new Date().setDate(new Date().getDate() + 14)), // Default 2 weeks
  });
  const [successMessage, setSuccessMessage] = useState(''); // For showing the success message

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Simulate the submission process
    console.log('Form Submitted:', formData);

    // Show success message
    setSuccessMessage(`You have successfully borrowed the book: ${book?.title}.`);

    // Navigate to the home page after 3 seconds
    setTimeout(() => {
      navigate('/');
    }, 3000);
  };

  if (!book) {
    return <p>Book details not found. Please go back and select a book.</p>;
  }

  return (
    <div className="borrowing-form-container">
      <h2>Borrow Book: {book.title}</h2>
      <img src={book.imageUrl} alt={book.title} className="borrow-book-image" />

      {successMessage ? (
        <div className="success-message">{successMessage}</div>
      ) : (
        <form onSubmit={handleSubmit} className="borrow-form">
          <label>
            Full Name:
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              required
            />
          </label>
          <label>
            Email:
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </label>
          <label>
            Borrow Date:
            <input
              type="date"
              name="borrowDate"
              value={formData.borrowDate.toISOString().slice(0, 10)}
              onChange={handleChange}
              required
            />
          </label>
          <label>
            Return Date:
            <input
              type="date"
              name="returnDate"
              value={formData.returnDate.toISOString().slice(0, 10)}
              onChange={handleChange}
              required
            />
          </label>
          <button type="submit">Submit Borrow Request</button>
        </form>
      )}
    </div>
  );
};

export default BorrowingForm;
