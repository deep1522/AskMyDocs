import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "../components/theme-provider";
import Header from "../components/header";
import { ClerkProvider } from "@clerk/nextjs";

const inter = Inter({subsets: ["latin"]});


export const metadata = {
  title: "YOUR PERSONAL AI ASSISTANCE",
  description: "RAG APPLICATION.",
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider appearance={{baseTheme:"dark"}}>
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.className}`}
      >
       <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange
          >
            {/* {header} */}
            <Header/>
    
            <main className="min-h-screen">{children}</main>
            {/* {Footer} */}
            <footer className="bg-muted/50 py-12">
              <div className="container mx-auto px-4 text-center text-gray-200">
                <p>Made by Deep1522</p>
              </div>
            </footer>
          </ThemeProvider>
      </body>
    </html>
    </ClerkProvider>
  );
}
