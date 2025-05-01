"use client";

import { ThemeProvider } from "@repo/ui/components/Providers/ThemeProvider";
import React from "react";
import WalletContextProvider from "./Providers/WalletContextProvider";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const AppProvider = ({ children }: { children: React.ReactNode }) => {
  const queryClient = new QueryClient();
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <WalletContextProvider>
        <QueryClientProvider client={queryClient}>
          {children}
        </QueryClientProvider>
      </WalletContextProvider>
    </ThemeProvider>
  );
};

export default AppProvider;
