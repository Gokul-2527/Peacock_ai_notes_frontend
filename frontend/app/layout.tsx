import "./globals.css";
import { ThemeProvider } from "next-themes";
import type { Metadata } from "next";
import { Toaster } from "react-hot-toast";
import { SearchProvider } from "@/context/HeaderSearch";

export const metadata: Metadata = {
  title: "AI Notes App",
  description: "Smart note-taking with AI features",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
      <SearchProvider>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
        <Toaster
          position="top-center"
          toastOptions={{
            duration: 3000,
            style: { background: "#333", color: "#fff" },
          }}
        /></SearchProvider>
      </body>
    </html>
  );
}
