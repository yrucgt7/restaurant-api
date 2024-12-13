"use client";

import { Provider } from "@/components/ui/provider";
import { ApolloProvider } from "@apollo/client";
import client from "../../lib/apollo-client";
import "./globals.css";
import { useState, useEffect } from "react";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const [themeClass, setThemeClass] = useState("light");

  useEffect(() => {
    
    const userPreferredTheme = window.localStorage.getItem("theme") || "light";
    setThemeClass(userPreferredTheme);
  }, []);

  return (
    <html lang="en" className={themeClass} suppressHydrationWarning>
      <body suppressHydrationWarning>
        <Provider>
          <ApolloProvider client={client}>{children}</ApolloProvider>
        </Provider>
      </body>
    </html>
  );
}
