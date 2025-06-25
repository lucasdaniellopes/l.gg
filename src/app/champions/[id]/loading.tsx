import { Spinner, Skeleton, Card, CardBody } from "@heroui/react";
import Navbar from "@/components/Navbar";

export default function Loading() {
  return (
    <div className="min-h-screen">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8">
        <div className="relative rounded-lg overflow-hidden mb-8">
          <Skeleton className="w-full h-[400px]" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <Card>
              <CardBody className="p-6">
                <Skeleton className="w-32 h-6 mb-4" />
                <div className="space-y-4">
                  {[...Array(4)].map((_, i) => (
                    <div key={i}>
                      <Skeleton className="w-full h-4 mb-2" />
                      <Skeleton className="w-full h-2" />
                    </div>
                  ))}
                </div>
              </CardBody>
            </Card>
          </div>

          <div className="lg:col-span-2">
            <Card>
              <CardBody className="p-6">
                <div className="flex justify-center items-center py-20">
                  <div className="text-center">
                    <Spinner size="lg" color="primary" />
                    <p className="mt-4 text-lg text-default-500">
                      Loading champion details...
                    </p>
                  </div>
                </div>
              </CardBody>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}