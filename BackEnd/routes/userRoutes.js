const express = require("express");
const { login, logout, register, updateProfile } = require("../controller/userController.js");
const isAuthenticated = require("../middlewares/isAuthenticated.js");
const { singleUpload } = require("../middlewares/multer.js");


const router = express.Router();

router.route("/register").post(singleUpload ,register);

router.route("/login").post(login);

router.route("/logout").get(logout);

router.route("/profile/update").post(isAuthenticated,  singleUpload, updateProfile);

module.exports = router;

