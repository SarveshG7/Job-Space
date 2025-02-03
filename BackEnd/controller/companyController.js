const CompanyModel = require("../models/companyModel.js");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const getDataUri = require("../config/datauri.js");
const cloudinary = require("../config/cloudinary.js");



dotenv.config();

const registerCompany = async (req, res) => {
    try {
        const { companyName } = req.body;
        if (!companyName) {
            return res.status(400).json({
                message: "Company name is required.",
                success: false
            })
        };
        let company = await CompanyModel.findOne({ name: companyName });
        if (company) {
            return res.status(400).json({
                message: "You cannot register same company.",
                success: false
            })
        };
        company = await CompanyModel.create({
            name: companyName,
            userId: req.id
        });

        return res.status(201).json({
            message: "Company registered successfully",
            company,
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

const getCompany = async (req, res) => {
    try {
        const userId = req.id; // this is a logged in user id
        const companies = await CompanyModel.find({ userId });
        if (!companies) {
            return res.status(404).json({
                messages: "Companies not found",
                success: false
            })
        }

        return res.status(200).json({
            companies,
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

//get company by id
const getCompanyById = async (req, res) => {
    try {
        const companyId = req.params.id;
        const company = await CompanyModel.findById(companyId);
        if (!company) {
            return res.status(404).json({
                messages: "Company not found",
                success: false
            })
        }
        return res.status(200).json({
            company,
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

const updateCompany = async (req, res) => {
    try {
        const { name, description, website, location } = req.body;
        const file = req.file;
        let logo;

        //cloudinary here
        if (file) {
            const fileUri = getDataUri(file);
            const cloudResponse = await cloudinary.uploader.upload(fileUri.content);
            logo = cloudResponse.secure_url;
        }

        const updateData = { name, description, website, location};
        if (logo) {
            updateData.logo = logo;
        }

        const company = await CompanyModel.findByIdAndUpdate(req.params.id, updateData, { new: true });
        if (!company) {
            return res.status(404).json({
                message: "Company not found",
                success: false
            })
        }

        return res.status(200).json({
            message: "Company information updated.",
            success: true
        });
    }
    catch (err) {
        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        })
    }
}

module.exports = { registerCompany , getCompany , getCompanyById, updateCompany };