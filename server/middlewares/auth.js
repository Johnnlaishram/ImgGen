
import jwt from 'jsonwebtoken'
 

const userAuth = async (req, res, next) => {
  const { token } = req.headers;
  if (!token) {
    return res.json({ success: false, message: "Not authorized, login again" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; 
    next();
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

export default userAuth;
