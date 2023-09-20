import { NextApiRequest } from "next";

export default function getIp(req: NextApiRequest): string | undefined {
  const forwardedFor = req.headers["x-forwarded-for"];
  if (typeof forwardedFor === "string") {
    const [ip] = forwardedFor.split(",", 1);
    if (ip) return ip.trim();
  }
  return req.socket.remoteAddress;
}
