import { prisma } from "@/lib/db";

export async function GET(){
    try {
        const data = await prisma.uploadedFile.findMany();

        if(!data){
            return Response.json({message:"No data"},{status:404});
        }

        return Response.json(data);
    } catch (error) {
        console.log(error)
    }
}