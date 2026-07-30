import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { headers } from "next/headers";

export async function GET() {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return Response.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    const data = await prisma.uploadedFile.findMany({
      where: {
        userId: session.user.id,
      },
    });

    return Response.json(data);
  } catch (error) {
    console.error(error);
    return Response.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}