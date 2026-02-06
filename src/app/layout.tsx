import { ClerkProvider } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import { QueryProvider } from "@/components/query-provider";
import { TailwindIndicator } from "@/components/tailwind-indicator";
import { siteConfig } from "@/lib/config";
import { fontSans } from "@/lib/fonts";
import { cn, constructMetadata } from "@/lib/utils";
import type { Metadata, Viewport } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import "./globals.css";

export const metadata: Metadata = constructMetadata({
  title: `${siteConfig.name} | ${siteConfig.description}`,
});

export const viewport: Viewport = {
  colorScheme: "dark",
  themeColor: "black",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider appearance={{ baseTheme: dark }}>
      <html
        lang="en"
        className={`dark ${GeistSans.variable} ${GeistMono.variable} ${fontSans.variable}`}
      >
        <body
          className={cn(
            "min-h-screen bg-background antialiased w-full mx-auto scroll-smooth font-sans"
          )}
        >
          <QueryProvider>
            {children}
          </QueryProvider>
          <TailwindIndicator />
        </body>
      </html>
    </ClerkProvider>
  );
}
