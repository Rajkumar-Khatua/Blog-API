// // authMiddleware.js
// const jwtUtils = require("../utils/jwtUtils");

// const authMiddleware = (req, res, next) => {
//   // Get token from header
//   const token = req.header("x-auth-token");

//   // Check if token is present
//   if (!token) {
//     return res
//       .status(401)
//       .json({ success: false, error: "No token, authorization denied" });
//   }

//   try {
//     // Verify token
//     const decoded = jwtUtils.verifyToken(token);

//     // Log the decoded token
// console.log("Decoded Token:", decoded);

//     // Set user in request for further use
//     req.user = decoded.user;
//     next();
//   } catch (err) {
//     // Log the error
//     console.error(err);
//     res.status(401).json({ success: false, error: "Token is not valid" });
//   }
// };

// module.exports = authMiddleware;

// authMiddleware.js
const jwtUtils = require("../utils/jwtUtils");

const authMiddleware = (req, res, next) => {
  // Get token from header
  const token = req.header("x-auth-token");

  // Check if token is present
  if (!token) {
    return res
      .status(401)
      .json({ success: false, error: "No token, authorization denied" });
  }

  try {
    // Verify token
    const decoded = jwtUtils.verifyToken(token);
    console.log("Decoded Token:", decoded);

    // Set user in request for further use
    req.user = decoded.userId; // Assuming your decoded token has a userId field
    next();
  } catch (err) {
    res.status(401).json({ success: false, error: "Token is not valid" });
  }
};

module.exports = authMiddleware;
