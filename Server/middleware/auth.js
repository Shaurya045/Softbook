import jwt from "jsonwebtoken";

const auth = async (req, res, next) => {
  try {
    // Accept token from headers['authorization'] as "Bearer <token>" or from headers['token']
    let token = req.headers.authorization
      ? req.headers.authorization.split(" ")[1]
      : req.headers.token;

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Not Authorized. Please login again.",
      });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_KEY);
    // console.log(token, decoded);

    // Attach library id (admin's id) to request for downstream use
    req.libraryId = decoded.id;
    if (!req.body) req.body = {};
    req.body.libraryId = decoded.id; // optional

    next();
  } catch (error) {
    console.log(error);
    res.status(401).json({
      success: false,
      message: "Invalid or expired token. Please login again.",
    });
  }
};

export default auth;
