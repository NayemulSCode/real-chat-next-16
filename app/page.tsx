// app/page.tsx
"use client";
import { Layout } from "@/components/layout";
import { useSession } from "next-auth/react";
// import { ChatContainer } from "@/components/chat/chat-container";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "loading") return; // Still loading
    if (!session) {
      router.push("/signin");
    }
  }, [session, status, router]);

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  if (!session) {
    return null; // Will redirect
  }

  return (
    <Layout>
      <h1>Chat container</h1>
      {/* <ChatContainer /> */}
    </Layout>
  );
}
