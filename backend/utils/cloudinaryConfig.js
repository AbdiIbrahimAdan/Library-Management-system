
// import cloudinary from 'cloudinary';
// import { CloudinaryStorage } from 'multer-storage-cloudinary';
// import multer from 'multer';

// cloudinary.v2.config({
//   cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
//   api_key: process.env.CLOUDINARY_API_KEY,
//   api_secret: process.env.CLOUDINARY_API_SECRET,
// });

// const storage = new CloudinaryStorage({
//   cloudinary: cloudinary.v2, 
//   params: {
//     folder: process.env.CLOUDINARY_FOLDER || 'library_images',
//     allowed_formats: ['jpg', 'jpeg', 'png'],
//   },
// });

// const upload = multer({ storage });

// export { upload, cloudinary }; 

import { v2 as cloudinary } from 'cloudinary';
import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Multer storage for Cloudinary
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'books',
    format: async (req, file) => 'jpeg', // Supports jpeg format
    public_id: (req, file) => file.originalname,
  },
});

export const upload = multer({ storage });
export { cloudinary };
