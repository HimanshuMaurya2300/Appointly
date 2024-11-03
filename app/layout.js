import localFont from "next/font/local";
import "./globals.css";
import Header from "@/components/Header";
import { ClerkProvider } from '@clerk/nextjs'
import CreateEvent from "@/components/CreateEvent";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata = {
  title: "Appointly",
  description: "Meeting Scheduling App",
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
          <Header />
          <main className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
            {children}
          </main>
          <footer className="bg-blue-100 py-6">
            <p className="container max-auto px-4 text-center text-gray-600">
              Made with ❤️ by @Himanshu
            </p>
          </footer>
          <CreateEvent />
        </body>
      </html>
    </ClerkProvider>
  );
}
