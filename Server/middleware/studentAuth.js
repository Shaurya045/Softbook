import jwt from "jsonwebtoken";

const studentAuth = async (req, res, next) => {
  try {
    let token = req.headers.authorization
      ? req.headers.authorization.split(" ")[1]
      : req.headers.token;

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Not Authorized. Please login again.",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_KEY);
    req.studentId = decoded.id;
    if (!req.body) req.body = {};
    req.body.studentId = decoded.id;
    next();
  } catch (error) {
    console.log(error);
    res.status(401).json({
      success: false,
      message: "Invalid or expired token. Please login again.",
    });
  }
};

export default studentAuth; 