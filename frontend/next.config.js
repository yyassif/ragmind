// Define the Next.js configuration options
const nextConfig = {
  output: "standalone",
  images: {
    remotePatterns: [
      {
        hostname: "yyassif.dev",
      },
      {
        hostname: "yyasif.dev",
      },
      {
        hostname: "chat.yyassif.dev",
      },
      {
        hostname: "ragmind.yyasif.dev",
      },
      {
        hostname: "ragmind.s3.eu-west-3.amazonaws.com",
      },
      {
        hostname: "www.gravatar.com",
      },
      {
        hostname: "media.licdn.com",
      },
    ],
  },
  // eslint-disable-next-line prefer-arrow/prefer-arrow-functions
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: securityHeaders,
      },
    ];
  },
};

const ContentSecurityPolicy = {
  "default-src": [
    "'self'",
    "https://fonts.googleapis.com",
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    "https://*.yyassif.dev",
    "https://*.vercel.app",
    "https://*.yyasif.dev",
    process.env.NEXT_PUBLIC_FRONTEND_URL,
  ],
  "connect-src": [
    "'self'",
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_URL.replace("https", "wss"),
    process.env.NEXT_PUBLIC_SUPABASE_URL.replace("http", "ws"),
    process.env.NEXT_PUBLIC_BACKEND_URL,
    "https://api.openai.com",
    "https://cdn.growthbook.io",
    "https://vitals.vercel-insights.com/v1/vitals",
  ],
  "img-src": [
    "'self'",
    "https://www.gravatar.com",
    "https://ragmind.s3.eu-west-3.amazonaws.com",
    "data:",
    "*",
  ],
  "media-src": [
    "'self'",
    "https://user-images.githubusercontent.com",
    process.env.NEXT_PUBLIC_FRONTEND_URL,
    "https://ragmind.s3.eu-west-3.amazonaws.com",
    "https://*.vercel.app",
    "https://*.yyassif.dev",
    "https://*.yyasif.dev",
  ],
  "script-src": [
    "'unsafe-inline'",
    "'unsafe-eval'",
    "https://va.vercel-scripts.com/",
    process.env.NEXT_PUBLIC_FRONTEND_URL,
    "https://*.vercel.app",
    "https://*.yyasif.dev",
    "https://www.google-analytics.com/",
  ],
  "frame-ancestors": ["'none'"],
  "style-src": [
    "'unsafe-inline'",
    process.env.NEXT_PUBLIC_FRONTEND_URL,
    "https://*.vercel.app",
    "https://*.yyasif.dev",
  ],
};

// Build CSP string
const cspString = Object.entries(ContentSecurityPolicy)
  .map(([key, values]) => `${key} ${values.join(" ")};`)
  .join(" ");

// Define Headers
const securityHeaders = [
  {
    key: "Content-Security-Policy",
    value: cspString,
  },
  {
    key: "Referrer-Policy",
    value: "origin-when-cross-origin",
  },
  {
    key: "X-Frame-Options",
    value: "SAMEORIGIN",
  },
  {
    key: "X-Content-Type-Options",
    value: "nosniff",
  },
  {
    key: "X-DNS-Prefetch-Control",
    value: "on",
  },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), interest-cohort=()",
  },
  {
    key: "Strict-Transport-Security",
    value: "max-age=31536000",
  },
];

// Check if the SENTRY_DSN environment variable is defined
if (process.env.NEXT_PUBLIC_SENTRY_DSN) {
  // NEXT_PUBLIC_SENTRY_DSN exists, include Sentry configuration
  const { withSentryConfig } = require("@sentry/nextjs");

  const sentryWebpackPluginOptions = {
    // For all available options, see:
    // https://github.com/getsentry/sentry-webpack-plugin#options

    // Suppresses source map uploading logs during build
    silent: true,
    org: "ragenius",
    project: "ragenius",
    authToken: process.env.SENTRY_AUTH_TOKEN,
  };

  // Set the Sentry configuration options for the Next.js app
  nextConfig.sentry = {
    // For all available options, see:
    // https://docs.sentry.io/platforms/javascript/guides/nextjs/manual-setup/

    // Upload a larger set of source maps for prettier stack traces (increases build time)
    widenClientFileUpload: true,

    // Transpiles SDK to be compatible with IE11 (increases bundle size)
    transpileClientSDK: true,

    // Routes browser requests to Sentry through a Next.js rewrite to circumvent ad-blockers (increases server load)
    tunnelRoute: "/monitoring",

    // Hides source maps from generated client bundles
    hideSourceMaps: true,

    // Automatically tree-shake Sentry logger statements to reduce bundle size
    disableLogger: true,

    // Enables automatic instrumentation of Vercel Cron Monitors.
    // See the following for more information:
    // https://docs.sentry.io/product/crons/
    // https://vercel.com/docs/cron-jobs
    automaticVercelMonitors: true,
  };

  module.exports = withSentryConfig(nextConfig, sentryWebpackPluginOptions);
} else {
  // NEXT_PUBLIC_SENTRY_DSN does not exist, export nextConfig without Sentry
  module.exports = nextConfig;
}
