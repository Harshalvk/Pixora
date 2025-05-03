"use client";

import React from "react";
import { ThemeProvider } from "@repo/ui/components/Providers/ThemeProvider";
import WalletContextProvider from "./Providers/WalletContextProvider";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@repo/ui/components/sonner";

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
          <Toaster />
          {children}
        </QueryClientProvider>
      </WalletContextProvider>
    </ThemeProvider>
  );
};

export default AppProvider;
