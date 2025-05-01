import { ThemeProvider } from "@repo/ui/components/Providers/ThemeProvider";
import React from "react";

const AppProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      {children}
    </ThemeProvider>
  );
};

export default AppProvider;
