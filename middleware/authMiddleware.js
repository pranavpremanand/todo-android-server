const jwt = require("jsonwebtoken");

exports.AuthMiddleware = (req, res, next) => {
  try {
    let data = req.headers["authorization"];
    const token = data.split(" ")[1];
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
      if (err) {
        return res.status(401).json({ message: "Auth failed", success: false });
      } else {
        const dateNow = new Date();
        if (decoded.exp < dateNow.getTime() / 1000) {
          return res
            .status(401)
            .json({ message: "Token has expired", success: false });
        }
        req.userId = decoded.userId;
        next();
      }
    });
  } catch (err) {
    return res.status(401).json({
      message: "Auth failed",
      success: false,
    });
  }
};
