const { UserModel } = require("../models/userModel.js");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const getDataUri = require("../config/datauri.js");
const cloudinary = require("../config/cloudinary.js");


//alternative solution
/*import multer from 'multer';
import { Readable } from 'stream';
import cloudinary from 'cloudinary';
// Configure multer for memory storage
const storage = multer.memoryStorage();
const upload = multer({ storage }).single('file');*/

dotenv.config();

const register = async (req, res) => {
    try {
        const { fullname, email, phoneNumber, password, role } = req.body;
        const file = req.file;

        if (!fullname || !email || !phoneNumber || !password || !role || !file) {
            return res.status(400).json({
                message: "Something is missing",
                success: false
            })
        };

        const fileUri = getDataUri(file);
        const cloudResponse = await cloudinary.uploader.upload(fileUri.content, { resource_type: 'raw' });

        const user = await UserModel.findOne({ email });
        if (user) {
            return res.status(400).json({
                message: "User already exist with this email address",
                success: false
            })
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        await UserModel.create({
            fullname,
            email,
            phoneNumber,
            password: hashedPassword,
            role,
            profile: {
                profilePhoto: cloudResponse.secure_url
            }
        });

        return res.status(200).json({
            message: "Account created successfully",
            success: true
        })
    }
    catch (err) {
        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        })
    }
}

const login = async (req, res) => {
    try {
        const { email, password, role } = req.body;

        if (!email || !password || !role) {
            return res.status(400).json({
                message: "Something is missing",
                success: false
            })
        }

        let user = await UserModel.findOne({ email });
        if (!user) {
            return res.status(400).json({
                message: "Incorrect Email or Password.",
                success: false
            })
        }

        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if (!isPasswordMatch) {
            return res.status(400).json({
                message: "Incorrect Email or Password.",
                success: false
            })
        };
        // check role is correct or not
        if (role != user.role) {
            return res.status(400).json({
                message: "Account does not exist with the current role.",
                success: false
            })
        };

        const tokenData = {
            userId: user._id
        }
        // generating token
        const token = await jwt.sign(tokenData, process.env.SECRET_KEY, { expiresIn: '1d' });

        user = {
            _id: user._id,
            fullname: user.fullname,
            email: user.email,
            phoneNumber: user.phoneNumber,
            role: user.role,
            profile: user.profile
        }

        return res.status(200).cookie("token", token, { maxAge: 1 * 24 * 60 * 60 * 1000, httpsOnly: true, sameSite: 'strict' }).json({
            message: `Welcome back ${user.fullname}`,
            user,
            success: true
        })
    }
    catch (err) {
        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        })
    }
}

const logout = async (req, res) => {
    try {
        return res.status(200).cookie("token", "", { maxAge: 0 }).json({
            message: "Logged out succesfully.",
            success: true
        })
    }
    catch (err) {
        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        })
    }
}


const updateProfile = async (req, res) => {
    try {
        const { fullname, email, phoneNumber, bio, skills, resume_link } = req.body;

        //const file = req.file;

        //cloudinary implementation here
        //const fileUri = getDataUri(file);
        //const cloudResponse = await cloudinary.uploader.upload(fileUri.content, { resource_type: "raw" });



        let skillsArray;
        if (skills) {
            skillsArray = skills.split(",");
        }
        const userId = req.id; // comes from middleware authentication
        let user = await UserModel.findById(userId);

        if (!user) {
            return res.status(400).json({
                message: "User not found",
                success: false
            })
        }
        // updating the data
        if (fullname) user.fullname = fullname
        if (email) user.email = email
        if (phoneNumber) user.phoneNumber = phoneNumber
        if (bio) user.profile.bio = bio
        if (skillsArray) user.profile.skills = skillsArray
        if (resume_link) user.profile.resume_link = resume_link

        // resume comes 
        /*if (cloudResponse) {
            user.profile.resume = cloudResponse.secure_url // save the cloudinary url
            user.profile.resumeOriginalName = file.originalname // Save the original file name
        }*/
        await user.save();

        user = {
            _id: user._id,
            fullname: user.fullname,
            email: user.email,
            phoneNumber: user.phoneNumber,
            role: user.role,
            profile: user.profile
        }

        return res.status(200).json({
            message: "Profile updated successfully.",
            user,
            success: true
        })

    }
    catch (err) {
        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }

}

module.exports = { register , login , logout, updateProfile };


//alternative solution
/*export const updateProfile = async (req, res) => {
    upload(req, res, async (err) => {
        if (err) {
            return res.status(500).json({
                success: false,
                message: "File upload failed.",
            });
        }

        try {
            const { fullname, email, phoneNumber, bio, skills } = req.body;
            const userId = req.id; // comes from middleware authentication
            let user = await UserModel.findById(userId);

            if (!user) {
                return res.status(400).json({
                    message: "User not found",
                    success: false,
                });
            }

            // Update user data
            if (fullname) user.fullname = fullname;
            if (email) user.email = email;
            if (phoneNumber) user.phoneNumber = phoneNumber;
            if (bio) user.profile.bio = bio;
            if (skills) user.profile.skills = skills.split(',');

            // Handle file upload if present
            if (req.file) {
                const fileBuffer = req.file.buffer; // File is in memory
                const fileStream = Readable.from(fileBuffer); // Convert buffer to stream

                // Upload the file stream to Cloudinary
                const cloudResponse = await new Promise((resolve, reject) => {
                    const uploadStream = cloudinary.v2.uploader.upload_stream(
                        { resource_type: 'raw' },
                        (error, result) => {
                            if (error) reject(error);
                            resolve(result);
                        }
                    );
                    fileStream.pipe(uploadStream); // Pipe the stream to Cloudinary
                });

                // Save Cloudinary data to user profile
                if (cloudResponse) {
                    user.profile.resume = cloudResponse.secure_url; // Save the Cloudinary URL
                    user.profile.resumeOriginalName = req.file.originalname; // Save the original file name
                }
            }

            // Save the updated user
            await user.save();

            // Prepare response user object
            const responseUser = {
                _id: user._id,
                fullname: user.fullname,
                email: user.email,
                phoneNumber: user.phoneNumber,
                role: user.role,
                profile: user.profile,
            };

            return res.status(200).json({
                message: "Profile updated successfully.",
                user: responseUser,
                success: true,
            });
        } catch (error) {
            console.error("Error updating profile:", error.message);
            return res.status(500).json({
                success: false,
                message: "Internal Server Error",
            });
        }
    });
};*/
