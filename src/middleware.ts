import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const IS_MAINTENANCE_MODE = false;

export function middleware(request: NextRequest) {
  if (IS_MAINTENANCE_MODE) {
    const url = request.nextUrl.pathname;

    // Allow access to API routes, static files, and favicon
    if (
      url.startsWith("/api") ||
      url.startsWith("/_next/static") ||
      url.startsWith("/_next/image") ||
      url === "/favicon.ico"
    ) {
      return NextResponse.next();
    }

    // Return maintenance page for all other routes
    const html = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Maintenance Mode - Autographer AI Photo Studio</title>
        <style>
          body {
            margin: 0;
            padding: 0;
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
            background: linear-gradient(135deg, #0f0f1a 0%, #1a1a2e 100%);
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', sans-serif;
          }
          .container {
            text-align: center;
            padding: 2rem;
            max-width: 600px;
          }
          h1 {
            color: #ffffff;
            font-size: 2.5rem;
            margin-bottom: 1rem;
            font-weight: 700;
          }
          p {
            color: #94a3b8;
            font-size: 1.25rem;
            margin: 0;
          }
          .icon {
            font-size: 4rem;
            margin-bottom: 1.5rem;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="icon">🔧</div>
          <h1>We are currently under maintenance</h1>
          <p>We will be back soon!</p>
        </div>
      </body>
      </html>
    `;

    return new NextResponse(html, {
      status: 503,
      headers: {
        "Content-Type": "text/html",
        "Retry-After": "3600",
      },
    });
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
