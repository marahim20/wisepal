import type { NextApiRequest, NextApiResponse } from "next";
import fs from "fs/promises";
import path from "path";

// This Set will store unique IP addresses
const uniqueIPs: Set<string> = new Set();

// Function to write the unique IP count to a log file
async function writeLogToFile(ip: string, uniqueIPCount: number) {
  const logEntry = `${new Date().toISOString()} - New unique IP: ${ip} - Total unique IPs: ${uniqueIPCount}\n`;
  const logFilePath = path.join(process.cwd(), "/logs/ip-logs.log");

  try {
    // Check if the log file exists
    await fs.access(logFilePath);

    // If it exists, append the log entry
    await fs.appendFile(logFilePath, logEntry);
  } catch (error: any) {
    if (error.code === "ENOENT") {
      // If the log file does not exist, create it and write the log entry
      await fs.writeFile(logFilePath, logEntry);
    } else {
      console.error("Error writing to log file:", error);
    }
  }
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Get the IP address from the request headers
  const ip = req.headers["x-real-ip"] || req.connection.remoteAddress;

  // Check if the IP address is already in the Set
  const isNewIP = !uniqueIPs.has(ip as string);

  // Add the IP address to the Set
  uniqueIPs.add(ip as string);

  // If it's a new IP, write it to the log file
  if (isNewIP) {
    await writeLogToFile(ip as string, uniqueIPs.size);
  }

  // Send the response
  res.status(200).json({ uniqueIPCount: uniqueIPs.size });
}
