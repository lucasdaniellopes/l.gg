"use client";

import { HeroUIProvider } from "@heroui/react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { SessionProvider } from "next-auth/react";
import { TRPCReactProvider } from "@/app/_trpc/client";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <TRPCReactProvider>
        <HeroUIProvider>
          <NextThemesProvider 
            attribute="class" 
            defaultTheme="dark" 
            enableSystem={false}
            themes={['light', 'dark']}
          >
            {children}
          </NextThemesProvider>
        </HeroUIProvider>
      </TRPCReactProvider>
    </SessionProvider>
  );
}