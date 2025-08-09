import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { agentId, commandId, args } = body ?? {};
    if (!agentId || !commandId) {
      return Response.json(
        { error: "Missing required fields: agentId, commandId" },
        { status: 400 }
      );
    }

    const wouldWritePaths = [
      `docs/out/${agentId}-${commandId}-${Date.now()}.json`,
      `.bmad-core/logs/${agentId}-${commandId}.log`,
    ];

    return Response.json({
      status: "dispatched",
      agentId,
      commandId,
      args: args ?? {},
      wouldWritePaths,
    });
  } catch {
    return Response.json({ error: "Invalid JSON payload" }, { status: 400 });
  }
}


