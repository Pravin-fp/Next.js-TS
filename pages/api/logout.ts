import type { NextApiRequest, NextApiResponse } from "next";
import cookie from "cookie";

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  res.setHeader(
    "Set-Cookie",
    cookie.serialize("token", "", {
      httpOnly: true,
      expires: new Date(0),
      path: "/",
    })
  );

  res.writeHead(302, { Location: "/login" });
  res.end();
}
