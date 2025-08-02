const Product = require('../models/product.model');

const getAllProducts = async (req, res) => {
    const products = await Product.find();
    res.status(200).json({ status: 'success', data: products }).select("-__v");
}

const createProduct = async (req, res) => {

    const {name, description, price, category} = req.body;

    const product = await Product.create({
        name,
        description,
        price,
        category,
        imageUrl: req.file.path,
        createdBy: req.user.id
    });
    
    product.save();
    if (!product) return res.status(400).json({ status: 'fail', message: 'Product creation failed' });
    res.status(201).json({ status: 'success', data: product });
}

const getProduct = async (req, res) => {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ status: 'fail', message: 'Product not found' });
    res.status(200).json({ status: 'success', data: product });
};

const updateProduct = async (req, res) => {
    let product = await Product.findByIdAndUpdate(req.params.id, {
        ...req.body,
    },
    { runValidators: true });
    if( req.file) product.imageUrl = req.file.path;
    await product.save();
    if (!product) return res.status(404).json({ status: 'fail', message: 'Product not found' });
    product = await Product.findById(req.params.id);
    res.status(200).json({ status: 'success', data:  product });
};

const deleteProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) return res.status(404).json({ error: 'Product not found' });

        if (product.imageUrl) {
            try {
                const resource = await cloudinary.api.resource_by_url(product.imageUrl);
                await cloudinary.uploader.destroy(resource.public_id);
            } catch (cloudinaryError) {
                console.warn('Cloudinary deletion warning:', cloudinaryError.message);
            }
        }

        await Product.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: 'Product deleted successfully' });
    } catch (error) {
        console.error('Delete error:', error);
        res.status(500).json({ 
            error: 'Failed to delete product',
            details: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
}

const getAllProductsByCategory = async (req, res) => {
    const products = await Product.find({category:req.params.category});
    res.status(200).json({ status: 'success', data: products }).select("-__v");
}

module.exports = {
    getAllProducts,
    createProduct,
    getProduct,
    updateProduct,
    deleteProduct,
    getAllProductsByCategory
};