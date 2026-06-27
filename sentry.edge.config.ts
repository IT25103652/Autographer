// Sentry edge/middleware SDK configuration
// Enabled when SENTRY_DSN is set in production environment variables

import * as Sentry from "@sentry/nextjs";

const SENTRY_DSN = process.env.SENTRY_DSN || process.env.NEXT_PUBLIC_SENTRY_DSN;

if (SENTRY_DSN) {
  Sentry.init({
    dsn: SENTRY_DSN,
    tracesSampleRate: 1.0,
  });
} else {
  console.log("[Sentry Edge] DSN not detected. Monitoring disabled.");
}
