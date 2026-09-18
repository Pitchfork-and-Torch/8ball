import { createFileRoute } from "@tanstack/react-router";
import { EightBall } from "@/components/eight-ball";

export const Route = createFileRoute("/")({
  component: Home,
});

function Home() {
  return <EightBall />;
}
