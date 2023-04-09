import { NextApiRequest, NextApiResponse } from "next";
import fs from "fs";
import path from "path";

const logsDir = path.resolve("logs");
const logFile = path.join(logsDir, "messages.log");

// Helper function to ensure logs directory exists
function ensureLogsDirExists() {
  if (!fs.existsSync(logsDir)) {
    fs.mkdirSync(logsDir, { recursive: true });
  }
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    try {
      ensureLogsDirExists(); // Make sure the logs directory exists

      const message = req.body.message;
      const category = req.body.category;
      const role = req.body.role;

      const timestamp = new Date().toISOString();
      const logEntry = `${timestamp} - ${category} - ${role} - ${message}\n`;

      fs.appendFileSync(logFile, logEntry, { encoding: "utf8" });

      res.status(200).json({ status: "success" });
    } catch (error: any) {
      res.status(500).json({ status: "error", message: error.message });
    }
  } else {
    res.status(405).json({ status: "error", message: "Method not allowed" });
  }
}
