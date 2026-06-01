const jwt = require('jsonwebtoken');

const protect = (req, res, next) => {
  try {
    // 1. Get the token from the request headers
    const authHeader = req.headers.authorization;

    // 2. Check if the header exists and starts with "Bearer "
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'No token, access denied' });
    }

    // 3. Extract just the token part (remove "Bearer " prefix)
    const token = authHeader.split(' ')[1];

    // 4. Verify the token using our secret key
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 5. Attach the userId to the request so routes can use it
    req.userId = decoded.userId;

    // 6. Move on to the actual route
    next();

  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
  }
};

module.exports = protect;