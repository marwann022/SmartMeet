import jwt from "jsonwebtoken";

const generateToken = (id, sessionId = null) => {
    const payload = { id };
    if (sessionId) payload.sessionId = sessionId;
    return jwt.sign(payload,
        process.env.JWT_SECRET, {
            expiresIn: process.env.JWT_EXPIRE
        }
    );
};

export default generateToken;