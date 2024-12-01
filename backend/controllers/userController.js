
import User from '../models/User.js';

// Add to getAllUsers
export const getAllUsers = async (req, res) => {
  try {
      const users = await User.find({})
          .select('-password')
          .sort({ createdAt: -1 }); // Sort by newest first
      res.status(200).json(users);
  } catch (error) {
      res.status(500).json({ message: 'Failed to retrieve users', error: error.message });
  }
};
// Get User by ID
export const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update User Role
export const updateUserRole = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.role = req.body.role;
    await user.save();
    res.json({ message: `User role updated to ${user.role}` });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete User
export const deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
