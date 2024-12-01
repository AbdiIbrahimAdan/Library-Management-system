import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { FaStar } from 'react-icons/fa';
import BorrowingForm from './BorrowingForm';
import './BookDetail.css';

const BookDetail = () => {
  const { id } = useParams();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userRating, setUserRating] = useState(0);
  const [comment, setComment] = useState('');
  const [showBorrowForm, setShowBorrowForm] = useState(false);
  const [recommendations, setRecommendations] = useState([]);

  useEffect(() => {
    fetchBookDetails();
    fetchRecommendations();
  }, [id]);

  const fetchBookDetails = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/books/${id}`);
      setBook(response.data);
    } catch (error) {
      console.error('Error fetching book details:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchRecommendations = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/books/recommendations`);
      setRecommendations(response.data);
    } catch (error) {
      console.error('Error fetching recommendations:', error);
    }
  };

  const handleRatingSubmit = async () => {
    try {
      await axios.post(`http://localhost:5000/api/books/${id}/rate`, {
        rating: userRating,
        comment
      });
      fetchBookDetails(); // Refresh book details
      setUserRating(0);
      setComment('');
    } catch (error) {
      console.error('Error submitting rating:', error);
    }
  };

  if (loading) {
    return <div className="loading-spinner">Loading...</div>;
  }

  if (!book) {
    return <div className="error-message">Book not found</div>;
  }

  return (
    <div className="book-detail-container">
      <div className="book-detail-main">
        <div className="book-detail-image">
          <img src={book.imageUrl} alt={book.title} />
        </div>
        
        <div className="book-detail-info">
          <h1>{book.title}</h1>
          <h2>by {book.author}</h2>
          
          <div className="book-rating-large">
            {[...Array(5)].map((_, index) => (
              <FaStar
                key={index}
                className={index < book.averageRating ? 'star-filled' : 'star-empty'}
              />
            ))}
            <span>({book.totalRatings} ratings)</span>
          </div>

          <p className="book-description">{book.description}</p>
          
          <div className="book-metadata">
            <p><strong>ISBN:</strong> {book.ISBN}</p>
            <p><strong>Category:</strong> {book.category}</p>
            <p><strong>Price:</strong> Ksh.{book.price}</p>
            <p><strong>Available Copies:</strong> {book.availableCopies}</p>
            <p><strong>Published:</strong> {new Date(book.publishedDate).toLocaleDateString()}</p>
          </div>

          <div className="book-actions">
            <button 
              className="borrow-button"
              disabled={book.availableCopies === 0}
              onClick={() => setShowBorrowForm(true)}
            >
              Borrow Book
            </button>
            <button className="cart-button">
              Add to Cart
            </button>
          </div>
        </div>
      </div>

      {/* Rating and Comment Section */}
      <div className="rating-section">
        <h3>Rate this Book</h3>
        <div className="rating-input">
          {[...Array(5)].map((_, index) => (
            <FaStar
              key={index}
              className={index < userRating ? 'star-filled' : 'star-empty'}
              onClick={() => setUserRating(index + 1)}
            />
          ))}
        </div>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Write your review..."
          className="comment-input"
        />
        <button 
          onClick={handleRatingSubmit}
          className="submit-rating-button"
        >
          Submit Review
        </button>
      </div>

      {/* Comments Section */}
      <div className="comments-section">
        <h3>Reviews</h3>
        {book.comments.map((comment) => (
          <div key={comment._id} className="comment-card">
            <div className="comment-header">
              <div className="comment-rating">
                {[...Array(5)].map((_, index) => (
                  <FaStar
                    key={index}
                    className={index < comment.rating ? 'star-filled' : 'star-empty'}
                  />
                ))}
              </div>
              <span className="comment-date">
                {new Date(comment.createdAt).toLocaleDateString()}
              </span>
            </div>
            <p className="comment-text">{comment.comment}</p>
          </div>
        ))}
      </div>

      {/* Recommendations Section */}
      <div className="recommendations-section">
        <h3>You May Also Like</h3>
        <div className="recommendations-grid">
          {recommendations.map((book) => (
            <div key={book._id} className="recommendation-card">
              <img src={book.imageUrl} alt={book.title} />
              <h4>{book.title}</h4>
              <p>{book.author}</p>
            </div>
          ))}
        </div>
      </div>

      {showBorrowForm && (
        <BorrowingForm
          book={book}
          onClose={() => setShowBorrowForm(false)}
          onSuccess={() => {
            setShowBorrowForm(false);
            fetchBookDetails();
          }}
        />
      )}
    </div>
  );
};

export default BookDetail;