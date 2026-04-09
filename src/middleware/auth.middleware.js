import userModel from '../models/user.model.js';
import jwt from 'jsonwebtoken';
import tokenBlackListModel from '../models/blacklist.model.js';  

async function authMiddleware(req, res, next){
    // Get token from cookies or Authorization header
    //req.cookies.token is used to access the token stored in cookies, while req.headers.authorization is used to access the token sent in the Authorization header. The split(" ")[1] part is used to extract the token from the "Bearer <token>" format commonly used in Authorization headers.
    // Optional chaining (?.) allows safe access to nested properties without throwing errors if an intermediate value is null or undefined.
    const token = req.cookies.token || req.headers.authorization?.split(" ")[1];
    if (!token){
        return res.status(401).json({
            message:"Unauthorized. No token provided."
        })
    }

    const isBlackListed = await tokenBlackListModel.findOne({token});
    if(isBlackListed){
        return res.status(401).json({
            message:"Unauthorized. Token is blacklisted."
        })
    }


    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
        const user = await userModel.findById(decoded.userId);
        req.user = user;
        return next();
    }

    catch(err){
        return res.status(401).json({
            message:"Unauthorized. Invalid token."
        })
    }
}


async function authSystemUserMiddleware(req, res, next){
    const token = req.cookies.token || req.headers.authorization?.split(" ")[1];
    if (!token){
        return res.status(401).json({
            message:"Unauthorized. No token provided."
        })
    }

    const isBlackListed = await tokenBlackListModel.findOne({token});
    if(isBlackListed){
        return res.status(401).json({
            message:"Unauthorized. Token is blacklisted."
        })
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
        const user = await userModel.findById(decoded.userId).select("+systemUser");
        if(!user.systemUser){
            return res.status(403).json({
                message:"Forbidden. You do not have permission to access this resource."
            })
        }

        req.user = user;
        return next();
    }

    catch(err){
        return res.status(401).json({
            message:"Unauthorized. Invalid token."
        })
    }
}

export {authMiddleware, authSystemUserMiddleware};