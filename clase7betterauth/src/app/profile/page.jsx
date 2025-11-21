"use client";
import { useSession } from "@/lib/auth-client";
import React from "react";
import { Button } from "@/components/ui/button";
import { signOut } from "@/lib/auth-client";
import { useRouter } from "next/navigation";

const Page = () => {
  const { data: session } = useSession();
  const router = useRouter();

  async function handleLogout() {
    await signOut();
    router.push("/auth/login");
  }

  if (!session) {
    return (
      <div>
        No estás logueado
        <Button onClick={() => router.push("/auth/login")}>Login</Button>
      </div>
    );
  }
  return (
    <>
      <pre className="">{JSON.stringify(session, null, 2)}</pre>
      <Button onClick={handleLogout}>logout</Button>
    </>
  );
};

export default Page;
