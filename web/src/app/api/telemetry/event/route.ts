import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { event } = body ?? {};
    if (!event || typeof event !== "string") {
      return Response.json({ error: "Missing event" }, { status: 400 });
    }
    return Response.json({ status: "accepted" });
  } catch {
    return Response.json({ error: "Invalid JSON payload" }, { status: 400 });
  }
}


