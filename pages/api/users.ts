

import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const api = process.env.NEXT_PUBLIC_API_BASE_URL;

  if (!api) {
    console.error("API BASE URL IS MISSING");
    return res.status(500).json({ message: "API base not configured" });
  }

  const email = req.query.email as string | undefined;

  let url = `${api}/users`;
  if (email) {
    url += `?email=${encodeURIComponent(email)}`;
  }

  try {
    const response = await fetch(url, {
      method: req.method,
      headers: { "Content-Type": "application/json" },
      body:
        req.method === "GET" || req.method === "DELETE"
          ? undefined
          : JSON.stringify(req.body),
    });

    const data = await response.json();
    return res.status(response.status).json(data);
  } catch (err) {
    console.error("FETCH FAILED:", err);
    return res.status(502).json({ message: "Internal server error" });
  }
}
