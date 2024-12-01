import React, { useState } from 'react';
import axios from 'axios';

const AddBook = () => {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [description, setDescription] = useState('');
  const [ISBN, setISBN] = useState('');
  const [category, setCategory] = useState('');
  const [price, setPrice] = useState('');
  const [stock, setStock] = useState(1);
  const [availableCopies, setAvailableCopies] = useState(1);
  const [totalCopies, setTotalCopies] = useState(1);
  const [publishedDate, setPublishedDate] = useState('');
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Upload image to Cloudinary
      const formData = new FormData();
      formData.append('file', image);
      formData.append('upload_preset', 'book_upload');

      const uploadResponse = await axios.post(
        'https://api.cloudinary.com/v1_1/dgcsowpor/image/upload',
        formData
      );
      const imageUrl = uploadResponse.data.secure_url;

      // Prepare book data
      const newBook = {
        title,
        author,
        description,
        ISBN,
        category,
        price: Number(price),
        stock: Number(stock),
        availableCopies: Number(availableCopies),
        totalCopies: Number(totalCopies),
        publishedDate: publishedDate || null,
        imageUrl,
      };

      await axios.post('http://localhost:5000/api/books/add', newBook);

      // Reset form
      setTitle('');
      setAuthor('');
      setDescription('');
      setISBN('');
      setCategory('');
      setPrice('');
      setStock(1);
      setAvailableCopies(1);
      setTotalCopies(1);
      setPublishedDate('');
      setImage(null);

      alert('Book added successfully!');
    } catch (error) {
      console.error('Failed to add book:', error.response?.data || error.message);
      alert('Error adding book, please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', padding: '20px', backgroundColor: '#f9f9f9', borderRadius: '8px' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Add Book</h2>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '15px' }}>
          <label>Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            placeholder="Enter book title"
            style={inputStyle}
          />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label>Author</label>
          <input
            type="text"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            required
            placeholder="Enter author's name"
            style={inputStyle}
          />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label>Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter book description (optional)"
            style={{ ...inputStyle, height: '100px' }}
          />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label>ISBN</label>
          <input
            type="text"
            value={ISBN}
            onChange={(e) => setISBN(e.target.value)}
            required
            placeholder="Enter ISBN"
            style={inputStyle}
          />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label>Category</label>
          <input
            type="text"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            placeholder="Enter category (optional)"
            style={inputStyle}
          />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label>Price</label>
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
            placeholder="Enter price"
            style={inputStyle}
          />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label>Stock</label>
          <input
            type="number"
            value={stock}
            onChange={(e) => setStock(e.target.value)}
            min="1"
            style={inputStyle}
          />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label>Available Copies</label>
          <input
            type="number"
            value={availableCopies}
            onChange={(e) => setAvailableCopies(e.target.value)}
            min="1"
            style={inputStyle}
          />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label>Total Copies</label>
          <input
            type="number"
            value={totalCopies}
            onChange={(e) => setTotalCopies(e.target.value)}
            min="1"
            style={inputStyle}
          />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label>Published Date</label>
          <input
            type="date"
            value={publishedDate}
            onChange={(e) => setPublishedDate(e.target.value)}
            style={inputStyle}
          />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label>Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImage(e.target.files[0])}
            required
            style={inputStyle}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          style={{
            backgroundColor: loading ? '#ccc' : '#007BFF',
            color: '#fff',
            padding: '10px 15px',
            border: 'none',
            borderRadius: '4px',
            cursor: loading ? 'not-allowed' : 'pointer',
            width: '100%',
          }}
        >
          {loading ? 'Adding...' : 'Add Book'}
        </button>
      </form>
    </div>
  );
};

// Input field style
const inputStyle = {
  display: 'block',
  width: '100%',
  padding: '8px',
  marginBottom: '8px',
  border: '1px solid #ccc',
  borderRadius: '4px',
  fontSize: '14px',
};

export default AddBook;
