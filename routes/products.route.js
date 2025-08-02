const productsController = require('../controllers/products.controller');
const {verifyToken} = require('../middlewares/verifyToken');
const isAdmin = require('../middlewares/isAdmin');
const isOwnerOrAdmin = require('../middlewares/isOwnerOrAdmin');
const express = require('express');
const multer = require('multer');
const validator = require('../middlewares/validation');
const {validate} = require('../middlewares/validation')
const router = express.Router();
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

require('dotenv').config();

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const upload = multerSetup();

router.route('/')
    .get(productsController.getAllProducts)
    .post(verifyToken, upload.single('image'), validator.createProduct(), validate, productsController.createProduct);


router.route('/:id')
    .get(productsController.getProduct)
    .put(verifyToken, isOwnerOrAdmin, upload.single('image'), productsController.updateProduct)
    .delete(verifyToken, isOwnerOrAdmin, productsController.deleteProduct);

router.route('/category/:category')
    .get(productsController.getAllProductsByCategory);


function multerSetup() {
    const storage = new CloudinaryStorage({
        cloudinary: cloudinary,
        params: {
            folder: 'product_images',
            public_id: (req, file) => `product-${Date.now()}-${file.originalname.split('.')[0]}`,
        },
        allowedFormats: ['jpg', 'jpeg', 'png', 'gif', 'webp'],
    });

    return multer({
        storage: storage,
        limits: {
            fileSize: 5 * 1024 * 1024
        },
    });
}

module.exports = router;