import jwt from "jsonwebtoken";

export function auth(required = true) {
  return function authMiddleware(req, res, next) {
    const header = req.headers.authorization || "";
    const token = header.startsWith("Bearer ") ? header.split(" ")[1] : req.cookies?.token;

    if (!token) {
      if (required) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      req.user = null;
      return next();
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = { id: decoded.id, role: decoded.role, isSuperAdmin: decoded.isSuperAdmin || false, privileges: decoded.privileges || [] };
      return next();
    } catch (err) {
      return res.status(401).json({ message: "Invalid token" });
    }
  };
}

export function requireRole(role) {
  return function roleGuard(req, res, next) {
    if (!req.user || req.user.role !== role) {
      return res.status(403).json({ message: "Forbidden" });
    }
    return next();
  };
}
