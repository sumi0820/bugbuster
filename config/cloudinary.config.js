
const multer = require("multer");
const cloudinary = require("cloudinary").v2
const { CloudinaryStorage } = require('multer-storage-cloudinary');

require("dotenv").config();

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_ID,
  api_secret: process.env.API_SECRET
})

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  folder: "bugbuster",
  allowedFormats: ["jpg", "png","jpeg", "gif"],
  transformation: [{ width: 500, height: 500, crop: "limit" }]
  });
const parser = multer({ storage: storage });

module.exports = { parser, storage };