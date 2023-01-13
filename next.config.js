const ContentSecurityPolicy = `
  default-src 'self';
  img-src * data: blob:;
  media-src * data: blob:;
  object-src 'none';
  style-src 'self' 'unsafe-inline';
  font-src 'self';
  frame-src *;
  script-src 'self' 'unsafe-eval' 'unsafe-inline' *.web3sdks.com vercel.live;
  connect-src * data:;
  block-all-mixed-content;
`;

const securityHeaders = [
  {
    key: "X-DNS-Prefetch-Control",
    value: "on",
  },
  {
    key: "X-XSS-Protection",
    value: "1; mode=block",
  },
  {
    key: "X-Frame-Options",
    value: "SAMEORIGIN",
  },
  {
    key: "Referrer-Policy",
    value: "origin-when-cross-origin",
  },
  {
    key: "Content-Security-Policy",
    value: ContentSecurityPolicy.replace(/\s{2,}/g, " ").trim(),
  },
];

// eslint-disable-next-line @typescript-eslint/no-var-requires
const redirects = require("./redirects");

/** @type {import('next').NextConfig} */
const moduleExports = {
  async headers() {
    return [
      {
        // Apply these headers to all routes in your application.
        source: "/(.*)",
        headers: securityHeaders,
      },
    ];
  },
  async redirects() {
    return redirects();
  },
  async rewrites() {
    return [
      {
        source: "/web3sdks.eth",
        destination: "/deployer.web3sdks.eth",
      },
      {
        source: "/web3sdks.eth/:path*",
        destination: "/deployer.web3sdks.eth/:path*",
      },
    ];
  },
  images: {
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**.web3sdks.com",
      },
    ],
  },
  reactStrictMode: true,
  experimental: {
    scrollRestoration: true,
  },
  compiler: {
    emotion: true,
  },
};

// eslint-disable-next-line @typescript-eslint/no-var-requires
const withBundleAnalyzer = require("@next/bundle-analyzer")({
  enabled: process.env.ANALYZE === "true",
});

// eslint-disable-next-line @typescript-eslint/no-var-requires
const { withSentryConfig } = require("@sentry/nextjs");

// eslint-disable-next-line @typescript-eslint/no-var-requires
const { withPlausibleProxy } = require("next-plausible");

const sentryWebpackPluginOptions = {
  // Additional config options for the Sentry Webpack plugin. Keep in mind that
  // the following options are set automatically, and overriding them is not
  // recommended:
  //   release, url, org, project, authToken, configFile, stripPrefix,
  //   urlPrefix, include, ignore

  // Suppresses all logs
  silent: true,
  // For all available options, see:
  // https://github.com/getsentry/sentry-webpack-plugin#options.

  hideSourceMaps: false,
};

const enhancedModuleExports = withPlausibleProxy({
  customDomain: "https://pl.web3sdks.com",
  scriptName: "pl",
})(
  withBundleAnalyzer(
    withSentryConfig(moduleExports, sentryWebpackPluginOptions),
  ),
);
// eslint-disable-next-line @typescript-eslint/no-var-requires
module.exports = require("lodash.merge")(moduleExports, enhancedModuleExports);
