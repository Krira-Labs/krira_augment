import { ENV } from "../lib/env.js";

export const serviceAuthMiddleware = (req, res, next) => {
  if (!ENV.SERVICE_API_SECRET) {
    return res.status(500).json({ message: "Service secret is not configured" });
  }

  const token = req.headers["x-service-key"];
  if (!token || token !== ENV.SERVICE_API_SECRET) {
    return res.status(403).json({ message: "Unauthorized service request" });
  }

  return next();
};
