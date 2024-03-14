import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { cookies } from 'next/headers'
 

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
    const cookieStore = cookies()
    const auth = cookieStore.get('auth')?.value
    
    if (!auth && !request.nextUrl.pathname.startsWith('/login')) {
        return NextResponse.redirect(new URL('/login', request.url))
    }
    
    return NextResponse.next();
 

}

export const config = {
    matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)']
  };