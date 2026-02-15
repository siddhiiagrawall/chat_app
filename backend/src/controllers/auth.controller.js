import { generateToken } from "../lib/utils.js";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import cloudinary from "../lib/cloudinary.js";

export const signup = async (req, res) => {
  const { fullName, email, password, gender } = req.body;

  try {
    if (!fullName || !email || !password || !gender) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: 'Invalid email format' });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters long' });
    }
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User with this email already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Generate avatar based on gender
    const maleProfilePic = `https://avatar.iran.liara.run/public/boy?username=${email}`;
    const femaleProfilePic = `https://avatar.iran.liara.run/public/girl?username=${email}`;

    const newUser = new User({
      email,
      fullName,
      password: hashedPassword,
      gender,
      profilePic: gender === "male" ? maleProfilePic : femaleProfilePic
    });

    if (newUser) {
      generateToken(newUser._id, res);
      await newUser.save();
      return res.status(201).json({
        _id: newUser._id,
        email: newUser.email,
        fullName: newUser.fullName,
        profilePic: newUser.profilePic,
        gender: newUser.gender,
      });
    }
    else return res.status(500).json({ message: 'Error registering user' });
  } catch (error) {
    console.error('Error registering user:', error.message);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    generateToken(user._id, res);

    res.status(200).json({
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      profilePic: user.profilePic,
      gender: user.gender,
    });
  } catch (error) {
    console.log("Error in login controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const logout = (req, res) => {
  try {
    res.cookie("jwt", "", { maxAge: 0 });
    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    console.log("Error in logout controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { profilePic } = req.body;
    const userId = req.user._id;

    if (!profilePic) {
      return res.status(400).json({ message: "Profile pic is required" });
    }

    const uploadResponse = await cloudinary.uploader.upload(profilePic);
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { profilePic: uploadResponse.secure_url },
      { new: true }
    );

    res.status(200).json(updatedUser);
  } catch (error) {
    console.log("error in update profile:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const checkAuth = (req, res) => {
  try {
    res.status(200).json(req.user);
  } catch (error) {
    console.log("Error in checkAuth controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Get other users (for chat list)
export const getOtherUsers = async (req, res) => {
  try {
    const loggedInUserId = req.user._id;
    const otherUsers = await User.find({ _id: { $ne: loggedInUserId } })
      .select("-password")
      .sort({ lastSeen: -1 });

    res.status(200).json(otherUsers);
  } catch (error) {
    console.log("Error in getOtherUsers controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const updateAbout = async (req, res) => {
  try {
    const { about } = req.body;
    const userId = req.user._id;

    if (!about) {
      return res.status(400).json({ message: "About content is required" });
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { about },
      { new: true }
    );

    res.status(200).json(updatedUser);
  } catch (error) {
    console.log("error in update about:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const blockUser = async (req, res) => {
  try {
    const { id: userToBlockId } = req.params;
    const userId = req.user._id;

    if (userId.toString() === userToBlockId) {
      return res.status(400).json({ message: "You cannot block yourself" });
    }

    const user = await User.findById(userId);
    if (!user.blockedUsers.includes(userToBlockId)) {
      user.blockedUsers.push(userToBlockId);
      await user.save();
    }

    res.status(200).json({ message: "User blocked successfully" });
  } catch (error) {
    console.log("Error in blockUser controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const unblockUser = async (req, res) => {
  try {
    const { id: userToUnblockId } = req.params;
    const userId = req.user._id;

    const user = await User.findById(userId);
    user.blockedUsers = user.blockedUsers.filter(
      (id) => id.toString() !== userToUnblockId
    );
    await user.save();

    res.status(200).json({ message: "User unblocked successfully" });
  } catch (error) {
    console.log("Error in unblockUser controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
