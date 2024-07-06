import { fontHeading, fontSans, fontUrban } from "@/config/fonts";
import { siteConfig } from "@/config/site";
import { SupabaseProvider } from "@/lib/context/SupabaseProvider";
import { createClient } from "@/lib/supabase/server";
import { cn } from "@/lib/utils";

import Providers from "./providers";

import "@/styles/globals.scss";

export const metadata = {
  title: {
    default: siteConfig.title,
    template: `%s | ${siteConfig.title}`,
  },
  description: siteConfig.description,
  keywords: ["AI", "RAG"],
  authors: [
    {
      name: "yyassif",
    },
  ],
  creator: "yassif",
  metadataBase: new URL(siteConfig.url),
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteConfig.url,
    title: siteConfig.title,
    description: siteConfig.description,
    siteName: siteConfig.name,
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.title,
    description: siteConfig.description,
    images: [siteConfig.ogImage],
    creator: "@yyassif",
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
  // manifest: `${siteConfig.url}/site.webmanifest`,
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}): Promise<JSX.Element> {
  const supabase = createClient();

  const {
    data: { session },
  } = await supabase.auth.getSession();

  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
          fontSans.variable,
          fontUrban.variable,
          fontHeading.variable
        )}
      >
        <SupabaseProvider session={session}>
          <Providers>{children}</Providers>
        </SupabaseProvider>
      </body>
    </html>
  );
}
