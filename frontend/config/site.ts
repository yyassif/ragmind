const SITE_URL =
  process.env.NODE_ENV === "production"
    ? "https://chat.yyassif.dev"
    : "http://localhost:3000";

export const siteConfig = {
  name: "RAGMind",
  title: "RAGMind - Get a Second Brain with Generative AI",
  description:
    "RAGMind is your second brain in the cloud, designed to easily store and retrieve unstructured information.",
  url: SITE_URL,
  ogImage: `${SITE_URL}/opengraph-image`,
  links: {
    twitter: "https://twitter.com/yassineyassif",
    github: "https://github.com/yyassif",
  },
  mailSupport: "yess.mapss@gmail.com",
};
