const User = require('../models/user.model');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { addToBlacklist } = require('../middlewares/verifyToken');

// POST api/users/register
const register = async (req, res) => {

    const { firstName, lastName, email, password } = req.body;

    const oldUser = await User.findOne({ email });
    if (oldUser) return res.status(400).json({ message: 'User already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
        firstName,
        lastName,
        email,
        password: hashedPassword,
    });


    const token = jwt.sign({ id: user._id, role: user.role }, 'SECRET', {
        expiresIn: '1h',
    });

    await user.save();

    delete user._doc.password;
    delete user._doc.__v;

    res.status(201).json({ status: 'success', data: user, token });
};

// POST api/users/login
const login = async (req, res) => {

    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid email or password' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid email or password' });

    const token = jwt.sign({ id: user._id, role: user.role }, 'SECRET', {
        expiresIn: '1h',
    });

    delete user._doc.password;
    delete user._doc.__v;

    res.status(201).json({ status: 'success', data: user, token });
};

// POST api/users/logout
const logout = (req, res) => {
    addToBlacklist(req.token);
    res.status(200).json({ message: 'Logout successful (client should delete token)' });
};

// GET /api/users/me
const getMyProfile = async (req, res) => {
    const user = await User.findById(req.user.id).select('-password -__v');
    res.status(200).json({ status: 'success', data: user });
};

// PUT /api/users/me
const updateMyProfile = async (req, res) => {

    const updated = await prepareUserToUpdate(req);

    await User.findByIdAndUpdate(
        req.user.id,
        updated,
        { runValidators: true }
    );

    updated.role = req.user.role;
    delete updated.password;
    
    res.status(200).json({ status: 'success', data: req.body });
};

// =============== admin only ===============
// GET /api/users
const getAllUsers = async (req, res) => {
    const users = await User.find().select('-password -__v');
    res.json({ status: 'success', data: users });
};

// GET /api/users/:id
const getUserById = async (req, res) => {
    const user = await User.findById(req.params.id).select('-password -__v');
    if (!user) return res.status(404).json({ status: 'fail', message: 'User not found' });
    res.json({ status: 'success', data: user });
};

// PUT /api/users/:id
const updateUser = async (req, res) => {
    const updated = await prepareUserToUpdate(req);
    const user = await User.findByIdAndUpdate(req.params.id, updated, {
        runValidators: true,
    });
    if (!user) return res.status(404).json({ message: 'User not found' });

    updated.password = req.body.password;
    updated._id = req.body._id;
    
    res.json({ status: 'success', data: updated });
};

// DELETE /api/users/:id
const deleteUser = async (req, res) => {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json({ status: 'success', message: 'User deleted' });
};

module.exports = {
    getMyProfile,
    updateMyProfile,
    getAllUsers,
    getUserById,
    updateUser,
    deleteUser,
    register,
    login,
    logout
};


const prepareUserToUpdate = async(req) => {
    const updated = req.body;
    if (updated.email) {
        const existingUser = await User.findOne({ email:updated.email });
        if (existingUser) return res.status(400).json({ message: 'there is user already have this email' });
    }
    if (updated.password) updated.password = await bcrypt.hash(updated.password, 10);
    if (req.user.role != "ADMIN" && updated.role) delete updated.role;
    if (updated._id) delete updated._id;
    if (updated.__v) delete updated.__v;
    return updated;
};
