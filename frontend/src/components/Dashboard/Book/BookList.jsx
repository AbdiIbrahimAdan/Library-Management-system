

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './BookList.css'; 

const BookList = () => {
  const [books, setBooks] = useState([]);

  useEffect(() => {
    const fetchBooks = async () => {
      const response = await axios.get('http://localhost:5000/api/books/');
      
      
      if (response.data && response.data.books) {
        setBooks(response.data.books); 
      } else {
        console.error('Books data not found in the response');
      }
    };
    
    fetchBooks();
  }, []);

  return (
    <div className="book-list-container">
      <h2>Book List</h2>
      <div className="book-grid">
        {books.map((book) => (
          <div key={book._id} className="book-card">
            <img src={book.imageUrl} alt={book.title} className="book-image" />
            <h3 className="book-title">{book.title}</h3>
            <p className="book-description">{book.description}</p>
            <p className="book-price">Ksh.{book.price}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BookList;
