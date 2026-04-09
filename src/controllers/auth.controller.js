import userModel from '../models/user.model.js';
import jwt from 'jsonwebtoken';
import { sendRegistrationEmail } from '../services/email.service.js';
import tokenBlackListModel from '../models/blacklist.model.js';

/** 
 * @route POST /api/auth/register
 * @description Register a new user
 */

async function userRegisterController(req, res) {
    const {email, name, password} = req.body;
    const ifExists = await userModel.findOne({email: email});

    if(ifExists) {
        return res.status(400).json({
            message: "Email already exists. Please use a different email address.",
            status: "error"});
    }  
    
    const user = await userModel.create({
        email, name, password
    });

    const token = jwt.sign({userId: user._id}, process.env.JWT_SECRET_KEY, { expiresIn: "3d" });

    res.cookie("token", token);

    res.status(201).json({
        user: {
            _id: user._id,
            email: user.email,
            name: user.name
        },
        token
    });

    await sendRegistrationEmail(user.email, user.name);
}

/**
 * @route POST /api/auth/login
 * @description Login a user
 */

async function userLoginController(req, res) {
    const {email, password} = req.body;
    const user = await userModel.findOne({email}).select("+password");

    if(!user) {
        return res.status(401).json({
            message: "Invalid email or password"
        })
    }

    const isValidPassword = await user.comparePassword(password);

    if(!isValidPassword) {
        return res.status(401).json({
            message: "Invalid email or password"
        })
    }

    const token = jwt.sign({userId: user._id}, process.env.JWT_SECRET_KEY, { expiresIn: "3d" });

    res.cookie("token", token);

    res.status(201).json({
        user: {
            _id: user._id,
            email: user.email,
            name: user.name
        },
        token
    });
}

async function userLogoutController(req, res){
    const token = req.cookies.token || req.headers.authorization?.split(" ")[1];

    if (!token){
        return res.status(400).json({
            message: "No token provided"
        })
    }

    await tokenBlackListModel.create({
        token: token
    });

    res.clearCookie("token");

    res.status(200).json({
        message: "Logged out successfully"
    });

}

export {userRegisterController, userLoginController, userLogoutController};