// import React, { useEffect, useState } from 'react';
// import axios from 'axios';

// const BookList = () => {
//   const [books, setBooks] = useState([]);

//   useEffect(() => {
//     const fetchBooks = async () => {
//       try {
//         const response = await axios.get('http://localhost:5000/api/books');
//         setBooks(response.data);
//       } catch (error) {
//         console.error('Error fetching books:', error);
//       }
//     };

//     fetchBooks();
//   }, []);

//   const handleBorrow = async (bookId) => {
//     // Implement borrowing logic here
//   };

//   const handleAddToCart = async (bookId) => {
//     // Implement add to cart logic here
//   };

//   return (
//     <div>
//       <h2>Book List</h2>
//       <div className="book-list">
//         {books.map(book => (
//           <div key={book._id} className="book-item">
//             <img src={book.imageUrl} alt={book.title} />
//             <h3>{book.title}</h3>
//             <p>{book.description}</p>
//             <p>Price: ${book.price}</p>
//             <p>Rating: {book.averageRating} ⭐</p>
//             <button onClick={() => handleBorrow(book._id)}>Borrow</button>
//             <button onClick={() => handleAddToCart(book._id)}>Add to Cart</button>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default BookList;

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './BookList.css'; 

const BookList = () => {
  const [books, setBooks] = useState([]);

  useEffect(() => {
    const fetchBooks = async () => {
      const response = await axios.get('http://localhost:5000/api/books/');
      
      // Check if the response has the expected books array
      if (response.data && response.data.books) {
        setBooks(response.data.books); // Set books array from the response
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
