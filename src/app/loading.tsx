import { Spinner } from "@heroui/react";

export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <Spinner size="lg" color="primary" />
        <p className="mt-4 text-lg text-default-500">Carregando...</p>
      </div>
    </div>
  );
}