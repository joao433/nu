import { Header } from "@/components/layout/header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";

export default function EmprestimoPage() {
  return (
    <div className="flex min-h-screen w-full flex-col bg-background">
      <Header />
      <main className="flex-1">
        <section className="container mx-auto max-w-7xl px-4 py-16 md:py-24">
          <div className="mb-12 text-left">
             <span className="text-base font-semibold text-primary">
              Empréstimo Pessoal
            </span>
            <h1 className="mt-2 text-4xl font-bold tracking-tight text-foreground">
              Proposta de empréstimo pré-aprovada
            </h1>
            <p className="mt-4 max-w-2xl text-base text-muted-foreground">
              Encontramos uma oferta especial para você. Confira os detalhes abaixo.
            </p>
          </div>
          
          <div className="flex justify-center">
            <Card className="w-full max-w-2xl shadow-lg border-none bg-card rounded-2xl p-8">
              <CardHeader className="p-0 mb-6">
                <div className="flex items-center gap-4">
                  <div className="bg-primary/10 p-3 rounded-full">
                    <CheckCircle className="h-8 w-8 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-2xl font-bold">Você tem R$ 10.000,00 disponíveis</CardTitle>
                    <CardDescription className="text-base text-muted-foreground mt-1">
                      Dinheiro na sua conta em instantes, sem burocracia.
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <div className="space-y-4">
                  <div className="flex justify-between items-center border-b pb-4">
                    <span className="text-muted-foreground">Valor a ser pago</span>
                    <span className="font-bold text-lg">12x de R$ 990,54</span>
                  </div>
                   <div className="flex justify-between items-center border-b pb-4">
                    <span className="text-muted-foreground">Taxa de juros</span>
                    <span className="font-bold text-lg">3.9% a.m.</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Primeiro vencimento</span>
                    <span className="font-bold text-lg">Em até 60 dias</span>
                  </div>
                </div>
                <Button className="w-full h-12 mt-8 text-lg">
                  Contratar empréstimo
                </Button>
                <Button variant="ghost" className="w-full h-12 mt-2 text-lg text-primary">
                  Ver outras opções
                </Button>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>
    </div>
  );
}
