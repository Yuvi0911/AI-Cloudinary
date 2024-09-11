// humne is application me prisma ki help se neondb ko connect kiya h. 
// Humara saara data prisma ki help se NeonDb me jaiye ga.
// prisma hume bahut se database se connect krne ki functionality provide krta h jaise ki hum mongodb, postgressSql, neondb etc database se connect kr skte h.
// prisma ki help se hum relational or non-relational kisi bhi database se connect kr skte h.

import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

// prisma basically mongoose ki trh h, jaise ki hum mongoose ki help se keval mongodb database me data pr CRUD operations lga skte the lekin prisma ki help se hum kisi bhi database me crud operation perform kr skte h.

// step-1) npx prisma init => hum prisma ko install krege. ye hume ek prisma naam ka folder dega jisme schema.prisma file hogi.
// step-2) hum us file me humare database ka naam likhe ge aur connecton url dege jo ki humne .env file me store ki h.
// step-3) hum us file me apne models bnaye ge jo hume database me show krvane h jaise ki hum mongoose ki help se schema bnate the mongodb me show krvane k liye. In models me hum vo sbhi fields dege jo hume chaiye.
//  step -4) npx prisma migrate dev --name init => is command ki help se hum apne models ko database me bhej dege jis se us specific database me table(yadi vo relational db h) ya document(yadi vo non-relatonal db h) ban jaye ge.
// step-5) npm install @prisma/client => is command se humari application database se sync rhe gi, yadi hum application me change krege toh database me change ho jaye ga.
// Whenever you update your Prisma schema, you will have to update your database schema using either prisma migrate dev or prisma db push.

// prisma ki help se hum apni app ko kisi bhi database se connect kr skte.
// humne jis bhi database se connect kiya h usme hum data pr CRUD operations lga skte h prisma orm ki help se.


// humne PrismaClient ka ek instance bna liya h prisma. prisma humari app ko database se sync rkhe ga. prisma ki help se hum database se interact kr k data pr CRUD operations ya data ko manipulate kr skte h.
const prisma = new PrismaClient();

export async function GET(request: NextRequest){
    try {

        // PrismaClient ka syntax sbhi database k liye same rhe ga yadi humne neondb ki jagah mongodb use kiya hota toh bhi humara code ye hi rhta. Prisma apne aap specific databse k according code generate krta h aur database ko bhejta h.
        const videos = await prisma.video.findMany({
            orderBy: {createdAt: "desc"}
        })

        return NextResponse.json(videos);

    } catch (error) {
        return NextResponse.json({
            error: "Error fetching videos"
        },{
            status: 500
        })   
    }
    finally{
        await prisma.$disconnect();
    }
}