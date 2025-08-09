import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  try {
    await req.json();
  } catch {
    return Response.json({ error: "Invalid JSON payload" }, { status: 400 });
  }
  return Response.json({ status: "ok", issues: [] });
}


