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

          <div className="flex flex-col items-center gap-12">
            <div className="flex items-center justify-center">
              <Card className="w-full max-w-2xl overflow-hidden rounded-2xl shadow-lg border-none">
                <div className="aspect-video w-full">
                  <iframe
                    className="pointer-events-none h-full w-full"
                    src="https://www.youtube.com/embed/_LMIC2ZZ57A?autoplay=1&mute=1&controls=0&showinfo=0&rel=0&loop=1&playlist=_LMIC2ZZ57A"
                    title="YouTube video player"
                    frameBorder="0"
                    allow="autoplay; encrypted-media"
                  ></iframe>
                </div>
              </Card>
            </div>

            <div className="flex items-center justify-center">
               <CpfForm />
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
