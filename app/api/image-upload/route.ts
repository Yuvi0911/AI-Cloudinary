import { NextRequest, NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';
import { auth } from '@clerk/nextjs/server';


    // Configuration
    cloudinary.config({ 
        cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME, 
        api_key: process.env.CLOUDINARY_API_KEY, 
        api_secret: process.env.CLOUDINARY_API_SECRET 
    });

    interface CloudinaryUploadResult {
        public_id: string;
        [key: string]: any
    }

export async function POST(request: NextRequest){
    console.log("0");

    const { userId } = auth();
    console.log("1");

    if(!userId){
        return NextResponse.json({
            error: "Unauthorized"
        },{
            status: 401
        })
    }
    console.log("2");

    try {
        const formData = await request.formData();

    console.log("3");


        const file = formData.get("file") as File | null;
    console.log("4");


        if(!file){
            return NextResponse.json({
                error: "File not found"
            },{
                status: 404
            })
        }
    console.log("5");


        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

    console.log("6");

        const result = await new Promise<CloudinaryUploadResult>((resolve, reject) => {
            // upload_stram ki help se hum kisi bhi type ka data upload kr skte h cloudinary me.
            const uploadStream = cloudinary.uploader.upload_stream(
                // next-cloudinary-uploadsis folder me file upload hogi.
                {folder: "next-cloudinary-uploads"},
                (error, result) => {
                    if(error) reject(error);
                    else resolve(result as CloudinaryUploadResult)
                }
            )
            uploadStream.end(buffer)
        })
    console.log("7");


        return NextResponse.json({
            publicId: result.public_id
        },{
            status: 200
        })
    } catch (error) {
        console.log("Upload image failed", error);
        return NextResponse.json({
            error: "Upload image failed"
        },{
            status: 500
        })
    }
}