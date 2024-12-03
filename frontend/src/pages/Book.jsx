import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Banner from '../components/Banner/Banner';
import useUserStore from '../store/userStore';
import { Pie } from 'react-chartjs-2';
import './Book.css';

const Book = () => {
  const { books, fetchBooks } = useUserStore();
  const navigate = useNavigate();
  const { id } = useParams();
  const selectedBook = books.find((book) => book._id === id);

  useEffect(() => {
    if (!books.length) {
      fetchBooks();
    }
  }, [books, fetchBooks]);

  const handleViewDetails = (bookId) => {
    navigate(`/book/${bookId}`);
  };

  const handleBorrowBook = (book) => {
    navigate('/borrow', { state: { book } });
  };

  if (id && selectedBook) {
    const genderData = {
      labels: ['Male', 'Female', 'Other'],
      datasets: [
        {
          data: selectedBook.genderStats || [0, 0, 0],
          backgroundColor: ['#3498db', '#e74c3c', '#9b59b6'],
        },
      ],
    };

    const countryData = {
      labels: (selectedBook.countryStats || []).map((c) => c.country),
      datasets: [
        {
          data: (selectedBook.countryStats || []).map((c) => c.count),
          backgroundColor: ['#1abc9c', '#2ecc71', '#f1c40f', '#e67e22', '#e74c3c'],
        },
      ],
    };

    return (
      <div className="book-detail-container">
        <button className="back-button" onClick={() => navigate(-1)}>Back</button>
        <div className="book-detail">
          <img src={selectedBook.imageUrl} alt={selectedBook.title} className="book-detail-image" />
          <div className="book-info">
            <h1>{selectedBook.title}</h1>
            <p>{selectedBook.description}</p>
            <p>Price: Ksh.{selectedBook.price}</p>
            <div className="book-buttons">
              <button onClick={() => handleViewDetails(selectedBook._id)}>View Details</button>
              <button onClick={() => handleBorrowBook(selectedBook)}>Borrow</button>
            </div>
          </div>
        </div>
        <div className="book-stats">
          <h2>Gender Statistics</h2>
          <Pie data={genderData} />
          <h2>Country Statistics</h2>
          <Pie data={countryData} />
        </div>
      </div>
    );
  }

  return (
    <div>
      <Banner title="Library Collection" />
      <div className="book-list-container">
        {books.map((book) => (
          <div key={book._id} className="book-card">
            <img src={book.imageUrl} alt={book.title} className="book-image" />
            <h3 className="book-title">{book.title}</h3>
            <p className="book-description">{book.description}</p>
            <p className="book-price">Ksh.{book.price}</p>
            <div className="book-buttons">
              <button onClick={() => handleViewDetails(book._id)}>View Details</button>
              <button onClick={() => handleBorrowBook(book)}>Borrow</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Book;
