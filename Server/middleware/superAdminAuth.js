import jwt from "jsonwebtoken";

const superAdminAuth = async (req, res, next) => {
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

    // Check if the decoded token contains the correct super admin email
    if (
      !decoded ||
      decoded !== process.env.SUPER_ADMIN_EMAIL + process.env.SUPER_ADMIN_PASSWORD
    ) {
      return res.status(403).json({
        success: false,
        message: "Not Authorized. SuperAdmin access required.",
      });
    }

    // Optionally attach super admin info to request
    req.superAdmin = { email: decoded.email };

    next();
  } catch (error) {
    console.log(error);
    res.status(401).json({
      success: false,
      message: "Invalid or expired token. Please login again.",
    });
  }
};

export default superAdminAuth;
