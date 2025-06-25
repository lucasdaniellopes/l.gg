import { Button, Card, CardBody } from "@heroui/react";
import Link from "next/link";
import Navbar from "@/components/Navbar";

export default function NotFound() {
  return (
    <div className="min-h-screen">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center min-h-[60vh]">
          <Card className="max-w-md w-full">
            <CardBody className="text-center space-y-4 p-8">
              <div className="text-6xl font-bold text-primary">404</div>
              <h2 className="text-2xl font-bold">Page not found</h2>
              <p className="text-default-500">
                The champion you seek does not exist or has been banned from the Rift.
              </p>
              <Button as={Link} href="/" color="primary" size="lg">
                Voltar para a Rift
              </Button>
            </CardBody>
          </Card>
        </div>
      </main>
    </div>
  );
}