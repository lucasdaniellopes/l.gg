import Navbar from "@/components/Navbar";
import HomePage from "@/components/HomePage";
import { Suspense } from "react";
import { Spinner } from "@heroui/react";

export default function Home() {
  return (
    <div className="min-h-screen page-background">
      <Navbar />
      <Suspense fallback={
        <main className="container mx-auto px-4 py-8">
          <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
            <Spinner size="lg" color="primary" />
            <div className="text-center">
              <h2 className="text-lg font-semibold text-foreground">Loading champions...</h2>
              <p className="text-sm text-default-500">Fetching League of Legends data</p>
            </div>
          </div>
        </main>
      }>
        <HomePage />
      </Suspense>
    </div>
  );
}
