import { AgentsSidebar } from "@/components/sidebar/AgentsSidebar";
import { AgentHeader } from "@/components/agent/AgentHeader";
import { ActionCard } from "@/components/action/ActionCard";
import { getAgentById, isAgentId } from "@/lib/agents";

type PageProps = { params: { id: string } };

export default function AgentPage({ params }: PageProps) {
  const idParam = Array.isArray(params?.id) ? params.id[0] : params?.id;
  const agent = isAgentId(idParam) ? getAgentById(idParam) : undefined;

  if (!agent) {
    return (
      <main className="min-h-screen flex">
        <AgentsSidebar />
        <section className="flex-1 p-6">
          <p>Agent not found.</p>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen flex">
      <AgentsSidebar selectedId={agent.id} />
      <section className="flex-1">
        <AgentHeader agent={agent} />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
          {agent.commands.map((cmd) => (
            <ActionCard key={cmd.id} command={cmd} />
          ))}
        </div>
      </section>
    </main>
  );
}


