import { NextResponse } from "next/server";
import { withAuth } from "@/lib/auth-guard";
import prisma from "@/lib/prisma";

async function getUsersHandler(request) {
  const users = await prisma.user.findMany();
  return NextResponse.json(users);
}

export const GET = withAuth(getUsersHandler);
