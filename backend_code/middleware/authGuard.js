// const jwt = require('jsonwebtoken');
// const User = require('../models/userModel');

// const authGuard = (req, res, next) => {
//     console.log(req.headers);

//     const authHeader = req.headers.authorization;

//     if (!authHeader) {
//         return res.status(400).json({
//             success: false,
//             message: "Authorization header not found!"
//         });
//     }

//     const token = authHeader.split(' ')[1];

//     if (!token || token === '') {
//         return res.status(403).json({
//             success: false,
//             message: "Token is missing"
//         });
//     }

//     try {
//         const decodedUser = jwt.verify(token, process.env.JWT_SECRET);
//         const user = User.findById(decodedUser.id);

//         if (!user || !user.activeTokens.some((activeToken) => activeToken.token === token)) {
//             return res.status(401).json({ message: 'Invalid or expired token.' });
//         }
//         req.user = decodedUser;
//         next();
//     } catch (error) {
//         console.log(error);
//         res.status(400).json({
//             success: false,
//             message: "Not Authenticated!"
//         });
//     }
// };

// const adminGuard = (req, res, next) => {
//     console.log(req.headers);

//     const authHeader = req.headers.authorization;

//     if (!authHeader) {
//         return res.status(400).json({
//             success: false,
//             message: "Authorization header not found!"
//         });
//     }

//     const token = authHeader.split(' ')[1];

//     if (!token || token === '') {
//         return res.status(400).json({
//             success: false,
//             message: "Token is missing"
//         });
//     }

//     try {
//         const decodedUser = jwt.verify(token, process.env.JWT_SECRET);
//         req.user = decodedUser;

//         if (!req.user.isAdmin) {
//             return res.status(400).json({
//                 success: false,
//                 message: "Permission denied"
//             });
//         }

//         next();
//     } catch (error) {
//         console.log(error);
//         res.status(400).json({
//             success: false,
//             message: "Not Authenticated!"
//         });
//     }
// };

const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const logger = require('../utils/logger');

const authGuard = async (req, res, next) => {
    console.log(req.headers);

    const authHeader = req.headers.authorization;

    if (!authHeader) {
        logger.warn(`Unauthorized access attempt from IP: ${req.ip}`);
        return res.status(400).json({
            success: false,
            message: "Authorization header not found!"
        });
    }

    const token = authHeader.split(' ')[1];

    if (!token || token === '') {
        logger.warn(`Token missing from request IP: ${req.ip}`);
        return res.status(403).json({
            success: false,
            message: "Token is missing"
        });
    }

    try {
        const decodedUser = jwt.verify(token, process.env.JWT_SECRET);

        // Fetch user details from the database
        const user = await User.findById(decodedUser.id);

        if (!user || !user.activeTokens.some((activeToken) => activeToken.token === token)) {
            logger.warn(`Invalid token attempt by user ID: ${decodedUser.id}`);
            return res.status(401).json({
                success: false,
                message: 'Invalid or expired token.'
            });
        }

        req.user = user; // Attach the user object to the request
        next();
    } catch (error) {
        console.error(error);
        logger.error(`Authentication error: ${error.message}`);
        res.status(400).json({
            success: false,
            message: "Not Authenticated!"
        });
    }
};

const adminGuard = async (req, res, next) => {
    console.log(req.headers);

    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(400).json({
            success: false,
            message: "Authorization header not found!"
        });
    }

    const token = authHeader.split(' ')[1];

    if (!token || token === '') {
        return res.status(400).json({
            success: false,
            message: "Token is missing"
        });
    }

    try {
        const decodedUser = jwt.verify(token, process.env.JWT_SECRET);

        // Fetch user details from the database
        const user = await User.findById(decodedUser.id);

        if (!user || !user.isAdmin) {
            logger.warn(`Unauthorized admin access attempt by user ID: ${decodedUser.id}`);
            return res.status(403).json({
                success: false,
                message: "Permission denied"
            });
        }

        req.user = user;
        logger.info(`Admin authenticated: ${user.email}`);
        next();
    } catch (error) {
        console.error(error);
        logger.error(`Admin authentication error: ${error.message}`);
        res.status(400).json({
            success: false,
            message: "Not Authenticated!"
        });
    }
};


module.exports = {
    authGuard,
    adminGuard,
};
