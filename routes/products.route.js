const productsController = require('../controllers/products.controller');
const {verifyToken} = require('../middlewares/verifyToken');
const isAdmin = require('../middlewares/isAdmin');
const isOwnerOrAdmin = require('../middlewares/isOwnerOrAdmin');
const express = require('express');
const multer = require('multer');
const validator = require('../middlewares/validation');
const {validate} = require('../middlewares/validation')
const router = express.Router();


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
    const diskStorage = multer.diskStorage({
        destination: function(req, file, cb){
            cb(null,'uploads')
        },
        filename: function(req,file,cb){
            let ext = file.mimetype.split('/')[1]
            const fileName = `product-${Date.now()}.${ext}`
            cb(null, fileName)
        }
    })

    const fileFilter = function (req,file,cb){
        const imageType = file.mimetype.split('/')[0]
        if(imageType == 'image') return cb(null, true)
        cb({error:'not valid'}, false)
    }
    return multer({ storage: diskStorage, fileFilter });
}

module.exports = router;