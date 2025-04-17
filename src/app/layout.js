import { Inter } from "next/font/google";
import "../styles/globals.css";

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: "Farmsync - Connecting Agriculture",
  description: "Farmsync is a revolutionary platform that connects farmers with researchers and policymakers",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={inter.className}
      >
        {children}
      </body>
    </html>
  );
}
