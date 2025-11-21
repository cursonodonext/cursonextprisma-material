"use client";
import { useAuth } from "@/contexts/AuthContext";

const Page = () => {
  const { data: session } = useAuth();
  return (
    <div>{session ? `Welcome, ${session.user.name}` : "Not logged in"}</div>
  );
};

export default Page;
