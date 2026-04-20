import type { Metadata } from "next";
import "./globals.css";
import AppSidebar from "@/components/layout/AppSidebar";

export const metadata: Metadata = {
  title: "DocRetrieve AI",
  description: "Intelligent Document Retrieval for Enterprises",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-full flex flex-col" suppressHydrationWarning={true}>
        <div className="flex h-screen bg-gray-50">
          <AppSidebar />
          <main className="flex-1 ml-72 overflow-auto">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}