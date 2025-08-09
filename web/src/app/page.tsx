import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function Home() {
  return (
    <main className="min-h-screen w-full flex items-center justify-center p-6">
      <Card className="max-w-md w-full">
        <CardHeader>
          <CardTitle>Bmad Donglao</CardTitle>
          <CardDescription>Shadcn/ui + Tailwind v4 smoke test</CardDescription>
        </CardHeader>
        <CardContent className="flex gap-3">
          <Button variant="default">Primary</Button>
          <Button variant="secondary">Secondary</Button>
        </CardContent>
      </Card>
    </main>
  );
}
