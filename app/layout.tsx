import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "RepurposeToday — Your Next Chapter Starts Here",
  description:
    "Discover your purpose in the age of AI. Guided Ikigai assessment, community cohorts, and peer skill-sharing for workers navigating career transitions.",
  openGraph: {
    title: "RepurposeToday — Your Next Chapter Starts Here",
    description:
      "AI is changing everything. Discover what you could become — not just what you could learn.",
    type: "website",
    url: "https://repurposetoday.com",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-body bg-warm-50 text-warm-900 antialiased">
        {children}
      </body>
    </html>
  );
}
