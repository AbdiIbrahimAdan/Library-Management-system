import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import backgroundImage from '../assets/book2.jpeg';
import Banner from '../components/Banner/Banner';
import BookList from '../components/Dashboard/Book/BookList';
import BookDetail from '../pages/BookDetail/BookDetail';
import Cart from '../components/Cart/Cart';

const Book = () => {
  const [showCart, setShowCart] = useState(false);

  return (
    <div>
      <Banner title="Library Collection" backgroundImage={backgroundImage} />
      <Routes>
        <Route path="/" element={<BookList />} />
        <Route path="/:id" element={<BookDetail />} />
      </Routes>
      {showCart && <Cart onClose={() => setShowCart(false)} />}
    </div>
  );
};

export default Book;