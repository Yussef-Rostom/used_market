const { check, body, validationResult } = require('express-validator');

const hasFile = (fieldName) => {
    return (req, res, next) => {
        console.log(req.file);
        if (!req.file) {
            throw new Error(`File ${fieldName} is required`);
        }
        return true;
    };
};

const validate = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ status: 'fail', errors: errors.array() });
    }
    next();
}

const register = (req, res, next) => {
    return [
        body('firstName').notEmpty().withMessage('firstName is required'),
        body('lastName').notEmpty().withMessage('lastName is required'),
        body('email').isEmail().withMessage('email is not valid'),
        body('phoneNumber').isLength(11).withMessage('phoneNumber must be at 11 number'),
        body('password').isLength({ min: 6 }).withMessage('password must be at least 6 characters long')
    ]
}

const login = (req, res, next) => {
    return [
        body('email').isEmail().withMessage('email is not valid'),
        body('password').notEmpty().withMessage('password is required'),
    ]
}

const createProduct = (req, res, next) => {
    return [
        check('file').custom((value, { req }) => {
            if (!req.file) {
                throw new Error('File is required');
            }
            return true;
        }),
        body('name').notEmpty().withMessage('name is required'),
        body('description').notEmpty().withMessage('description is required'),
        body('price').isNumeric().withMessage('price must be a number'),
        body('category').notEmpty().withMessage('category is required')
    ]
}

module.exports = {
    validate,
    register,
    login,
    createProduct,
};
