import type { NextApiRequest, NextApiResponse } from "next";

const BASE = "https://imkkjoe9if.execute-api.us-east-1.amazonaws.com/prod";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { email } = req.query;

  const r = await fetch(`${BASE}/users/${email}`, {
    method: req.method,
    headers: { "Content-Type": "application/json" },
    body: req.method === "PUT" ? JSON.stringify(req.body) : undefined,
  });

  const text = await r.text();
  res.status(r.status).send(text);
}