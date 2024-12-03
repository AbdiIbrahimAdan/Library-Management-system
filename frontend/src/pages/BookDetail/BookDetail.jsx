import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Pie } from 'react-chartjs-2';
import useUserStore from '../../store/userStore';
import './BookDetail.css';

const BookDetail = () => {
  const { id } = useParams(); // Get the book ID from the URL
  const navigate = useNavigate();
  const { books, fetchBooks } = useUserStore();

  useEffect(() => {
    if (!books.length) {
      fetchBooks(); // Fetch books if not already loaded
    }
  }, [books, fetchBooks]);

  const selectedBook = books.find((book) => book._id === id);

  if (!selectedBook) {
    return (
      <div className="book-detail-container">
        <h2>Book Not Found</h2>
        <button onClick={() => navigate(-1)} className="back-button">Go Back</button>
      </div>
    );
  }

  const genderData = {
    labels: ['Male', 'Female', 'Other'],
    datasets: [
      {
        data: selectedBook.genderStats || [30, 50, 20], // Mock data if not available
        backgroundColor: ['#3498db', '#e74c3c', '#9b59b6'],
      },
    ],
  };

  const countryData = {
    labels: (selectedBook.countryStats || []).map((c) => c.country || 'Unknown'),
    datasets: [
      {
        data: (selectedBook.countryStats || []).map((c) => c.count || 0),
        backgroundColor: ['#1abc9c', '#2ecc71', '#f1c40f', '#e67e22', '#e74c3c'],
      },
    ],
  };

  return (
    <div className="book-detail-container">
      <button onClick={() => navigate(-1)} className="back-button">Back</button>
      <div className="book-detail">
        <img src={selectedBook.imageUrl} alt={selectedBook.title} className="book-detail-image" />
        <div className="book-info">
          <h1 className="book-title">{selectedBook.title}</h1>
          <p className="book-description">{selectedBook.description}</p>
        </div>
      </div>
      <div className="book-visualizations">
        <div className="visualization-section">
          <h2>Gender Statistics</h2>
          <Pie data={genderData} />
        </div>
        <div className="visualization-section">
          <h2>Country Statistics</h2>
          <Pie data={countryData} />
        </div>
      </div>
    </div>
  );
};

export default BookDetail;
