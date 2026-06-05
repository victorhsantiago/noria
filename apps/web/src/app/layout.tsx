import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";
import "@noria/ui/styles.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import { Toaster } from "@noria/ui";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Noria",
  description: "Manage your events with ease.",
};

const RootLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <html lang="en" className={outfit.variable} suppressHydrationWarning>
      <body>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}

export default RootLayout;
