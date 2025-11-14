// app/api/socket.io/route.ts
// This tells Next.js to not handle this route
export const dynamic = "force-dynamic";

export async function GET() {
  return new Response("Socket.IO endpoint - handled by custom server", {
    status: 200,
  });
}

export async function POST() {
  return new Response("Socket.IO endpoint - handled by custom server", {
    status: 200,
  });
}
