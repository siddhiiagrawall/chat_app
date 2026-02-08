import User from "../models/userModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const register = async (req, res) => {
    try {
        const { fullName, userName, password, confirmPassword, gender } = req.body;
        if (!fullName || !userName || !password || !confirmPassword || !gender) {
            return res.status(400).json({ message: "All fields are required" });
        }
        if (password !== confirmPassword) {
            return res.status(400).json({ message: "Passwords do not match" });
        }
        const user = await User.findOne({ userName: userName });
        if (user) {
            return res.status(400).json({ message: "Username already exists" });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const maleProfilePhotos = `https://avatar.iran.liara.run/public/boy?username=${userName}`;
        const femaleProfilePhotos = `https://avatar.iran.liara.run/public/girl?username=${userName}`;
        await User.create({
            fullName,
            userName,
            password: hashedPassword,
            profilePhoto: gender === "male" ? maleProfilePhotos : femaleProfilePhotos,
            gender
        });
        res.status(200).json({ message: "User registered successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};

export const login = async (req, res) => {
    try {
        const { userName, password } = req.body;
        if (!userName || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }
        const user = await User.findOne({ userName });
        if (!user) {
            return res.status(400).json({ message: "Invalid User" });
        }
        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if (!isPasswordMatch) {
            return res.status(400).json({ message: "Invalid password" });
        }
        // Create token payload
        const tokenData = {
            userID: user._id,
        };

        // Sign JWT
        const token = jwt.sign(tokenData, process.env.JWT_SECRET, { expiresIn: "1d" });

        res.status(200)
            .cookie("token", token, { httpOnly: true, sameSite: "strict", expires: new Date(Date.now() + 86400000) })
            .json({
                message: "User logged in successfully",
                user: { _id: user._id, fullName: user.fullName, userName: user.userName, profilePhoto: user.profilePhoto }
            });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};

export const logout = (req, res) => {
    try {
        res.status(200).cookie("token", "", { expires: new Date(0) })
            .json({ message: "User logged out successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};

export const getOtherUsers = async (req, res) => {
    try {
        const loggedInUserId = req.id;
        const otherUsers = await User.find({ _id: { $ne: loggedInUserId } }).select("-password -createdAt -updatedAt -__v");
        res.status(200).json(otherUsers);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};

export const updateProfilePhoto = async (req, res) => {
    try {
        const userId = req.id;

        if (!req.file) {
            return res.status(400).json({ message: "No file uploaded" });
        }

        // Construct the photo URL
        const profilePhotoUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;

        // Update user's profile photo
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { profilePhoto: profilePhotoUrl },
            { new: true }
        ).select("-password -createdAt -updatedAt -__v");

        if (!updatedUser) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json({
            message: "Profile photo updated successfully",
            user: {
                _id: updatedUser._id,
                fullName: updatedUser.fullName,
                userName: updatedUser.userName,
                profilePhoto: updatedUser.profilePhoto
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};
