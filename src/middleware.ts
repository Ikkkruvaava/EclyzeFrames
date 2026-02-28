import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req: NextRequest) {
    // If the user tries to go to any page starting with /admin, we check for an auth token.
    // NextAuth automatically creates this JWT on successful login behind the scenes
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    const { pathname } = req.nextUrl;

    // Let them hit the login page, the auth endpoints, and skip static files
    if (
        pathname.startsWith('/admin/login') ||
        pathname.startsWith('/api/auth') ||
        pathname.startsWith('/_next') ||
        pathname.includes('.')
    ) {
        return NextResponse.next();
    }

    // If hitting admin section without a session token, redirect to the new login
    if (pathname.startsWith('/admin') || pathname.startsWith('/api/admin')) {
        if (!token) {
            const url = req.nextUrl.clone();
            url.pathname = '/admin/login';
            url.searchParams.set('callbackUrl', pathname);
            return NextResponse.redirect(url);
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/admin/:path*', '/api/admin/:path*'],
};
