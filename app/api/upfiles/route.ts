import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { headers } from "next/headers";

export async function GET(){
    try {
        const session = auth.api.getSession({
            headers: await headers(),
        })

        const id = session?.user?.id;
        const data = await prisma.uploadedFile.findMany({
            where: {
                userId: id,
            },
        });

        if(!data){
            return Response.json({message:"No data"},{status:404});
        }

        return Response.json(data);
    } catch (error) {
        console.log(error)
    }
}