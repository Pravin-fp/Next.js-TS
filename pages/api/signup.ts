
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  console.log("API BASE URL:", process.env.NEXT_PUBLIC_API_BASE_URL);

  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const apiBase = process.env.NEXT_PUBLIC_API_BASE_URL;

  if (!apiBase) {
    return res.status(500).json({
      message: "API base URL not configured",
    });
  }

  const response = await fetch(`${apiBase}/auth/signup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(req.body),
  });

  const data = await response.json();
  return res.status(response.status).json(data);
}