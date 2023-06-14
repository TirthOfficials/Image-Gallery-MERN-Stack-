import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

const App = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [images, setImages] = useState([]);
  const [openImage, setOpenImage] = useState(null);

  useEffect(() => {
    fetchImages();
  }, []);

  const handleFileChange = (e) => {
    setSelectedImage(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!selectedImage) {
      console.error('No image selected');
      return;
    }

    const formData = new FormData();
    formData.append('image', selectedImage);

    try {
      await axios.post('http://localhost:3001/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setSelectedImage(null);
      fetchImages();
      console.log('Image uploaded successfully');
    } catch (error) {
      console.error(error);
    }
  };

  const fetchImages = async () => {
    try {
      const response = await axios.get('http://localhost:3001/images');
      setImages(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:3001/images/${id}`);
      fetchImages();
      console.log('Image deleted successfully');
    } catch (error) {
      console.error(error);
    }
  };

  const handleOpen = (image) => {
    window.open(`http://localhost:3001/uploads/${image.filename}`, '_blank');
  };

  const handleClose = () => {
    setOpenImage(null);
  };

  return (
    <div className="app-container">
      <h1 className="app-title">Image Gallery</h1>
      <div className="upload-container">
        <input type="file" onChange={handleFileChange} />
        <button className="upload-button" onClick={handleUpload}>
          Upload
        </button>
      </div>
      <div className="image-grid">
        {images.map((image) => (
          <div key={image._id} className="image-container">
            <div className="image-wrapper">
              <img
                src={`http://localhost:3001/uploads/${image.filename}`}
                alt={image.filename}
                className="thumbnail-image"
              />
              <span className="image-name">{image.filename}</span>
            </div>
            <div>
              <button className="open-button" onClick={() => handleOpen(image)}>
                Open
              </button>
              <button className="delete-button" onClick={() => handleDelete(image._id)}>
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
export default App;
