import Image from "next/image";
import { Header } from "@/components/layout/header";
import { CpfForm } from "@/components/landing/cpf-form";
import { Card } from "@/components/ui/card";

export default function Home() {
  return (
    <div className="flex min-h-screen w-full flex-col bg-background">
      <Header />
      <main className="flex-1">
        <section className="container mx-auto max-w-7xl px-4 py-16 md:py-24">
          <div className="mb-12 text-center">
            <span className="text-lg font-semibold text-primary">
              Nubank
            </span>
            <h1 className="mt-2 text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
              Empréstimos
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground md:text-xl">
              Transparentes, seguros e do seu jeito.
            </p>
          </div>

          <div className="grid items-start gap-12 md:grid-cols-2 lg:gap-16">
            <div className="flex items-center justify-center pt-0 md:pt-12">
              <Card className="w-full max-w-2xl overflow-hidden rounded-2xl shadow-lg border-none">
                <Image
                  src="https://placehold.co/600x400.png"
                  alt="Couple looking at a paper with a notebook on the table"
                  width={600}
                  height={400}
                  className="aspect-[3/2] w-full object-cover"
                  data-ai-hint="couple laptop"
                  priority
                />
              </Card>
            </div>

            <div className="flex items-center justify-center pt-0 md:pt-12">
               <CpfForm />
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
