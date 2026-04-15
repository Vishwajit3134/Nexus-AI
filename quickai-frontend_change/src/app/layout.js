import { Inter } from "next/font/google";
import { CreditProvider } from "@/components/contexts/CreditContext";
import "./globals.css";
import { ThemeProvider } from "./theme-provider";

// Configure the Inter font
const inter = Inter({
  subsets: ["latin"],
  display: "swap",
});

export const metadata = {
  title: "NexusAI",
  description: "AI Content Generation Platform",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      {/* Apply Inter globally along with Tailwind's antialiasing for crisp text */}
      <body className={`${inter.className} antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <CreditProvider>{children}</CreditProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
