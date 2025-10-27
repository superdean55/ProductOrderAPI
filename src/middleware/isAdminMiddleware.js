export const isAdminMiddleware = (req, res, next) => {
  try {
    console.log('❌❌❌ user_role: ',req.user);
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    
    if (req.user.role !== "ADMIN") {
      return res.status(403).json({ message: "Access denied: Admins only" });
    }

    next();
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
