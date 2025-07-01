"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Header } from "@/components/layout/header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";

export default function SimularEmprestimoPage() {
  const router = useRouter();
  const [amount, setAmount] = useState(2500);
  const [installments, setInstallments] = useState(12);
  const [paymentDay, setPaymentDay] = useState<number>(60);

  const interestRate = 0.039; // 3.9% a.m.

  const calculateInstallment = () => {
    if (amount <= 0 || installments <= 0) {
      return 0;
    }
    const i = interestRate;
    const n = installments;
    const P = amount;
    
    if (i === 0) {
      return P / n;
    }

    const monthlyPayment = (P * i * Math.pow(1 + i, n)) / (Math.pow(1 + i, n) - 1);
    return monthlyPayment;
  };

  const monthlyPayment = calculateInstallment();

  const handleContinue = () => {
    router.push("/emprestimo");
  };

  return (
    <div className="flex min-h-screen w-full flex-col bg-background">
      <Header />
      <main className="flex-1">
        <section className="container mx-auto max-w-7xl px-4 py-16 md:py-24">
          <div className="mb-12 text-left">
            <span className="text-base font-semibold text-primary">
              Simulação de Empréstimo
            </span>
            <h1 className="mt-2 text-4xl font-bold tracking-tight text-foreground">
              Simule e contrate do seu jeito
            </h1>
            <p className="mt-4 max-w-2xl text-base text-muted-foreground">
              Escolha o valor que você precisa e em quantas vezes quer pagar.
            </p>
          </div>
          
          <div className="flex justify-center">
            <Card className="w-full max-w-2xl shadow-lg border-none bg-card rounded-2xl p-8">
              <CardHeader className="p-0 mb-8">
                <CardTitle className="text-2xl font-bold">Simulador de Empréstimo</CardTitle>
                <CardDescription className="text-base text-muted-foreground mt-1">
                  Ajuste os valores como preferir.
                </CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <div className="space-y-8">
                  <div className="space-y-4">
                    <div className="flex justify-between items-baseline">
                      <Label htmlFor="amount" className="text-base text-muted-foreground">Quanto você quer pegar?</Label>
                      <span className="font-bold text-2xl text-primary">
                        {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(amount)}
                      </span>
                    </div>
                    <Slider
                      id="amount"
                      min={500}
                      max={5000}
                      step={100}
                      value={[amount]}
                      onValueChange={(value) => setAmount(value[0])}
                    />
                     <div className="flex justify-between text-sm text-muted-foreground">
                        <span>R$ 500</span>
                        <span>R$ 5.000</span>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex justify-between items-baseline">
                      <Label htmlFor="installments" className="text-base text-muted-foreground">Em quantas parcelas?</Label>
                      <span className="font-bold text-2xl text-primary">
                        {installments}x
                      </span>
                    </div>
                     <Slider
                      id="installments"
                      min={3}
                      max={24}
                      step={1}
                      value={[installments]}
                      onValueChange={(value) => setInstallments(value[0])}
                    />
                     <div className="flex justify-between text-sm text-muted-foreground">
                        <span>3 meses</span>
                        <span>24 meses</span>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <Label className="text-base text-muted-foreground">Primeiro vencimento em?</Label>
                    <div className="grid grid-cols-3 gap-2 md:gap-4">
                      <Button
                        variant={paymentDay === 30 ? "default" : "outline"}
                        onClick={() => setPaymentDay(30)}
                        className="h-16"
                      >
                        30 dias
                      </Button>
                      <Button
                        variant={paymentDay === 60 ? "default" : "outline"}
                        onClick={() => setPaymentDay(60)}
                        className="h-16"
                      >
                        60 dias
                      </Button>
                      <Button
                        variant={paymentDay === 120 ? "default" : "outline"}
                        onClick={() => setPaymentDay(120)}
                        className="h-16 flex-col p-1 leading-tight"
                      >
                        <span>120 dias</span>
                        <span className="text-xs font-light opacity-80">(Sujeito a análise)</span>
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="mt-8 border-t pt-6 text-center">
                    <p className="text-base text-muted-foreground">Valor da parcela mensal:</p>
                    <p className="text-4xl font-bold text-foreground mt-2">
                        {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(monthlyPayment)}
                    </p>
                     <p className="text-sm text-muted-foreground mt-1">Taxa de juros de 3.9% a.m.</p>
                </div>

                <Button className="w-full h-12 mt-8 text-lg" onClick={handleContinue}>
                  Ver proposta pré-aprovada
                </Button>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>
    </div>
  );
}
