// Middleware => Middleware is execute in between and transfer the request to other part where it need to be go.

import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server';

//user jis bhi url pr request bheje ga phle vo is middleware se pass hogi kyoki humne apni layout.ts me puri file ko ClerkProvider me wrap kr rhka h.

// humne apni puri application ko clerkProvider me wrap kiya h jis k karan hume kisi bhi route pr jaana h toh hume phle clerk se authenticate krvana hoga.
// createRouteMatcher ki help se hum un routes ko specify kr skte h jin pr hum bina authentication k jaa skte h.
// koi bhi user bina authentication k home page ko access kr skta h aur us page pr available videos ko bhi bina authentication k dekh skta h same exactise like youtube.
const isPublicRoute = createRouteMatcher([
    "/sign-in",
    "/sign-up",
    "/",
    "/home"
])
// in api pr hum bina authentication k request bhej skte h.
// hum 1 api bnaye ge home page pr videos access krne k liye aur home page ko user bina signin k bhi access kr skta h toh isliye hum user ko videos bhi bina signin kiye dekhage isliye hume is route ko bhi public bnana hoga.
const isPublicApiRoute = createRouteMatcher([
    "/api/videos"
]) 

//
export default clerkMiddleware((auth, req) => {
    // yadi user signin h toh auth() function userId provide kre ga.
    const { userId } = auth();
    const currentUrl = new URL(req.url);

    // hum iski help se check krege ki user home page ko access krna chahta h ya aur kisi page ko access krna chahta h.
    const isAcceptingDashboard = currentUrl.pathname === "/home";
    const isApiRequest = currentUrl.pathname.startsWith("/api");

    // yadi user logged-in h aur vo user isPublicRoute array me jo routes h unko access krna chahta h except the home page toh hum ushe home page pr redirect krdege.
    // for ex => yadi user logged-in aur vo sign-in page ko access krna chahta h toh hum ushe signin page ki jagah home page pr bhej dege. Aur yadi vo home page ko access krna chahta h toh ye condition !isAcceptingDashboard false ho jaiye gi aur if block execute nhi hoga aur vo home page pr chla jaiye ga.
    if(userId && isPublicRoute(req) && !isAcceptingDashboard) {
        return NextResponse.redirect(new URL("/home", req.url))
    }
    // not logged in
    if(!userId){
        // If user is not logged in and trying to access a protected route.
        // yadi user logged-in nahi h aur vo aisa koi route access krna chahta h jo ki public route nhi h or we can say that jis route ko user bina login-in k access nhi kr skta kyoki humne ushe createRouteMatcher ki help se array me nhi daala h toh hum user ko signin page pr redirect krdege.
        if(!isPublicRoute(req) && !isPublicApiRoute(req)){
            return NextResponse.redirect(new URL("/sign-in", req.url))
        }

        // If the request is for a protected API and the user is not logged in.
        // yadi user aisi api route ki request kr rha h jo ki public nhi h toh bhi hum user ko signin page pr redirect kr dege.
        if(isApiRequest && !isPublicApiRoute(req)){
            return NextResponse.redirect(new URL("/sign-in", req.url))
        }
    }
    return NextResponse.next();
})

export const config = {
    // matcher simply means that middleware needs to execute on all these routes.
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
}