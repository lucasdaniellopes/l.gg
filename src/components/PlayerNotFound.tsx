"use client";

import { Card, CardBody, Chip } from "@heroui/react";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

interface PlayerNotFoundProps {
  error?: string;
  title?: string;
}

export default function PlayerNotFound({ error, title = "Player not found" }: PlayerNotFoundProps) {
  return (
    <main className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-6">
        <Link 
          href="/player" 
          className="inline-flex items-center gap-2 text-primary hover:underline"
        >
          <ArrowLeft className="w-4 h-4" />
          Voltar para pesquisa
        </Link>
      </div>
      
      <Card>
        <CardBody className="p-6">
          <div className="text-center">
            <Chip color="danger" variant="flat" className="mb-4">
              Erro
            </Chip>
            <h3 className="text-lg font-semibold mb-2">{title}</h3>
            {error && (
              <p className="text-sm text-default-500">
                {error}
              </p>
            )}
          </div>
        </CardBody>
      </Card>
    </main>
  );
}