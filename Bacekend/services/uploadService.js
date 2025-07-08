const cloudinary = require('../config/cloudinary');

const uploadBase64Image = async (base64Image, publicId) => {
  try {
    const result = await cloudinary.uploader.upload(base64Image, {
      public_id: `users/${publicId}`,
      folder: 'skill-matana',
      overwrite: true
    });

    return {
      url: result.secure_url,
      public_id: result.public_id
    };
  } catch (error) {
    console.error('Upload failed:', error);
    throw error;
  }
};

module.exports = {
  uploadBase64Image
};
