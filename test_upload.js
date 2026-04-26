import cloudinary from './server/config/cloudinary.js';
import fs from 'fs';

const testUpload = async () => {
  try {
    const buffer = Buffer.from('test pdf content, not real pdf but enough to check type');
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: 'resumes',
        resource_type: 'raw',
        public_id: 'test_resume.pdf',
      },
      (error, result) => {
        if (error) {
          console.error('Error:', error);
        } else {
          console.log('Result URL:', result.secure_url);
        }
      }
    );
    uploadStream.end(buffer);
  } catch (error) {
    console.error(error);
  }
};

testUpload();
