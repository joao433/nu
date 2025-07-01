import { Header } from "@/components/layout/header";
import { CpfForm } from "@/components/landing/cpf-form";
import { Card } from "@/components/ui/card";
import Script from "next/script";
import React from "react";

export default function Home() {
  return (
    <>
      <Script src="https://fast.wistia.com/player.js" strategy="lazyOnload" />
      <Script
        src="https://fast.wistia.com/embed/44ord6sjrn.js"
        strategy="lazyOnload"
        type="module"
      />

      <div className="flex min-h-screen w-full flex-col bg-background">
        <Header />
        <main className="flex-1">
          <section className="container mx-auto max-w-7xl px-4 py-16 md:py-24">
            <div className="mb-12 text-left">
              <span className="text-base font-semibold text-primary">
                Nubank
              </span>
              <h1 className="mt-2 text-4xl font-bold tracking-tight text-foreground">
                Empréstimos
              </h1>
              <p className="mt-4 max-w-2xl text-base text-muted-foreground">
                Transparentes, seguros e do seu jeito.
              </p>
            </div>

            <div className="flex flex-col items-center gap-12">
              <div className="flex items-center justify-center">
                <Card className="w-full max-w-5xl overflow-hidden rounded-2xl shadow-lg border-none">
                  <div className="aspect-video w-full">
                    <style>{`
                      wistia-player[media-id='44ord6sjrn']:not(:defined) { 
                        background: center / contain no-repeat url('https://fast.wistia.com/embed/medias/44ord6sjrn/swatch'); 
                        display: block; 
                        filter: blur(5px); 
                      }
                    `}</style>
                    {React.createElement("wistia-player", {
                      "media-id": "44ord6sjrn",
                      "wistia-popover": "true",
                      aspect: "0.5625",
                      style: { width: "100%", height: "100%" },
                    })}
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
    </>
  );
}
